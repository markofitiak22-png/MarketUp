"use client";
import { useMemo } from "react";
import { PaymentMethod, getAvailablePaymentMethods } from "@/lib/payment-methods";

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
    <div className="space-y-3 sm:space-y-4">
      <h4 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">Select Payment Method</h4>
      <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => {
              if (method.available) {
                onSelectMethod(method.id);
              }
            }}
            disabled={!method.available}
            className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-left ${
              !method.available && method.needsConfiguration
                ? "border-blue-400/60 bg-blue-500/10 opacity-80 cursor-not-allowed"
                : !method.available
                ? "border-slate-700/50 bg-slate-800/30 opacity-50 cursor-not-allowed"
                : selectedMethod === method.id
                ? "border-indigo-500/60 bg-slate-800/60 shadow-lg shadow-indigo-500/20"
                : "border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-2xl sm:text-3xl flex-shrink-0">{method.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm sm:text-base font-bold text-white">{method.name}</span>
                  {method.countrySpecific && method.countrySpecific.length > 0 && (
                    <span className="text-xs text-white/60">
                      ({method.countrySpecific.join(", ")})
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/60">{method.description}</p>
                {!method.available && method.needsConfiguration && (
                  <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Ready - Configuration required (Adyen keys not set)
                  </p>
                )}
                {!method.available && !method.needsConfiguration && (
                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Temporarily unavailable
                  </p>
                )}
                {method.available && method.requiresReceipt && (
                  <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Receipt upload required
                  </p>
                )}
              </div>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedMethod === method.id
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-500"
                  : "border-slate-700/60"
              }`}>
                {selectedMethod === method.id && (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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

