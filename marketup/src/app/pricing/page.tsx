"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '3 videos per month',
      'Standard quality (720p)',
      'Basic avatars',
      '5 languages',
      'Community support',
      'Watermark on videos'
    ],
    limitations: [
      'Limited to 3 videos',
      'Standard quality only',
      'Basic support'
    ],
    popular: false,
    cta: 'Get Started Free',
    color: 'border-border'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: 'month',
    description: 'Best for professionals and creators',
    features: [
      '50 videos per month',
      'HD quality (1080p)',
      'All avatars & voices',
      '20+ languages',
      'Priority support',
      'No watermark',
      'Custom backgrounds',
      'Advanced editing tools',
      'API access'
    ],
    limitations: [],
    popular: true,
    cta: 'Start Pro Trial',
    color: 'border-accent',
    badge: 'Most Popular'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For teams and large organizations',
    features: [
      'Unlimited videos',
      '4K quality (2160p)',
      'Custom avatars',
      'All languages & voices',
      'Dedicated support',
      'No watermark',
      'Custom branding',
      'Team collaboration',
      'Advanced analytics',
      'White-label solution',
      'Custom integrations',
      'SLA guarantee'
    ],
    limitations: [],
    popular: false,
    cta: 'Contact Sales',
    color: 'border-accent-2',
    badge: 'Enterprise'
  }
];

const features = [
  {
    category: 'Video Creation',
    items: [
      { name: 'Videos per month', free: '3', pro: '50', enterprise: 'Unlimited' },
      { name: 'Video quality', free: '720p', pro: '1080p', enterprise: '4K' },
      { name: 'Video duration', free: '60s max', pro: '10 min max', enterprise: 'Unlimited' },
      { name: 'Export formats', free: 'MP4', pro: 'MP4, WebM', enterprise: 'All formats' }
    ]
  },
  {
    category: 'Avatars & Voices',
    items: [
      { name: 'Available avatars', free: '3', pro: '12+', enterprise: 'Unlimited + Custom' },
      { name: 'Voice options', free: '5 languages', pro: '20+ languages', enterprise: 'All languages' },
      { name: 'Voice quality', free: 'Standard', pro: 'Premium', enterprise: 'Ultra HD' },
      { name: 'Custom voices', free: '❌', pro: '❌', enterprise: '✅' }
    ]
  },
  {
    category: 'Features',
    items: [
      { name: 'Background options', free: '5', pro: '20+', enterprise: 'Unlimited + Custom' },
      { name: 'Watermark', free: 'Yes', pro: 'No', enterprise: 'No' },
      { name: 'API access', free: '❌', pro: '✅', enterprise: '✅' },
      { name: 'Team collaboration', free: '❌', pro: '❌', enterprise: '✅' }
    ]
  },
  {
    category: 'Support',
    items: [
      { name: 'Email support', free: '✅', pro: '✅', enterprise: '✅' },
      { name: 'Priority support', free: '❌', pro: '✅', enterprise: '✅' },
      { name: 'Dedicated support', free: '❌', pro: '❌', enterprise: '✅' },
      { name: 'SLA guarantee', free: '❌', pro: '❌', enterprise: '✅' }
    ]
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    if (planId === 'enterprise') {
      // Redirect to contact form for enterprise
      router.push('/contact?plan=enterprise');
    } else {
      setSelectedPlan(planId);
      router.push(`/checkout?plan=${planId}&billing=${billingPeriod}`);
    }
  };

  const getYearlyDiscount = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.2); // 20% discount
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto mb-8">
              Start creating professional AI videos today. Upgrade anytime as your needs grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-foreground' : 'text-foreground-muted'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingPeriod === 'yearly' ? 'bg-accent' : 'bg-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-foreground' : 'text-foreground-muted'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="text-sm bg-success/20 text-success px-2 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-elevated rounded-2xl p-8 relative ${
                plan.popular ? 'ring-2 ring-accent scale-105' : ''
              } ${plan.color} border-2`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-medium ${
                  plan.badge === 'Most Popular' 
                    ? 'bg-accent text-white' 
                    : 'bg-accent-2 text-white'
                }`}>
                  {plan.badge}
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-foreground-muted mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold text-foreground">
                    ${billingPeriod === 'yearly' && plan.price > 0 
                      ? Math.round(plan.price * 12 * 0.8) / 12 
                      : plan.price
                    }
                  </span>
                  <span className="text-foreground-muted">
                    /{plan.period === 'forever' ? 'forever' : billingPeriod === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <div className="text-sm text-success">
                    Save ${getYearlyDiscount(plan.price)}/year
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : plan.id === 'free'
                    ? 'bg-surface-elevated text-foreground hover:bg-surface'
                    : 'bg-accent-2 text-white hover:bg-accent-2/90'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Compare All Features
            </h2>
            <p className="text-lg text-foreground-muted">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr>
                      <td colSpan={4} className="py-3 px-6 font-semibold text-foreground bg-surface-elevated">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-border/50">
                        <td className="py-4 px-6 text-foreground">{item.name}</td>
                        <td className="py-4 px-6 text-center text-foreground-muted">{item.free}</td>
                        <td className="py-4 px-6 text-center text-foreground-muted">{item.pro}</td>
                        <td className="py-4 px-6 text-center text-foreground-muted">{item.enterprise}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          {[
            {
              question: "Can I change my plan anytime?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
            },
            {
              question: "What happens to my videos if I downgrade?",
              answer: "Your existing videos remain accessible. You'll just have reduced limits for new video creation based on your new plan."
            },
            {
              question: "Do you offer refunds?",
              answer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team if you're not satisfied."
            },
            {
              question: "Can I cancel my subscription?",
              answer: "Yes, you can cancel anytime from your account settings. Your subscription will remain active until the end of your billing period."
            },
            {
              question: "Do you offer custom enterprise solutions?",
              answer: "Absolutely! Contact our sales team to discuss custom pricing, features, and integrations for your organization."
            }
          ].map((faq, index) => (
            <div key={index} className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-foreground-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground-muted mb-8">
            Join thousands of creators who are already using our platform to create amazing videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePlanSelect('pro')}
              className="btn-primary btn-lg px-8 py-4"
            >
              Start Free Trial
            </button>
            <Link
              href="/contact"
              className="btn-outline btn-lg px-8 py-4"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}