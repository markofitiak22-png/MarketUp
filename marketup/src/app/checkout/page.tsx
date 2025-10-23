"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const plans = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: ['3 videos per month', 'Standard quality', 'Basic support']
  },
  pro: {
    name: 'Pro',
    price: 29,
    description: 'Best for professionals',
    features: ['50 videos per month', 'HD quality', 'Priority support', 'No watermark']
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    description: 'For teams and organizations',
    features: ['Unlimited videos', '4K quality', 'Dedicated support', 'Custom branding']
  }
};

function CheckoutPageContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const planId = searchParams.get('plan') || 'pro';
  const billingPeriod = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly';

  useEffect(() => {
    if (!session) {
      router.push('/auth?redirect=/checkout');
    }
  }, [session, router]);

  const plan = plans[planId as keyof typeof plans];
  const isYearly = billingPeriod === 'yearly';
  const finalPrice = isYearly && plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : plan.price;
  const savings = isYearly && plan.price > 0 ? Math.round(plan.price * 12 * 0.2) : 0;

  const handleSuccess = () => {
    setIsSuccess(true);
    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push('/dashboard?success=true');
    }, 3000);
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
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Complete Your Purchase</h1>
              <p className="text-foreground-muted">Payment processing temporarily unavailable</p>
            </div>
            <Link href="/pricing" className="btn-outline">
              Back to Pricing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass-elevated rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🎬</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{plan.name} Plan</h3>
                    <p className="text-sm text-foreground-muted">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      ${finalPrice}
                      <span className="text-sm text-foreground-muted">/{isYearly ? 'year' : 'month'}</span>
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-success">Save ${savings}/year</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-foreground-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-6">
                <div className="flex justify-between items-center text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>${finalPrice}/{isYearly ? 'year' : 'month'}</span>
                </div>
                {savings > 0 && (
                  <div className="text-sm text-success text-right">
                    You save ${savings} with yearly billing
                  </div>
                )}
              </div>
            </div>

            {/* Coming Soon Message */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Payment Processing</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Payment Processing Coming Soon</h4>
                <p className="text-foreground-muted mb-6">
                  We&apos;re setting up secure payment processing. Contact us for early access.
                </p>
                <button
                  onClick={handleSuccess}
                  className="btn-primary"
                >
                  Continue with Demo Access
                </button>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@marketup.com" className="text-foreground hover:text-accent transition-colors">
                    support@marketup.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <a href="/contact" className="text-foreground hover:text-accent transition-colors">
                    Contact Form
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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