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
      } else {
        // Fallback data if API fails
        setSubscriptionData({
          currentPlan: {
            name: "Free",
            tier: "FREE",
            price: 0,
            period: "month",
            features: [
              "3 videos per month",
              "Standard quality",
              "Basic templates",
              "Community support"
            ],
            nextBilling: null,
            status: "active",
            cancelAtPeriodEnd: false
          },
          availablePlans: [
            {
              name: "Free",
              tier: "FREE",
              price: 0,
              period: "month",
              features: [
                "3 videos per month",
                "Standard quality",
                "Basic templates",
                "Community support"
              ],
              current: true,
              popular: false
            },
            {
              name: "Basic",
              tier: "BASIC",
              price: 9,
              period: "month",
              features: [
                "10 videos per month",
                "HD quality",
                "Custom branding",
                "Email support",
                "Basic analytics"
              ],
              current: false,
              popular: false
            },
            {
              name: "Pro",
              tier: "STANDARD",
              price: 29,
              period: "month",
              features: [
                "Unlimited videos",
                "HD quality",
                "Custom branding",
                "Priority support",
                "Advanced analytics",
                "API access"
              ],
              current: false,
              popular: true
            },
            {
              name: "Enterprise",
              tier: "PREMIUM",
              price: 99,
              period: "month",
              features: [
                "Everything in Pro",
                "White-label solution",
                "API access",
                "Dedicated support",
                "Custom integrations",
                "On-premise deployment"
              ],
              current: false,
              popular: false
            }
          ],
          usage: {
            videosThisMonth: 2,
            totalVideos: 5,
            limit: 3
          },
          billingHistory: []
        });
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      // Set fallback data on error
      setSubscriptionData({
        currentPlan: {
          name: "Free",
          tier: "FREE",
          price: 0,
          period: "month",
          features: [
            "3 videos per month",
            "Standard quality",
            "Basic templates",
            "Community support"
          ],
          nextBilling: null,
          status: "active",
          cancelAtPeriodEnd: false
        },
        availablePlans: [
          {
            name: "Free",
            tier: "FREE",
            price: 0,
            period: "month",
            features: [
              "3 videos per month",
              "Standard quality",
              "Basic templates",
              "Community support"
            ],
            current: true,
            popular: false
          },
          {
            name: "Basic",
            tier: "BASIC",
            price: 9,
            period: "month",
            features: [
              "10 videos per month",
              "HD quality",
              "Custom branding",
              "Email support",
              "Basic analytics"
            ],
            current: false,
            popular: false
          },
          {
            name: "Pro",
            tier: "STANDARD",
            price: 29,
            period: "month",
            features: [
              "Unlimited videos",
              "HD quality",
              "Custom branding",
              "Priority support",
              "Advanced analytics",
              "API access"
            ],
            current: false,
            popular: true
          },
          {
            name: "Enterprise",
            tier: "PREMIUM",
            price: 99,
            period: "month",
            features: [
              "Everything in Pro",
              "White-label solution",
              "API access",
              "Dedicated support",
              "Custom integrations",
              "On-premise deployment"
            ],
            current: false,
            popular: false
          }
        ],
        usage: {
          videosThisMonth: 2,
          totalVideos: 5,
          limit: 3
        },
        billingHistory: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-3xl p-8">
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
        </div>
      </div>
    );
  }

  if (!subscriptionData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-3xl p-8 text-center">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Error loading subscription data</h2>
              <p className="text-lg text-foreground-muted mb-6">Please try refreshing the page</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary px-8 py-4 text-lg"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-6">
              Subscription Management
            </h1>
            <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
              Manage your subscription, billing, and upgrade your plan to unlock more features
            </p>
          </div>

          {/* Current Plan */}
          <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-3">Current Plan</h2>
                <p className="text-xl text-foreground-muted">Manage your subscription and billing</p>
              </div>
                <div className="flex items-center gap-4">
                  <span className={`px-6 py-3 rounded-2xl text-lg font-bold ${
                    subscriptionData?.currentPlan?.status === 'active' 
                      ? 'bg-success/20 text-success border border-success/30' 
                      : subscriptionData?.currentPlan?.cancelAtPeriodEnd
                      ? 'bg-warning/20 text-warning border border-warning/30'
                    : 'bg-error/20 text-error border border-error/30'
                }`}>
                  {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? 'Cancelling' : subscriptionData?.currentPlan?.status}
                </span>
                {subscriptionData?.currentPlan?.cancelAtPeriodEnd && (
                  <span className="text-lg text-foreground-muted bg-surface/50 px-4 py-2 rounded-xl">
                    Ends {subscriptionData?.currentPlan?.nextBilling}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="glass rounded-3xl p-10 hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-center gap-8 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform">
                      {subscriptionData?.currentPlan?.tier === 'FREE' ? '🆓' :
                        subscriptionData?.currentPlan?.tier === 'BASIC' ? '⭐' :
                        subscriptionData?.currentPlan?.tier === 'STANDARD' ? '💎' : '🏢'}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-foreground mb-3">{subscriptionData?.currentPlan?.name}</h3>
                      <p className="text-2xl text-foreground-muted">
                        {subscriptionData?.currentPlan?.price === 0 ? 'Free' : `$${subscriptionData?.currentPlan?.price}/${subscriptionData?.currentPlan?.period}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {subscriptionData?.currentPlan?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-success text-xl">✓</span>
                        <span className="text-lg text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {subscriptionData?.currentPlan?.nextBilling && (
                  <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                    <h4 className="text-xl font-bold text-foreground mb-4">Next Billing</h4>
                    <p className="text-4xl font-bold text-foreground mb-3">
                      {subscriptionData?.currentPlan?.price === 0 ? 'Free' : `$${subscriptionData?.currentPlan?.price}`}
                    </p>
                    <p className="text-lg text-foreground-muted">{subscriptionData?.currentPlan?.nextBilling}</p>
                  </div>
                )}
                
                <div className="glass rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
                  <h4 className="text-xl font-bold text-foreground mb-4">Usage This Month</h4>
                  <p className="text-4xl font-bold text-foreground mb-3">
                    {subscriptionData?.usage?.videosThisMonth}/{subscriptionData?.usage?.limit === 'unlimited' ? '∞' : subscriptionData?.usage?.limit}
                  </p>
                  <p className="text-lg text-foreground-muted mb-6">Videos created</p>
                  {subscriptionData?.usage?.limit !== 'unlimited' && (
                    <div className="space-y-3">
                      <div className="w-full bg-border rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-accent to-accent-2 h-4 rounded-full transition-all duration-500 shadow-lg"
                          style={{ 
                            width: `${Math.min(100, ((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-foreground-muted">
                        {Math.round(((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}% used
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {subscriptionData?.currentPlan?.tier !== 'FREE' && (
                <>
                  <button 
                    className="btn-outline px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300"
                    onClick={() => alert('Change Plan functionality coming soon!')}
                  >
                    Change Plan
                  </button>
                  <button 
                    className="btn-outline px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300"
                    onClick={() => alert('Update Payment functionality coming soon!')}
                  >
                    Update Payment
                  </button>
                  <button 
                    className="px-10 py-5 text-xl font-bold text-error hover:text-error/80 border border-error/20 rounded-3xl hover:bg-error/10 transition-all duration-300 hover:scale-105"
                    onClick={() => alert('Cancel Subscription functionality coming soon!')}
                  >
                    {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? 'Reactivate' : 'Cancel Subscription'}
                  </button>
                </>
              )}
              {subscriptionData?.currentPlan?.tier === 'FREE' && (
                <button 
                  className="btn-primary px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300"
                  onClick={() => alert('Upgrade Plan functionality coming soon!')}
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>

          {/* Available Plans */}
          <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-foreground mb-6">Available Plans</h2>
              <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">Choose the plan that best fits your needs and unlock more features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {subscriptionData?.availablePlans?.map((plan, index) => (
                <div
                  key={index}
                  className={`glass rounded-3xl p-10 relative hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group ${
                    plan.popular ? 'ring-2 ring-accent shadow-2xl shadow-accent/20' : ''
                  } ${plan.current ? 'opacity-75' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-accent to-accent-2 text-white px-6 py-3 rounded-3xl text-lg font-bold shadow-xl">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-success to-success/80 text-white px-6 py-3 rounded-3xl text-lg font-bold shadow-xl">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-foreground mb-6">{plan.name}</h3>
                    <div className="mb-8">
                      <span className="text-6xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-2xl text-foreground-muted">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-10">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-4">
                        <span className="text-success text-2xl">✓</span>
                        <span className="text-lg text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-5 rounded-3xl font-bold text-xl transition-all duration-300 ${
                      plan.current
                        ? 'bg-surface text-foreground-muted cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-accent to-accent-2 text-white hover:from-accent-hover hover:to-accent-2-hover hover:scale-105 shadow-xl'
                        : 'bg-surface-elevated text-foreground hover:bg-surface hover:scale-105'
                    }`}
                    disabled={plan.current}
                    onClick={() => {
                      if (plan.current) return;
                      alert(`Upgrade to ${plan.name} plan functionality coming soon!`);
                      setIsUpgrading(true);
                    }}
                  >
                    {plan.current ? 'Current Plan' : 'Choose Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-foreground mb-6">Billing History</h2>
              <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">Track your payment history and download invoices</p>
            </div>
            
            <div className="space-y-8">
              {(subscriptionData?.billingHistory?.length || 0) > 0 ? (
                subscriptionData?.billingHistory?.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-8 glass rounded-3xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform">
                      🧾
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{invoice.description}</p>
                      <p className="text-lg text-foreground-muted">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-2xl font-bold text-foreground">{invoice.amount}</span>
                    <span className="px-6 py-3 rounded-3xl text-lg font-bold bg-success/20 text-success border border-success/30">
                      {invoice.status}
                    </span>
                    <button 
                      className="text-accent hover:text-accent-hover text-xl font-bold hover:scale-105 transition-all duration-300"
                      onClick={() => alert('Download invoice functionality coming soon!')}
                    >
                      Download
                    </button>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-9xl mb-8">🧾</div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">No billing history</h3>
                  <p className="text-xl text-foreground-muted">Your billing history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}