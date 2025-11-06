"use client";
import { useEffect, useState, useRef } from "react";
import { loadScript, PayPalScriptOptions } from "@paypal/paypal-js";

interface PayPalButtonProps {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// PayPal will be available on window after SDK loads

export default function PayPalButton({ 
  planId, 
  billingPeriod, 
  amount, 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        
        if (!clientId) {
          throw new Error("PayPal Client ID is not configured");
        }

        const options: PayPalScriptOptions = {
          clientId: clientId,
          currency: "USD",
          intent: "capture",
        };

        await loadScript(options);
        setIsLoaded(true);
        setLoadError(null);
      } catch (error: any) {
        console.error("PayPal script loading error:", error);
        const errorMessage = error.message || "Failed to load PayPal. Please check your PayPal Client ID configuration.";
        setLoadError(errorMessage);
        onError(errorMessage);
      }
    };

    loadPayPalScript();
  }, [onError]);

  useEffect(() => {
    if (!isLoaded || !(window as any).paypal || !paypalButtonContainerRef.current) {
      return;
    }

    // Clear any existing buttons
    if (paypalButtonContainerRef.current) {
      paypalButtonContainerRef.current.innerHTML = '';
    }

    try {
      const paypal = (window as any).paypal;
      if (!paypal) {
        throw new Error("PayPal SDK not loaded");
      }

      paypal.Buttons({
        createOrder: async () => {
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

            const data = await response.json();

            if (!response.ok || data.error) {
              throw new Error(data.error || 'Failed to create PayPal order');
            }

            return data.orderId;
          } catch (error: any) {
            console.error("Create order error:", error);
            onError(error.message || "Failed to create PayPal order. Please try again.");
            throw error;
          }
        },
        onApprove: async (data: { orderID: string }) => {
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

            const result = await response.json();

            if (!response.ok || result.error) {
              throw new Error(result.error || "Payment capture failed");
            }

            if (result.success) {
              onSuccess();
            } else {
              throw new Error("Payment capture failed");
            }
          } catch (error: any) {
            console.error("Capture order error:", error);
            onError(error.message || "Payment failed. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error("PayPal button error:", err);
          onError("PayPal payment failed. Please try again.");
        },
        onCancel: () => {
          onError("Payment was canceled.");
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50
        }
      }).render(paypalButtonContainerRef.current);
    } catch (error: any) {
      console.error("PayPal button render error:", error);
      onError("Failed to initialize PayPal button. Please try again.");
    }
  }, [isLoaded, planId, billingPeriod, amount, onSuccess, onError]);

  if (loadError) {
    return (
      <div className="w-full py-4 px-4 bg-error/10 border border-error/20 rounded-xl">
        <p className="text-error text-sm text-center">{loadError}</p>
        <p className="text-foreground-muted text-xs text-center mt-2">
          Please configure NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment variables.
        </p>
      </div>
    );
  }

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
        ref={paypalButtonContainerRef}
        className="w-full"
        style={{ minHeight: '50px' }}
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
