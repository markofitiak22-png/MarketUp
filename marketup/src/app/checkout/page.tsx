"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import PayPalButton from "@/components/payment/PayPalButton";
import Link from "next/link";

// Stripe configuration
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

interface CheckoutFormProps {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ planId, billingPeriod, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    country: 'US',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const plan = plans[planId as keyof typeof plans];
  const isYearly = billingPeriod === 'yearly';
  const finalPrice = isYearly && plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : plan.price;
  const savings = isYearly && plan.price > 0 ? Math.round(plan.price * 12 * 0.2) : 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          amount: finalPrice * 100, // Convert to cents
          billingInfo
        }),
      });

      const { clientSecret, error: serverError } = await response.json();

      if (serverError) {
        onError(serverError);
        return;
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: `${billingInfo.firstName} ${billingInfo.lastName}`,
            email: billingInfo.email,
            address: {
              line1: billingInfo.address,
              city: billingInfo.city,
              state: billingInfo.state,
              postal_code: billingInfo.zipCode,
              country: billingInfo.country,
            },
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Information */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name *
            </label>
            <input
              type="text"
              required
              value={billingInfo.firstName}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={billingInfo.lastName}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={billingInfo.email}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company
            </label>
            <input
              type="text"
              value={billingInfo.company}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Acme Inc."
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Address Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={billingInfo.address}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={billingInfo.city}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="New York"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              State *
            </label>
            <input
              type="text"
              required
              value={billingInfo.state}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="NY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              required
              value={billingInfo.zipCode}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="10001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Country *
            </label>
            <select
              required
              value={billingInfo.country}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'stripe'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.407-2.354 1.407-1.852 0-4.382-.921-6.09-1.737l-.89 5.494C5.43 23.73 8.525 24 12.164 24c2.469 0 4.543-.624 6.03-1.832 1.57-1.247 2.38-3.093 2.38-5.32 0-4.07-2.467-5.76-6.476-7.219z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Credit Card</div>
                  <div className="text-sm text-foreground-muted">Visa, Mastercard, Amex</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'paypal'
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.608-.685-1.46-1.103-2.485-1.103H8.287c-.524 0-.968.382-1.05.9L5.135 19.263h4.61c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">PayPal</div>
                  <div className="text-sm text-foreground-muted">Pay with PayPal</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {paymentMethod === 'stripe' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Details *
              </label>
              <div className="p-4 border border-border rounded-xl bg-surface">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your payment information is secure and encrypted
            </div>
          </div>
        </div>
      )}

      {/* PayPal Payment */}
      {paymentMethod === 'paypal' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">PayPal Payment</h3>
          <PayPalButton
            planId={planId}
            billingPeriod={billingPeriod}
            amount={finalPrice * 100}
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>
      )}

      {/* Submit Button */}
      {paymentMethod === 'stripe' && (
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full btn-primary btn-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Complete Payment - $${finalPrice}/${isYearly ? 'year' : 'month'}`
          )}
        </button>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleError = (errorMessage: string) => {
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
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Complete Your Purchase</h1>
              <p className="text-foreground-muted">Secure checkout powered by Stripe</p>
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

            {/* Security Badges */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Secure Payment</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-foreground-muted">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-foreground-muted">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-foreground-muted">Stripe Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            {error && (
              <div className="mb-6 p-4 bg-error/20 border border-error/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-error font-medium">{error}</span>
                </div>
              </div>
            )}

            <Elements stripe={stripePromise}>
              <CheckoutForm
                planId={planId}
                billingPeriod={billingPeriod}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
