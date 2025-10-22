"use client";
import { useState, useEffect } from "react";

interface SubscriptionData {
  currentPlan: {
    name: string;
    tier: string;
    price: number;
    period: string;
    features: string[];
    nextBilling: string | null;
    status: string;
    cancelAtPeriodEnd: boolean;
  };
  availablePlans: Array<{
    name: string;
    tier: string;
    price: number;
    period: string;
    features: string[];
    current: boolean;
    popular: boolean;
  }>;
  usage: {
    videosThisMonth: number;
    totalVideos: number;
    limit: string | number;
  };
  billingHistory: Array<{
    id: string;
    date: string;
    description: string;
    amount: string;
    status: string;
  }>;
}

export default function SubscriptionPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Fetch subscription data
  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/subscription');
      const data = await response.json();
      
      if (data.success) {
        setSubscriptionData(data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-elevated rounded-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-48 bg-surface rounded"></div>
              <div className="space-y-4">
                <div className="h-24 bg-surface rounded"></div>
                <div className="h-24 bg-surface rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="space-y-6">
        <div className="glass-elevated rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Error loading subscription data</h2>
          <p className="text-foreground-muted">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscriptionData.currentPlan.status === 'active' 
                ? 'bg-success/20 text-success' 
                : subscriptionData.currentPlan.cancelAtPeriodEnd
                ? 'bg-warning/20 text-warning'
                : 'bg-error/20 text-error'
            }`}>
              {subscriptionData.currentPlan.cancelAtPeriodEnd ? 'Cancelling' : subscriptionData.currentPlan.status}
            </span>
            {subscriptionData.currentPlan.cancelAtPeriodEnd && (
              <span className="text-xs text-foreground-muted">
                Ends {subscriptionData.currentPlan.nextBilling}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                  <span className="text-xl">
                    {subscriptionData.currentPlan.tier === 'FREE' ? '🆓' :
                     subscriptionData.currentPlan.tier === 'BASIC' ? '⭐' :
                     subscriptionData.currentPlan.tier === 'STANDARD' ? '💎' : '🏢'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{subscriptionData.currentPlan.name}</h3>
                  <p className="text-foreground-muted">
                    {subscriptionData.currentPlan.price === 0 ? 'Free' : `$${subscriptionData.currentPlan.price}/${subscriptionData.currentPlan.period}`}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {subscriptionData.currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {subscriptionData.currentPlan.nextBilling && (
              <div className="glass rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-2">Next Billing</h4>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptionData.currentPlan.price === 0 ? 'Free' : `$${subscriptionData.currentPlan.price}`}
                </p>
                <p className="text-sm text-foreground-muted">{subscriptionData.currentPlan.nextBilling}</p>
              </div>
            )}
            
            <div className="glass rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">Usage This Month</h4>
              <p className="text-2xl font-bold text-foreground">
                {subscriptionData.usage.videosThisMonth}/{subscriptionData.usage.limit === 'unlimited' ? '∞' : subscriptionData.usage.limit}
              </p>
              <p className="text-sm text-foreground-muted">Videos created</p>
              {subscriptionData.usage.limit !== 'unlimited' && (
                <div className="mt-2">
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (subscriptionData.usage.videosThisMonth / Number(subscriptionData.usage.limit)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          {subscriptionData.currentPlan.tier !== 'FREE' && (
            <>
              <button className="btn-outline px-6 py-3">
                Change Plan
              </button>
              <button className="btn-outline px-6 py-3">
                Update Payment
              </button>
              <button className="text-error hover:text-error/80 px-6 py-3 border border-error/20 rounded-lg hover:bg-error/10 transition-colors">
                {subscriptionData.currentPlan.cancelAtPeriodEnd ? 'Reactivate' : 'Cancel Subscription'}
              </button>
            </>
          )}
          {subscriptionData.currentPlan.tier === 'FREE' && (
            <button className="btn-primary px-6 py-3">
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Available Plans</h2>
          <p className="text-foreground-muted">Choose the plan that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionData.availablePlans.map((plan, index) => (
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
          {subscriptionData.billingHistory.length > 0 ? (
            subscriptionData.billingHistory.map((invoice, index) => (
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
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🧾</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No billing history</h3>
              <p className="text-foreground-muted">Your billing history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
