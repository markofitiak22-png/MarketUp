"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import PaymentModal from "@/components/payment/PaymentModal";

const plans = {
  pro: {
    name: 'Pro',
    price: 42,
    description: 'Ideal for business',
    features: [
      '4 videos per month',
      'HD quality',
      'Subtitles included',
      'Extended avatars',
      'Social publishing',
      '2 background images',
      'Team support',
      'Company info'
    ]
  }
};

function CheckoutPageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { translations } = useTranslations();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const rawPlanId = searchParams.get('plan') || 'pro';
  const successParam = searchParams.get('success');
  const canceledParam = searchParams.get('canceled');
  
  // Only pro plan is available
  const planId = rawPlanId === 'pro' ? 'pro' : 'pro';

  useEffect(() => {
    if (!session) {
      router.push('/auth?redirect=/checkout?plan=pro');
    }
  }, [session, router]);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const paymentMethod = searchParams.get('payment_method');
      // PayPal returns token in URL after approval
      const token = searchParams.get('token');
      
      // Handle PayPal payment
      if (paymentMethod === 'paypal' && token) {
        try {
          const response = await fetch('/api/payments/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              orderId: token, // token is the orderId
              planId: planId,
            }),
          });

          const data = await response.json();
          if (data.success) {
            setIsSuccess(true);
            setTimeout(() => {
              router.push('/dashboard?success=true');
            }, 2000);
          } else {
            setError(data.error || 'Payment processing failed');
          }
        } catch (error: any) {
          console.error('PayPal capture error:', error);
          setError('Failed to process payment. Please contact support.');
        }
      } else if (successParam === 'true' && paymentMethod !== 'paypal') {
        // Stripe payment - verify session and create subscription
        const sessionId = searchParams.get('session_id');
        
        if (sessionId) {
          try {
            console.log('Verifying Stripe session:', sessionId);
            const response = await fetch('/api/payments/stripe/verify-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ sessionId }),
            });

            const data = await response.json();
            if (data.success) {
              console.log('✅ Subscription created:', data.subscription);
              setIsSuccess(true);
              setTimeout(() => {
                router.push('/dashboard?success=true');
              }, 2000);
            } else {
              console.error('Failed to create subscription:', data.error);
              // Still show success, webhook might create it later
              setIsSuccess(true);
              setTimeout(() => {
                router.push('/dashboard?success=true');
              }, 2000);
            }
          } catch (error: any) {
            console.error('Session verification error:', error);
            // Still show success, webhook might create it later
            setIsSuccess(true);
            setTimeout(() => {
              router.push('/dashboard?success=true');
            }, 2000);
          }
        } else {
          // No session_id, just wait for webhook
          setIsSuccess(true);
          setTimeout(() => {
            router.push('/dashboard?success=true');
          }, 2000);
        }
      }
    };

    if (successParam === 'true') {
      handlePaymentSuccess();
    }
    
    if (canceledParam === 'true') {
      setError('Payment was canceled. Please try again.');
    }
  }, [successParam, canceledParam, router, searchParams, planId]);

  const plan = plans[planId as keyof typeof plans];
  
  // Handle case when plan is not found
  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
          <p className="text-white/70 mb-6">
            Only Pro plan is available. Redirecting to pricing...
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80 transition-colors"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    setError(null);
    setTimeout(() => {
      router.push('/dashboard?success=true');
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-foreground-muted mb-6">Please sign in to continue</p>
          <Link href="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-lg text-foreground-muted mb-6">
            Welcome to {plan.name}! Redirecting to your dashboard...
          </p>
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pricing
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-foreground-muted">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="glass-elevated rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
              
              {/* Plan Info */}
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name} Plan</h3>
                  <p className="text-sm text-foreground-muted mb-3">{plan.description}</p>
                  <div className="text-2xl font-bold text-foreground">
                    ${plan.price}
                    <span className="text-base text-foreground-muted font-normal">/month</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">What&apos;s included:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">
                      ${plan.price}
                      <span className="text-sm text-foreground-muted font-normal">/month</span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">Billed monthly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Payment</h3>
              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary w-full py-3 text-base font-semibold"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Payment
                </span>
              </button>
              <p className="text-xs text-foreground-muted mt-3 text-center">
                Complete payment and upload receipt for verification
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payment
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">SSL Encrypted</p>
                    <p className="text-xs text-foreground-muted">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">PCI Compliant</p>
                    <p className="text-xs text-foreground-muted">We never store payment info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-success mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cancel Anytime</p>
                    <p className="text-xs text-foreground-muted">No long-term commitments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Need Help?
              </h3>
              <p className="text-sm text-foreground-muted mb-4">
                Our support team is here to help with any questions.
              </p>
              <Link href="/contact" className="btn-outline w-full text-center text-sm">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setError(null);
        }}
        planName={plan.name}
        planPrice={plan.price}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}