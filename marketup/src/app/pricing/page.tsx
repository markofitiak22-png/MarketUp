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

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round((monthlyPrice * 12 * 0.8) / 12 * 100) / 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto mb-12">
              Choose the perfect plan for your AI video creation needs. No hidden fees, cancel anytime.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-surface rounded-full p-1 border border-border">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative ${
                  billingPeriod === 'yearly' 
                    ? 'bg-accent text-white shadow-lg' 
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                Yearly
                {billingPeriod === 'yearly' && (
                  <span className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
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
              className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-accent/10 to-accent-2/10 border-2 border-accent shadow-2xl shadow-accent/20' 
                  : 'bg-surface border border-border hover:border-accent/50'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-semibold ${
                  plan.badge === 'Most Popular' 
                    ? 'bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-accent-2 to-purple-600 text-white shadow-lg'
                }`}>
                  {plan.badge}
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-3">{plan.name}</h3>
                <p className="text-foreground-muted mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-6xl font-bold text-foreground">
                      ${billingPeriod === 'yearly' && plan.price > 0 
                        ? getYearlyPrice(plan.price)
                        : plan.price
                      }
                    </span>
                    <span className="text-xl text-foreground-muted ml-2">
                      /{plan.period === 'forever' ? 'forever' : billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success">
                        Save ${getYearlyDiscount(plan.price)}/year
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-accent to-accent-2 text-white hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-1'
                    : plan.id === 'free'
                    ? 'bg-surface-elevated text-foreground border border-border hover:bg-surface hover:border-accent/50'
                    : 'bg-gradient-to-r from-accent-2 to-purple-600 text-white hover:shadow-lg hover:shadow-accent-2/25 hover:-translate-y-1'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-gradient-to-br from-surface/50 to-surface-elevated/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Compare all features
            </h2>
            <p className="text-xl text-foreground-muted">
              Everything you need to choose the right plan
            </p>
          </div>

          <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-6 px-8 font-bold text-foreground text-lg">Features</th>
                    <th className="text-center py-6 px-8 font-bold text-foreground text-lg">Free</th>
                    <th className="text-center py-6 px-8 font-bold text-foreground text-lg bg-accent/5">Pro</th>
                    <th className="text-center py-6 px-8 font-bold text-foreground text-lg">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      <tr>
                        <td colSpan={4} className="py-4 px-8 font-bold text-foreground bg-surface-elevated text-lg">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-border/30 hover:bg-surface-elevated/30 transition-colors">
                          <td className="py-5 px-8 text-foreground font-medium">{item.name}</td>
                          <td className="py-5 px-8 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.free === '✅' ? 'bg-success/20 text-success' : 
                              item.free === '❌' ? 'bg-error/20 text-error' : 
                              'bg-surface-elevated text-foreground'
                            }`}>
                              {item.free}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-center bg-accent/5">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.pro === '✅' ? 'bg-success/20 text-success' : 
                              item.pro === '❌' ? 'bg-error/20 text-error' : 
                              'bg-surface-elevated text-foreground'
                            }`}>
                              {item.pro}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.enterprise === '✅' ? 'bg-success/20 text-success' : 
                              item.enterprise === '❌' ? 'bg-error/20 text-error' : 
                              'bg-surface-elevated text-foreground'
                            }`}>
                              {item.enterprise}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-foreground-muted">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="grid gap-6">
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
            <div key={index} className="bg-surface border border-border rounded-2xl p-8 hover:border-accent/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-foreground mb-4">{faq.question}</h3>
              <p className="text-foreground-muted text-lg leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-accent/5 to-accent-2/5 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to create amazing AI videos?
          </h2>
          <p className="text-xl text-foreground-muted mb-12 max-w-3xl mx-auto">
            Join thousands of creators and businesses who are already using our platform to create professional AI avatar videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => handlePlanSelect('pro')}
              className="bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-1 transition-all duration-200"
            >
              Start Free Trial
            </button>
            <Link
              href="/contact"
              className="bg-surface border border-border text-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:border-accent/50 hover:bg-surface-elevated transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}