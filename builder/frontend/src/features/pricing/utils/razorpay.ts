/** Minimal typing for the parts of Razorpay Checkout this app uses. */

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: {
    code?: string;
    description?: string;
    reason?: string;
    metadata?: { order_id?: string; payment_id?: string };
  };
}

export interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  retry?: { enabled: boolean };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void; confirm_close?: boolean };
}

export interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailureResponse) => void,
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loading: Promise<void> | null = null;

/** Loads Razorpay Checkout once. Resolves immediately if it is already there. */
export const loadRazorpay = (): Promise<void> => {
  if (window.Razorpay) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      loading = null; // allow a retry on the next click
      reject(new Error("Could not load the payment window."));
    };
    document.body.appendChild(script);
  });

  return loading;
};
