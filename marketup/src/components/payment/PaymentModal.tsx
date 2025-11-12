"use client";
import { useState, useEffect } from "react";
import { PaymentMethod, getPaymentMethodInfo } from "@/lib/payment-methods";
import PaymentMethodSelector from "./PaymentMethodSelector";
import WalletPaymentButton from "./WalletPaymentButton";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [ibanNumber, setIbanNumber] = useState("");
  const [step, setStep] = useState<"select" | "details" | "upload">("select");

  // Fetch user country
  useEffect(() => {
    if (isOpen) {
      fetch("/api/profile", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.country) {
            setUserCountry(data.country);
          }
        })
        .catch(() => {
          // Ignore errors
        });
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(null);
      setReceiptFile(null);
      setReceiptPreview(null);
      setIbanNumber("");
      setStep("select");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    const methodInfo = getPaymentMethodInfo(method);
    
    // Apple Pay and Samsung Pay show button directly (WalletPaymentButton)
    // Google Pay uses Stripe Checkout (redirects to checkout page)
    if (method === 'apple_pay' || method === 'samsung_pay') {
      setStep("details");
      return;
    }
    
    // Google Pay - redirect immediately to Stripe Checkout
    if (method === 'google_pay') {
      // Immediately redirect to Stripe Checkout for Google Pay
      setIsSubmitting(true);
      fetch("/api/payments/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: planName.toLowerCase(),
          amount: planPrice,
          paymentMethod: 'google_pay',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            setIsSubmitting(false);
            onError(data.error || "Failed to create checkout session");
          }
        })
        .catch((error) => {
          setIsSubmitting(false);
          onError(error.message || "Failed to process payment");
        });
      return;
    }
    
    if (methodInfo?.requiresReceipt) {
      if (method === 'iban_transfer') {
        setStep("details");
      } else {
        setStep("upload");
      }
    } else {
      setStep("details");
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedMethod) {
      onError("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    try {
      const methodInfo = getPaymentMethodInfo(selectedMethod);

      // Handle different payment methods
      // Apple Pay and Samsung Pay use WalletPaymentButton component
      // Google Pay uses Stripe Checkout (more reliable for Google Pay)
      if (selectedMethod === 'apple_pay' || selectedMethod === 'samsung_pay') {
        // Wallet payments are handled by WalletPaymentButton component
        // This should not be reached, but handle it gracefully
        onError("Please use the wallet payment button below");
        setIsSubmitting(false);
        return;
      }

      if (selectedMethod === 'google_pay') {
        // Google Pay - use Stripe Checkout which has better Google Pay support
        const response = await fetch("/api/payments/stripe/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: planName.toLowerCase(),
            amount: planPrice,
            paymentMethod: selectedMethod,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error || "Failed to create checkout session");
        }
        window.location.href = data.url;
        return;
      }

      if (selectedMethod === 'stripe_card' || selectedMethod === 'klarna') {
        // Stripe card payment or Klarna
        const response = await fetch("/api/payments/stripe/checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: planName.toLowerCase(),
            amount: planPrice,
            paymentMethod: selectedMethod,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error || "Failed to create checkout session");
        }
        window.location.href = data.url;
        return;
      }

      if (selectedMethod === 'paypal') {
        // PayPal payment
        const response = await fetch("/api/payments/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            planId: planName.toLowerCase(),
            amount: planPrice,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.approvalUrl) {
          const errorMsg = data.error || "Failed to create PayPal order";
          const details = data.details ? `\n\n${data.details}` : '';
          throw new Error(errorMsg + details);
        }
        
        // Redirect to PayPal approval URL
        window.location.href = data.approvalUrl;
        return;
      }

      if (selectedMethod === 'syriatel_cash' || selectedMethod === 'zain_cash' || selectedMethod === 'iban_transfer') {
        // Manual payment with receipt
        if (!receiptFile) {
          onError("Please upload payment receipt");
          setIsSubmitting(false);
          return;
        }

        // Upload receipt
        const formData = new FormData();
        formData.append('receipt', receiptFile);
        formData.append('planId', planName.toLowerCase());
        formData.append('amount', planPrice.toString());
        formData.append('paymentMethod', selectedMethod);
        if (ibanNumber) {
          formData.append('ibanNumber', ibanNumber);
        }

        const response = await fetch("/api/payments/manual", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit payment");
        }

        onSuccess();
        return;
      }

      // For Swish - use Adyen
      if (selectedMethod === 'swish') {
        const response = await fetch("/api/payments/adyen/swish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: planName.toLowerCase(),
            amount: planPrice,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.url) {
          throw new Error(data.error || "Failed to create payment session");
        }
        window.location.href = data.url;
        return;
      }

      // Unknown payment method
      onError(`Payment method ${methodInfo?.name || 'selected'} is not supported`);
      setIsSubmitting(false);

    } catch (error: any) {
      setIsSubmitting(false);
      onError(error.message || "Failed to process payment");
    }
  };

  const handleBack = () => {
    if (step === "upload" || step === "details") {
      setStep("select");
      setReceiptFile(null);
      setReceiptPreview(null);
      setIbanNumber("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-auto bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-700/60 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Complete Payment</h2>
              <p className="text-xs sm:text-sm text-white/60">
                {planName} • ${planPrice}/mo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-white/60 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="p-4 sm:p-5 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm text-white/60">Plan</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{planName} Plan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-white/60">Amount</span>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">${planPrice}<span className="text-xs sm:text-sm text-white/60 font-normal">/month</span></span>
              </div>
            </div>

            {/* Step 1: Select Payment Method */}
            {step === "select" && (
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelectMethod={handleMethodSelect}
                userCountry={userCountry}
              />
            )}

            {/* Step 2: Wallet Payment Button (Apple Pay and Samsung Pay) */}
            {step === "details" && selectedMethod && (selectedMethod === 'apple_pay' || selectedMethod === 'samsung_pay') && (
              <WalletPaymentButton
                amount={planPrice}
                planName={planName}
                planId={planName.toLowerCase()}
                onSuccess={onSuccess}
                onError={onError}
                onCancel={onClose}
              />
            )}

            {/* Step 2: IBAN Details */}
            {step === "details" && selectedMethod === 'iban_transfer' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2">Bank Transfer Details</h4>
                  <p className="text-xs sm:text-sm text-white/60 mb-4">
                    Transfer ${planPrice} to the following IBAN. After transfer, upload your receipt.
                  </p>
                  <div className="p-4 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60">
                    <div className="text-xs text-white/60 mb-1">IBAN Number</div>
                    <div className="text-sm sm:text-base font-mono font-bold text-white">TR33 0006 1005 1978 6457 8413 26</div>
                    <div className="text-xs text-white/60 mt-2">Account Name: MarketUp</div>
                    <div className="text-xs text-white/60">Amount: ${planPrice} USD</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-white mb-2">
                    Your IBAN Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    placeholder="TR33 0006 1005 1978 6457 8413 26"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button
                  onClick={() => setStep("upload")}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20"
                >
                  Continue to Receipt Upload
                </button>
              </div>
            )}

            {/* Step 3: Upload Receipt */}
            {(step === "upload" || (step === "details" && selectedMethod !== 'iban_transfer')) && selectedMethod && getPaymentMethodInfo(selectedMethod)?.requiresReceipt && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2">Upload Payment Receipt</h4>
                  <p className="text-xs sm:text-sm text-white/60 mb-4">
                    Please upload a clear image or PDF of your payment receipt.
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-white mb-2">
                    Receipt File (Image or PDF)
                  </label>
                  <div className="border-2 border-dashed border-slate-700/60 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-indigo-500/60 transition-colors bg-slate-800/20">
                    <input
                      type="file"
                      id="receipt-upload"
                      accept="image/*,.pdf"
                      onChange={handleReceiptChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="receipt-upload"
                      className="cursor-pointer block"
                    >
                      {receiptPreview ? (
                        <div className="space-y-2">
                          <img
                            src={receiptPreview}
                            alt="Receipt preview"
                            className="max-h-48 mx-auto rounded-lg border border-slate-700/60"
                          />
                          <p className="text-xs text-white/60">{receiptFile?.name}</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptFile(null);
                              setReceiptPreview(null);
                            }}
                            className="text-xs text-red-400 hover:text-red-300 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <svg className="w-12 h-12 mx-auto text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-white/60">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-white/40">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Info */}
            {step === "select" && (
              <div className="p-4 sm:p-5 bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-700/60">
                <h4 className="text-xs sm:text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Secure Payment
                </h4>
                <ul className="text-xs sm:text-sm text-white/60 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>All payment methods are secure and encrypted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Your subscription will be activated after payment confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Cancel anytime from your dashboard</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700/60 bg-slate-800/40">
          <div className="flex gap-2 sm:gap-3">
            {(step === "upload" || step === "details") && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/60 text-white hover:bg-slate-800/60 transition-colors font-semibold text-xs sm:text-sm"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/60 text-white hover:bg-slate-800/60 transition-colors font-semibold text-xs sm:text-sm"
            >
              Cancel
            </button>
            {selectedMethod && (step === "upload" || (step === "details" && !getPaymentMethodInfo(selectedMethod)?.requiresReceipt && selectedMethod !== 'apple_pay' && selectedMethod !== 'google_pay' && selectedMethod !== 'samsung_pay')) && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (getPaymentMethodInfo(selectedMethod)?.requiresReceipt && !receiptFile)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {getPaymentMethodInfo(selectedMethod)?.requiresReceipt ? "Submit Payment" : "Proceed to Payment"}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
