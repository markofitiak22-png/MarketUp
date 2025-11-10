"use client";
import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface WalletPaymentButtonProps {
  amount: number;
  planName: string;
  planId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

function WalletPaymentButtonInner({
  amount,
  planName,
  planId,
  onSuccess,
  onError,
  onCancel,
}: WalletPaymentButtonProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!stripe) return;

    // Create Payment Request
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: `${planName} Plan`,
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Payment Request is available
    pr.canMakePayment().then((result) => {
      setIsAvailable(result !== null);
      if (result) {
        setPaymentRequest(pr);
      }
    });

    // Handle payment method
    pr.on("paymentmethod", async (ev) => {
      setIsLoading(true);

      try {
        // Create Payment Intent
        const response = await fetch("/api/payments/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: planId,
            amount: amount,
            paymentMethod: "wallet",
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.clientSecret) {
          ev.complete("fail");
          throw new Error(data.error || "Failed to create payment intent");
        }

        // Confirm payment with Payment Intent
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete("fail");
          onError(confirmError.message || "Payment failed");
          setIsLoading(false);
          return;
        }

        // Complete payment request
        ev.complete("success");

        // Verify payment and create subscription
        if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_capture")) {
          const verifyResponse = await fetch("/api/payments/stripe/verify-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            onSuccess();
          } else {
            onError(verifyData.error || "Failed to process subscription");
          }
        } else {
          onError("Payment requires additional authentication");
        }
      } catch (error: any) {
        ev.complete("fail");
        onError(error.message || "Payment failed");
      } finally {
        setIsLoading(false);
      }
    });
  }, [stripe, amount, planName, planId, onSuccess, onError]);

  if (isAvailable === null) {
    return (
      <div className="p-4 text-center text-foreground-muted text-sm">
        Checking wallet availability...
      </div>
    );
  }

  if (isAvailable === false) {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <p className="text-warning text-sm text-center">
          Wallet payment (Apple Pay, Google Pay, Samsung Pay) is not available on this device or browser.
        </p>
        <p className="text-xs text-foreground-muted text-center mt-2">
          Please use a different payment method or try on a supported device.
        </p>
      </div>
    );
  }

  if (!paymentRequest) {
    return (
      <div className="p-4 text-center text-foreground-muted text-sm">
        Loading wallet payment options...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground-muted">Total</span>
          <span className="text-lg font-bold text-foreground">${amount}</span>
        </div>
        <p className="text-xs text-foreground-muted">Pay with Apple Pay, Google Pay, or Samsung Pay</p>
      </div>
      <div className="wallet-payment-button">
        <PaymentRequestButtonElement
          options={{
            paymentRequest,
            style: {
              paymentRequestButton: {
                theme: "dark",
                height: "48px",
              },
            },
          }}
        />
      </div>
      {isLoading && (
        <div className="text-center text-sm text-foreground-muted flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Processing payment...
        </div>
      )}
    </div>
  );
}

export default function WalletPaymentButton(props: WalletPaymentButtonProps) {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!stripePublishableKey) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
        <p className="text-error text-sm">Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Math.round(props.amount * 100),
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <WalletPaymentButtonInner {...props} />
    </Elements>
  );
}

