import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";

import ModalPortal from "../../../components/ui/ModalPortal";
import Button from "../../../components/ui/Button";
import type { CheckoutState } from "../hooks/useCheckout";

interface Props {
  state: CheckoutState;
  onClose: () => void;
}

/**
 * Our own dialog around the Razorpay window: "getting ready", "confirming your
 * payment", and the final result. While Razorpay's window is open this renders nothing.
 */
export default function CheckoutStatusModal({ state, onClose }: Props) {
  const { phase, planName, message, paymentId } = state;

  if (phase === "idle") return null;

  const working = phase === "starting" || phase === "confirming";

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-heading/60 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
      >
        <div className="w-full max-w-sm rounded-2xl border border-border-popup bg-popup p-6 text-center shadow-2xl">
          {working && (
            <>
              <Loader2
                size={40}
                className="mx-auto animate-spin text-heading"
              />
              <h2 className="mt-4 text-lg font-bold text-heading">
                {phase === "starting"
                  ? "Opening secure payment…"
                  : "Confirming your payment…"}
              </h2>
              <p className="mt-2 text-sm text-nav-text">
                {phase === "starting"
                  ? "Just a moment."
                  : "Please don't close or refresh this page. This takes a few seconds."}
              </p>
            </>
          )}

          {phase === "success" && (
            <>
              <CheckCircle2 size={44} className="mx-auto text-green-600" />
              <h2 className="mt-4 text-lg font-bold text-heading">
                Payment successful
              </h2>
              <p className="mt-2 text-sm text-nav-text">
                {planName
                  ? `Your ${planName} credits have been added.`
                  : "Your credits have been added."}{" "}
                They never expire.
              </p>
              <Button fullWidth className="mt-6" onClick={onClose}>
                Continue
              </Button>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="mt-3 block text-sm font-medium text-heading underline"
              >
                Go to dashboard
              </Link>
            </>
          )}

          {phase === "pending" && (
            <>
              <Clock size={44} className="mx-auto text-amber-600" />
              <h2 className="mt-4 text-lg font-bold text-heading">
                Payment received
              </h2>
              <p className="mt-2 text-sm text-nav-text">{message}</p>
              <Button fullWidth className="mt-6" onClick={onClose}>
                OK
              </Button>
            </>
          )}

          {phase === "failed" && (
            <>
              <AlertCircle size={44} className="mx-auto text-red-500" />
              <h2 className="mt-4 text-lg font-bold text-heading">
                Payment not completed
              </h2>
              <p className="mt-2 text-sm text-nav-text">{message}</p>
              <Button fullWidth className="mt-6" onClick={onClose}>
                Close
              </Button>
            </>
          )}

          {(phase === "pending" || phase === "failed") && paymentId && (
            <p className="mt-4 break-all text-xs text-nav-text/70">
              Payment ID: {paymentId}
            </p>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
