import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { CREDITS_QUERY_KEY } from "../../../api/axios";
import { useAuthStore } from "../../../store/auth.store";
import {
  createOrder,
  getCredits,
  getPaymentStatus,
  verifyPayment,
} from "../services/payment.service";
import type { CreatedOrder } from "../services/payment.service";
import { loadRazorpay } from "../utils/razorpay";
import type { RazorpaySuccessResponse } from "../utils/razorpay";
import type { Plan } from "../plans";

export type CheckoutPhase =
  | "idle"
  | "starting" // creating the order / loading the payment window
  | "confirming" // paid, waiting for the server to confirm and add credits
  | "success"
  | "pending" // paid, but credits are not in yet (the server keeps retrying)
  | "failed"; // nothing was charged, or the payment could not be verified

export interface CheckoutState {
  phase: CheckoutPhase;
  planName?: string;
  message?: string;
  /** Shown to the user so support can find the payment. */
  paymentId?: string;
}

const POLL_EVERY_MS = 2000;
const POLL_FOR_MS = 40000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const apiMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
};

/**
 * Buy flow: create order -> open Razorpay Checkout -> verify -> show the result.
 *
 * Money safety rules this hook follows:
 *  - It only ever sends a plan id; the server decides the price.
 *  - Once Razorpay says "paid", it never shows a plain failure: if confirming
 *    with our server fails for any reason other than a definite rejection, it
 *    checks the payment status instead, because the webhook may still add the
 *    credits.
 */
export function useCheckout() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [state, setState] = useState<CheckoutState>({ phase: "idle" });

  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const update = useCallback((next: CheckoutState) => {
    if (mounted.current) setState(next);
  }, []);

  const refreshCredits = useCallback(async () => {
    try {
      queryClient.setQueryData(CREDITS_QUERY_KEY, await getCredits());
    } catch {
      void queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
    }
  }, [queryClient]);

  /** After a payment the server has not finished yet: wait for it. */
  const waitForCredits = useCallback(
    async (order: CreatedOrder, planName: string) => {
      const startedAt = Date.now();

      while (mounted.current && Date.now() - startedAt < POLL_FOR_MS) {
        try {
          const status = await getPaymentStatus(order.paymentId);

          if (status.fulfillmentStatus === "fulfilled") {
            await refreshCredits();
            update({ phase: "success", planName, paymentId: order.paymentId });
            return;
          }

          if (status.fulfillmentStatus === "failed") break;
        } catch {
          // Network blip: keep trying until the time is up.
        }

        await sleep(POLL_EVERY_MS);
      }

      update({
        phase: "pending",
        planName,
        paymentId: order.paymentId,
        message:
          "We received your payment, but your credits are not added yet. They are added automatically within a few minutes. If they don't show up, contact support with the payment ID below.",
      });
    },
    [refreshCredits, update],
  );

  const confirmPayment = useCallback(
    async (
      order: CreatedOrder,
      response: RazorpaySuccessResponse,
      planName: string,
    ) => {
      update({ phase: "confirming", planName, paymentId: order.paymentId });

      try {
        const result = await verifyPayment({
          paymentId: order.paymentId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        if (result.status === "fulfilled") {
          queryClient.setQueryData(CREDITS_QUERY_KEY, result.credits);
          update({ phase: "success", planName, paymentId: order.paymentId });
        } else {
          await waitForCredits(order, planName);
        }
      } catch (error) {
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;

        // The server looked at it and said no: the payment is not valid.
        if (status === 400 || status === 404) {
          update({
            phase: "failed",
            planName,
            paymentId: order.paymentId,
            message: apiMessage(
              error,
              "We could not verify this payment. If money was deducted, contact support with the payment ID below.",
            ),
          });
          return;
        }

        // Network error, timeout or a server error while adding credits. The
        // user HAS paid, so check the status (the webhook may finish the job).
        await waitForCredits(order, planName);
      }
    },
    [queryClient, update, waitForCredits],
  );

  const buy = useCallback(
    async (plan: Plan) => {
      if (busy.current) return; // double click / second plan while one is open
      busy.current = true;

      update({ phase: "starting", planName: plan.name });

      let order: CreatedOrder;
      try {
        const [created] = await Promise.all([
          createOrder(plan.id),
          loadRazorpay(),
        ]);
        order = created;
      } catch (error) {
        busy.current = false;
        update({
          phase: "failed",
          planName: plan.name,
          message: apiMessage(
            error,
            "We couldn't open the payment window. Check your connection and try again.",
          ),
        });
        return;
      }

      if (!window.Razorpay) {
        busy.current = false;
        update({
          phase: "failed",
          planName: plan.name,
          message: "The payment window could not be loaded. Please try again.",
        });
        return;
      }

      let paid = false;
      let lastFailure: string | null = null;

      const checkout = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Throne8 Resume Builder",
        description: order.description,
        prefill: { name: user?.fullName, email: user?.email },
        theme: { color: "#38281e" },
        handler: (response) => {
          paid = true;
          void confirmPayment(order, response, plan.name).finally(() => {
            busy.current = false;
          });
        },
        modal: {
          ondismiss: () => {
            if (paid) return; // closing after a successful payment
            busy.current = false;
            update(
              lastFailure
                ? { phase: "failed", planName: plan.name, message: lastFailure }
                : { phase: "idle" },
            );
          },
        },
      });

      // Razorpay keeps its window open and offers "Retry" after a failed attempt,
      // so only remember the reason here; ondismiss reports it if they give up.
      checkout.on("payment.failed", (failure) => {
        lastFailure =
          failure.error.description ||
          "The payment did not go through. Please try again or use another payment method.";
      });

      update({ phase: "idle" }); // our own dialog steps aside for Razorpay's
      checkout.open();
    },
    [confirmPayment, update, user?.email, user?.fullName],
  );

  const reset = useCallback(() => {
    if (busy.current) return;
    setState({ phase: "idle" });
  }, []);

  return { state, buy, reset, isBusy: state.phase !== "idle" };
}
