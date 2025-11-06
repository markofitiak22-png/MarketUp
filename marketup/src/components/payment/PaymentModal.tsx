"use client";
import { useState, useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

type Step = 'method' | 'details' | 'review';

export default function PaymentModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('method');
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('method');
      setPaymentMethod("bank");
      setReceiptUrl("");
      setNote("");
      setErrors({});
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

  if (!isOpen) return null;

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 'method') {
      if (!paymentMethod) {
        newErrors.paymentMethod = 'Please select a payment method';
      }
    } else if (step === 'details') {
      if (receiptUrl && !isValidUrl(receiptUrl)) {
        newErrors.receiptUrl = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'method') {
      if (validateStep('method')) {
        setCurrentStep('details');
      }
    } else if (currentStep === 'details') {
      if (validateStep('details')) {
        setCurrentStep('review');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('method');
    } else if (currentStep === 'review') {
      setCurrentStep('details');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("amount", planPrice.toString());
      formData.append("currency", "USD");
      formData.append("note", `Payment for ${planName} plan. Method: ${paymentMethod}. ${note}`);
      if (receiptUrl) {
        formData.append("receiptUrl", receiptUrl);
      }

      const response = await fetch("/api/payments/manual", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit payment request");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      onError(error.message || "Failed to submit payment request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 'method', label: 'Method', icon: '💳' },
    { id: 'details', label: 'Details', icon: '📝' },
    { id: 'review', label: 'Review', icon: '✓' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-auto glass-elevated rounded-xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-surface/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Complete Payment</h2>
              <p className="text-xs text-foreground-muted">
                {planName} • ${planPrice}/mo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4 text-foreground-muted"
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

        {/* Progress Steps */}
        <div className="px-5 py-3 border-b border-border bg-surface/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isActive
                          ? 'bg-accent text-white'
                          : 'bg-surface border border-border text-foreground-muted'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-[10px] mt-1 text-center leading-tight ${
                      isActive ? 'text-foreground font-medium' : 'text-foreground-muted'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-1.5 transition-all ${
                      isCompleted ? 'bg-success' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Step 1: Payment Method */}
          {currentStep === 'method' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Choose Payment Method</h3>
                <p className="text-sm text-foreground-muted">Select how you&apos;d like to pay</p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'bank', label: 'Bank Transfer', desc: 'Wire transfer or ACH' },
                  { value: 'crypto', label: 'Cryptocurrency', desc: 'BTC, ETH, USDT' },
                  { value: 'other', label: 'Other', desc: 'Alternative payment methods' },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.value);
                      setErrors({});
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === method.value
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-surface hover:border-accent/50 hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground mb-1">{method.label}</h4>
                        <p className="text-xs text-foreground-muted">{method.desc}</p>
                      </div>
                      {paymentMethod === method.value && (
                        <svg className="w-5 h-5 text-white flex-shrink-0 mt-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-sm text-error flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 'details' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Payment Details</h3>
                <p className="text-xs text-foreground-muted">Provide proof of payment and additional information</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Payment Receipt/Proof URL
                  <span className="text-foreground-muted font-normal"> (optional)</span>
                </label>
                <input
                  type="url"
                  value={receiptUrl}
                  onChange={(e) => {
                    setReceiptUrl(e.target.value);
                    if (errors.receiptUrl) setErrors({ ...errors, receiptUrl: '' });
                  }}
                  placeholder="https://example.com/receipt.jpg"
                  className={`w-full px-3 py-2 rounded-lg bg-surface border ${
                    errors.receiptUrl ? 'border-error' : 'border-border'
                  } text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-sm`}
                />
                {errors.receiptUrl && (
                  <p className="text-xs text-error mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.receiptUrl}
                  </p>
                )}
                <p className="text-xs text-foreground-muted mt-1.5">
                  Upload your payment receipt to a file sharing service and paste the link here
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Additional Notes
                  <span className="text-foreground-muted font-normal"> (optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Transaction ID, reference number, or any additional information..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Review Your Payment</h3>
                <p className="text-xs text-foreground-muted">Please review your payment details before submitting</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-surface rounded-lg border border-border">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground-muted">Payment Method</span>
                      <span className="text-xs font-medium text-foreground capitalize">{paymentMethod.replace('-', ' ')}</span>
                    </div>
                    {receiptUrl && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground-muted">Receipt URL</span>
                        <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline truncate max-w-[180px]">
                          View
                        </a>
                      </div>
                    )}
                    {note && (
                      <div>
                        <span className="text-xs text-foreground-muted block mb-1">Notes</span>
                        <p className="text-xs text-foreground bg-surface-elevated p-2 rounded">{note}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-accent/5 rounded-lg border border-accent/10">
                  <h4 className="text-xs font-semibold text-foreground mb-2">What happens next?</h4>
                  <ul className="text-[11px] text-foreground-muted space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Your payment request will be submitted for review</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Our team will verify your payment within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>You&apos;ll receive an email confirmation once approved</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="px-5 py-3.5 border-t border-border bg-surface/30">
          <div className="flex gap-2.5">
            {currentStep !== 'method' && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg bg-surface border border-border text-foreground hover:bg-surface-elevated transition-colors font-medium text-sm"
              >
                Back
              </button>
            )}
            {currentStep !== 'review' ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-4 py-2 rounded-lg btn-primary font-medium text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg btn-primary font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Payment Request'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
