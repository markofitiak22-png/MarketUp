"use client";
import { useState } from "react";

export default function SubscriptionPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentPlan = {
    name: "Pro Plan",
    price: 29,
    period: "month",
    features: [
      "Unlimited video creation",
      "HD video export",
      "Custom branding",
      "Priority support",
      "Advanced analytics"
    ],
    nextBilling: "2024-02-15",
    status: "active"
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      period: "month",
      features: [
        "3 videos per month",
        "Standard quality",
        "Basic templates",
        "Community support"
      ],
      current: false,
      popular: false
    },
    {
      name: "Pro",
      price: 29,
      period: "month",
      features: [
        "Unlimited videos",
        "HD quality",
        "Custom branding",
        "Priority support",
        "Advanced analytics"
      ],
      current: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: 99,
      period: "month",
      features: [
        "Everything in Pro",
        "White-label solution",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      current: false,
      popular: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Current Plan</h1>
            <p className="text-foreground-muted">Manage your subscription and billing</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                  <span className="text-xl">💎</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{currentPlan.name}</h3>
                  <p className="text-foreground-muted">${currentPlan.price}/{currentPlan.period}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">Next Billing</h4>
              <p className="text-2xl font-bold text-foreground">${currentPlan.price}</p>
              <p className="text-sm text-foreground-muted">{currentPlan.nextBilling}</p>
            </div>
            
            <div className="glass rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">Usage This Month</h4>
              <p className="text-2xl font-bold text-foreground">8/∞</p>
              <p className="text-sm text-foreground-muted">Videos created</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="btn-outline px-6 py-3">
            Change Plan
          </button>
          <button className="btn-outline px-6 py-3">
            Update Payment
          </button>
          <button className="text-error hover:text-error/80 px-6 py-3 border border-error/20 rounded-lg hover:bg-error/10 transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Available Plans</h2>
          <p className="text-foreground-muted">Choose the plan that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass rounded-2xl p-6 relative ${
                plan.popular ? 'ring-2 ring-accent' : ''
              } ${plan.current ? 'opacity-75' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-foreground-muted">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.current
                    ? 'bg-surface text-foreground-muted cursor-not-allowed'
                    : plan.popular
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-surface-elevated text-foreground hover:bg-surface'
                }`}
                disabled={plan.current}
                onClick={() => plan.current ? null : setIsUpgrading(true)}
              >
                {plan.current ? 'Current Plan' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Billing History</h2>
        
        <div className="space-y-4">
          {[
            {
              date: "2024-01-15",
              description: "Pro Plan - Monthly",
              amount: "$29.00",
              status: "Paid"
            },
            {
              date: "2023-12-15",
              description: "Pro Plan - Monthly",
              amount: "$29.00",
              status: "Paid"
            },
            {
              date: "2023-11-15",
              description: "Pro Plan - Monthly",
              amount: "$29.00",
              status: "Paid"
            }
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 glass rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                  <span className="text-lg">🧾</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{invoice.description}</p>
                  <p className="text-sm text-foreground-muted">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground">{invoice.amount}</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                  {invoice.status}
                </span>
                <button className="text-accent hover:text-accent-hover text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
