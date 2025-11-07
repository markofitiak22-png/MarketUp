"use client";
import { useMemo } from "react";
import { PaymentMethod, PaymentMethodInfo, getAvailablePaymentMethods } from "@/lib/payment-methods";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  userCountry?: string | null;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  userCountry,
}: PaymentMethodSelectorProps) {
  // Мемоізуємо список методів, щоб він не змінювався при зміні країни
  const availableMethods = useMemo(() => {
    return getAvailablePaymentMethods(userCountry);
  }, [userCountry]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground mb-3">Select Payment Method</h4>
      <div className="grid grid-cols-1 gap-2.5">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`p-3.5 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedMethod === method.id
                ? "border-accent bg-accent/10 shadow-md"
                : "border-border bg-surface hover:border-accent/50 hover:bg-surface-elevated"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl flex-shrink-0">{method.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground">{method.name}</span>
                  {method.countrySpecific && method.countrySpecific.length > 0 && (
                    <span className="text-xs text-foreground-muted">
                      ({method.countrySpecific.join(", ")})
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground-muted">{method.description}</p>
                {method.requiresReceipt && (
                  <p className="text-xs text-warning mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Receipt upload required
                  </p>
                )}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedMethod === method.id
                  ? "border-accent bg-accent"
                  : "border-border"
              }`}>
                {selectedMethod === method.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

