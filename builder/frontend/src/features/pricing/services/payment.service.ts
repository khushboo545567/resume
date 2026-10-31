import api from "../../../api/axios";

export type CreditType =
  | "resumeRuns"
  | "resumeEdits"
  | "coverRuns"
  | "coverEdits"
  | "interview5"
  | "interview10"
  | "interview15"
  | "atsChecks"
  | "resumeUploads";

export type CreditBalances = Record<CreditType, number>;

export interface CreatedOrder {
  /** Our own payment record id (sent back to /verify). */
  paymentId: string;
  /** Razorpay order id. */
  orderId: string;
  /** Paise, as Razorpay Checkout expects. */
  amount: number;
  currency: string;
  /** Public Razorpay key id (test or live, decided by the server). */
  keyId: string;
  planId: string;
  description: string;
}

export interface VerifyPaymentInput {
  paymentId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResult {
  paymentId: string;
  planId: string;
  /** "processing" = paid, credits are still being added. */
  status: "fulfilled" | "processing";
  credits: CreditBalances;
}

export interface PaymentStatus {
  paymentId: string;
  planId: string;
  paymentStatus: "created" | "paid" | "failed" | "refunded";
  fulfillmentStatus: "pending" | "processing" | "fulfilled" | "failed";
  error?: string;
}

export const getCredits = async (): Promise<CreditBalances> => {
  const { data } = await api.get("/payments/credits");
  return data.data.credits;
};

/** Only the plan id is sent. The server decides the price. */
export const createOrder = async (planId: string): Promise<CreatedOrder> => {
  const { data } = await api.post("/payments/orders", { planId });
  return data.data;
};

export const verifyPayment = async (
  input: VerifyPaymentInput,
): Promise<VerifyPaymentResult> => {
  // The server may wait a few seconds for the credits to be added.
  const { data } = await api.post("/payments/verify", input, {
    timeout: 30000,
  });
  return data.data;
};

export const getPaymentStatus = async (
  paymentId: string,
): Promise<PaymentStatus> => {
  const { data } = await api.get(`/payments/${paymentId}`);
  return data.data;
};
