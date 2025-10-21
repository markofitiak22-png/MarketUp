"use client";
import { useEffect, useState } from "react";
import { loadScript } from "@paypal/paypal-js";

interface PayPalButtonProps {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PayPalButton({ 
  planId, 
  billingPeriod, 
  amount, 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        await loadScript({
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: "USD",
          intent: "subscription",
        });
        setIsLoaded(true);
      } catch (error) {
        // PayPal script loading error handled silently
        onError("Failed to load PayPal. Please try again.");
      }
    };

    loadPayPalScript();
  }, [onError]);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          amount,
        }),
      });

      const { orderId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      return orderId;
    } catch (error) {
      // PayPal order creation error handled silently
      onError("Failed to create PayPal order. Please try again.");
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/payment/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
          planId,
          billingPeriod,
        }),
      });

      const { success, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (success) {
        onSuccess();
      } else {
        throw new Error("Payment capture failed");
      }
    } catch (error) {
      // PayPal payment capture error handled silently
      onError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (error: any) => {
    // PayPal error handled silently
    onError("PayPal payment failed. Please try again.");
  };

  if (!isLoaded) {
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-foreground-muted">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        id="paypal-button-container"
        className="w-full"
        style={{ minHeight: '50px' }}
      />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (window.paypal) {
              window.paypal.Buttons({
                createOrder: ${createOrder.toString()},
                onApprove: ${onApprove.toString()},
                onError: ${onError.toString()},
                style: {
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'paypal',
                  height: 50
                }
              }).render('#paypal-button-container');
            }
          `,
        }}
      />
      
      {isProcessing && (
        <div className="mt-4 p-4 bg-surface-elevated rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-foreground-muted">Processing PayPal payment...</span>
          </div>
        </div>
      )}
    </div>
  );
}
