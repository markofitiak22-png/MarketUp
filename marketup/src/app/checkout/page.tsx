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
  },
  premium: {
    name: 'Premium',
    price: 59,
    description: 'Suitable for everyone',
    features: [
      '7 videos per month',
      '4K quality',
      'Subtitles included',
      'Full avatars',
      'Social publishing',
      '4 background images',
      'Team support',
      'Company info',
      'Template access',
      'Marketing support',
      'Video analytics',
      'Cloud library',
      'Verified partner'
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
  
  // Support both pro and premium plans
  const planId = (rawPlanId === 'pro' || rawPlanId === 'premium') ? rawPlanId : 'pro';

  useEffect(() => {
    if (!session) {
      router.push(`/auth?redirect=/checkout?plan=${planId}`);
    }
  }, [session, router, planId]);

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
      } else if (successParam === 'true' && paymentMethod === 'swish') {
        // Adyen Swish payment - webhook will handle subscription creation
        console.log('Swish payment completed, waiting for webhook confirmation');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard?success=true');
        }, 2000);
      } else if (successParam === 'true' && paymentMethod !== 'paypal' && paymentMethod !== 'swish') {
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
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Plan Not Found</h1>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6">
              This plan is not available. Redirecting to pricing...
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 font-semibold text-sm sm:text-base"
            >
              Back to Pricing
            </button>
          </div>
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
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Access Denied</h1>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6">Please sign in to continue</p>
            <Link 
              href="/auth" 
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-base sm:text-lg text-white/60 mb-6">
              Welcome to {plan.name}! Redirecting to your dashboard...
            </p>
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
      {/* Shared background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top left blob */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Top right blob */}
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Middle left blob */}
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Middle right blob */}
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Bottom left blob */}
        <div className="absolute top-[80%] left-[15%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Bottom right blob */}
        <div className="absolute top-[90%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Additional connecting blobs */}
        <div className="absolute top-[35%] left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[45%] right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[70%] left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[75%] right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header Section with Badge */}
        <div className="mb-4 sm:mb-8">
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>Checkout</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <Link href="/pricing" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-3 sm:mb-4 text-xs sm:text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Pricing
              </Link>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">Checkout</h1>
              <p className="text-sm sm:text-base text-white/60">Review your order and complete payment</p>
            </div>
          </div>
        </div>

        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Plan Info - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{plan.name} Plan</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      ${plan.price}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">/month</span>
                <span className="text-xs sm:text-sm text-white/60">{plan.description}</span>
              </div>
            </div>
          </div>

          {/* Total - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Total</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${plan.price}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-[10px] sm:text-xs text-white/50 mb-1.5 sm:mb-2">Billed monthly</p>
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">Order Summary</h2>
              
              {/* Features */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider mb-3 sm:mb-4">What&apos;s included:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-indigo-500/40 transition-all duration-300">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">Payment</h3>
              {error && (
                <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                </div>
              )}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Payment
              </button>
              <p className="text-[10px] sm:text-xs text-white/60 mt-3 text-center">
                Complete payment and upload receipt for verification
              </p>
            </div>
          </div>

          {/* Right Column - Security & Support */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Security Info */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Secure Payment
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">SSL Encrypted</p>
                      <p className="text-[10px] sm:text-xs text-white/60">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">PCI Compliant</p>
                      <p className="text-[10px] sm:text-xs text-white/60">We never store payment info</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-white">Cancel Anytime</p>
                      <p className="text-[10px] sm:text-xs text-white/60">No long-term commitments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  Need Help?
                </h3>
                <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                  Our support team is here to help with any questions.
                </p>
                <Link 
                  href="/contact" 
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white border border-slate-700/60 hover:border-indigo-500/40 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm font-semibold transition-all duration-300 inline-block"
                >
                  Contact Support
                </Link>
              </div>
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