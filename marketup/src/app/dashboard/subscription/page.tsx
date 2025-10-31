"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { translations } = useTranslations();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Function to get translated plan features (matching pricing page)
  const getTranslatedFeatures = (planName: string) => {
    switch (planName) {
      case "Free":
        return [
          translations.pricing1VideoPerMonth || "1 video per month",
          translations.pricingStandardQuality || "Standard quality",
          translations.pricingNoSubtitles || "No subtitles",
          translations.pricingLimitedAvatars || "Limited avatars",
          translations.pricingNoSocialPublishing || "No social publishing",
          translations.pricingDefaultBackgrounds || "Default backgrounds",
          translations.pricingAdditionalSupport || "Additional support"
        ];
      case "Pro":
        return [
          translations.pricing4VideosPerMonth || "4 videos per month",
          translations.pricingHDQuality || "HD quality",
          translations.pricingSubtitlesIncluded || "Subtitles included",
          translations.pricingExtendedAvatars || "Extended avatars",
          translations.pricingSocialPublishing || "Social publishing",
          translations.pricing2BackgroundImages || "2 background images",
          translations.pricingTeamSupport || "Team support",
          translations.pricingCompanyInfo || "Company info"
        ];
      case "Premium":
        return [
          translations.pricing7VideosPerMonth || "7 videos per month",
          translations.pricing4KQuality || "4K quality",
          translations.pricingSubtitlesIncluded || "Subtitles included",
          translations.pricingFullAvatars || "Full avatars",
          translations.pricingSocialPublishing || "Social publishing",
          translations.pricing4BackgroundImages || "4 background images",
          translations.pricingTeamSupport || "Team support",
          translations.pricingCompanyInfo || "Company info",
          translations.pricingTemplateAccess || "Template access",
          translations.pricingMarketingSupport || "Marketing support",
          translations.pricingVideoAnalytics || "Video analytics",
          translations.pricingCloudLibrary || "Cloud library",
          translations.pricingVerifiedPartner || "Verified partner"
        ];
      default:
        return [];
    }
  };

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
            period: "forever",
            features: getTranslatedFeatures("Free"),
            nextBilling: null,
            status: "active",
            cancelAtPeriodEnd: false
          },
          availablePlans: [
            {
              name: "Free",
              tier: "FREE",
              price: 0,
              period: "forever",
              features: getTranslatedFeatures("Free"),
              current: true,
              popular: false
            },
            {
              name: "Pro",
              tier: "STANDARD",
              price: 42,
              period: "month",
              features: getTranslatedFeatures("Pro"),
              current: false,
              popular: true
            },
            {
              name: "Premium",
              tier: "PREMIUM",
              price: 59,
              period: "month",
              features: getTranslatedFeatures("Premium"),
              current: false,
              popular: false
            }
          ],
          usage: {
            videosThisMonth: 0,
            totalVideos: 0,
            limit: 1
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
          period: "forever",
          features: getTranslatedFeatures("Free"),
          nextBilling: null,
          status: "active",
          cancelAtPeriodEnd: false
        },
        availablePlans: [
          {
            name: "Free",
            tier: "FREE",
            price: 0,
            period: "forever",
            features: getTranslatedFeatures("Free"),
            current: true,
            popular: false
          },
          {
            name: "Pro",
            tier: "STANDARD",
            price: 42,
            period: "month",
            features: getTranslatedFeatures("Pro"),
            current: false,
            popular: true
          },
          {
            name: "Premium",
            tier: "PREMIUM",
            price: 59,
            period: "month",
            features: getTranslatedFeatures("Premium"),
            current: false,
            popular: false
          }
        ],
        usage: {
          videosThisMonth: 0,
          totalVideos: 0,
          limit: 1
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

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-surface rounded mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 h-32 sm:h-40 lg:h-48 bg-surface rounded"></div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-16 sm:h-20 lg:h-24 bg-surface rounded"></div>
                  <div className="h-16 sm:h-20 lg:h-24 bg-surface rounded"></div>
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

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">⚠️</div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.subscriptionErrorLoadingData}</h2>
              <p className="text-base sm:text-lg text-foreground-muted mb-4 sm:mb-6">{translations.subscriptionPleaseTryRefreshing}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl"
              >
                {translations.subscriptionRefreshPage}
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

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-3 sm:mb-4">
              {translations.subscriptionManagement}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              {translations.subscriptionManageBillingUpgrade}
            </p>
          </div>

          {/* Current Plan */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{translations.subscriptionCurrentPlan}</h2>
                <p className="text-sm sm:text-base text-foreground-muted">{translations.subscriptionManageSubscriptionBilling}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  subscriptionData?.currentPlan?.status === 'active' 
                    ? 'bg-success/20 text-success border border-success/30' 
                    : subscriptionData?.currentPlan?.cancelAtPeriodEnd
                    ? 'bg-warning/20 text-warning border border-warning/30'
                  : 'bg-error/20 text-error border border-error/30'
                }`}>
                  {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? translations.subscriptionCancelling : subscriptionData?.currentPlan?.status}
                </span>
                {subscriptionData?.currentPlan?.cancelAtPeriodEnd && (
                  <span className="text-sm text-foreground-muted bg-surface/50 px-3 py-2 rounded-lg">
                    {translations.subscriptionEnds} {subscriptionData?.currentPlan?.nextBilling}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
                      {subscriptionData?.currentPlan?.tier === 'FREE' ? '🆓' :
                        subscriptionData?.currentPlan?.tier === 'STANDARD' ? '💎' : '👑'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{subscriptionData?.currentPlan?.name}</h3>
                      <p className="text-base text-foreground-muted">
                        {subscriptionData?.currentPlan?.price === 0 ? 'Free forever' : `$${subscriptionData?.currentPlan?.price}/${subscriptionData?.currentPlan?.period}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {subscriptionData?.currentPlan?.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-success text-sm">✓</span>
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {subscriptionData?.currentPlan?.nextBilling && (
                  <div className="glass rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 group">
                    <h4 className="text-sm font-bold text-foreground mb-2">{translations.subscriptionNextBilling}</h4>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {subscriptionData?.currentPlan?.price === 0 ? 'Free' : `$${subscriptionData?.currentPlan?.price}`}
                    </p>
                    <p className="text-xs text-foreground-muted">{subscriptionData?.currentPlan?.nextBilling}</p>
                  </div>
                )}
                
                <div className="glass rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 group">
                  <h4 className="text-sm font-bold text-foreground mb-2">{translations.subscriptionUsageThisMonth}</h4>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {subscriptionData?.usage?.videosThisMonth}/{subscriptionData?.usage?.limit === 'unlimited' ? '∞' : subscriptionData?.usage?.limit}
                  </p>
                  <p className="text-xs text-foreground-muted mb-3">{translations.subscriptionVideosCreated}</p>
                  {subscriptionData?.usage?.limit !== 'unlimited' && (
                    <div className="space-y-2">
                      <div className="w-full bg-border rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full transition-all duration-500 shadow-lg"
                          style={{ 
                            width: `${Math.min(100, ((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-foreground-muted">
                        {Math.round(((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}% {translations.subscriptionUsed}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-6">
              {subscriptionData?.currentPlan?.tier !== 'FREE' && (
                <>
                  <button 
                    className="btn-outline px-4 py-2 text-sm font-bold hover:scale-105 transition-all duration-300 rounded-xl"
                    onClick={() => alert(translations.subscriptionChangePlanFunctionalityComingSoon)}
                  >
                    {translations.subscriptionChangePlan}
                  </button>
                  <button 
                    className="btn-outline px-4 py-2 text-sm font-bold hover:scale-105 transition-all duration-300 rounded-xl"
                    onClick={() => alert(translations.subscriptionUpdatePaymentFunctionalityComingSoon)}
                  >
                    {translations.subscriptionUpdatePayment}
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-bold text-error hover:text-error/80 border border-error/20 rounded-xl hover:bg-error/10 transition-all duration-300 hover:scale-105"
                    onClick={() => alert(translations.subscriptionCancelSubscriptionFunctionalityComingSoon)}
                  >
                    {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? translations.subscriptionReactivate : translations.subscriptionCancelSubscription}
                  </button>
                </>
              )}
              {subscriptionData?.currentPlan?.tier === 'FREE' && (
                <button 
                  className="btn-primary px-4 py-2 text-sm font-bold hover:scale-105 transition-all duration-300 rounded-xl"
                  onClick={() => alert(translations.subscriptionUpgradePlanFunctionalityComingSoon)}
                >
                  {translations.subscriptionUpgradePlan}
                </button>
              )}
            </div>
          </div>

          {/* Available Plans */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{translations.subscriptionAvailablePlans}</h2>
              <p className="text-sm sm:text-base text-foreground-muted max-w-2xl mx-auto leading-relaxed">{translations.subscriptionChoosePlanBestFits}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subscriptionData?.availablePlans?.map((plan, index) => (
                <div
                  key={index}
                  className={`glass rounded-2xl p-4 sm:p-6 relative hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group ${
                    plan.popular ? 'ring-2 ring-accent shadow-2xl shadow-accent/20' : ''
                  } ${plan.current ? 'opacity-75' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-accent to-accent-2 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xl">
                        {translations.subscriptionMostPopular}
                      </span>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-success to-success/80 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xl">
                        {translations.subscriptionCurrentPlan}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.price === 0 ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-bold text-foreground">Free</span>
                          <span className="text-sm text-foreground-muted"> forever</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl sm:text-3xl font-bold text-foreground">${plan.price}</span>
                          <span className="text-sm text-foreground-muted">/{plan.period}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-success text-sm">✓</span>
                        <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-2 sm:py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      plan.current
                        ? 'bg-surface text-foreground-muted cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-accent to-accent-2 text-white hover:from-accent-hover hover:to-accent-2-hover hover:scale-105 shadow-xl'
                        : 'bg-surface-elevated text-foreground hover:bg-surface hover:scale-105'
                    }`}
                    disabled={plan.current}
                    onClick={() => {
                      if (plan.current) return;
                      alert(translations.subscriptionUpgradeToPlanFunctionalityComingSoon.replace('{plan}', plan.name));
                      setIsUpgrading(true);
                    }}
                  >
                    {plan.current ? translations.subscriptionCurrentPlan : translations.subscriptionChoosePlan}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{translations.subscriptionBillingHistory}</h2>
              <p className="text-sm sm:text-base text-foreground-muted max-w-2xl mx-auto leading-relaxed">{translations.subscriptionTrackPaymentHistory}</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {(subscriptionData?.billingHistory?.length || 0) > 0 ? (
                subscriptionData?.billingHistory?.map((invoice, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass rounded-2xl hover:scale-[1.02] transition-all duration-300 group gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">
                      🧾
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{invoice.description}</p>
                      <p className="text-xs text-foreground-muted">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-sm font-bold text-foreground">{invoice.amount}</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-success/20 text-success border border-success/30">
                      {invoice.status}
                    </span>
                    <button 
                      className="text-accent hover:text-accent-hover text-xs font-bold hover:scale-105 transition-all duration-300"
                      onClick={() => alert(translations.subscriptionDownloadInvoiceFunctionalityComingSoon)}
                    >
                      {translations.subscriptionDownload}
                    </button>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🧾</div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">{translations.subscriptionNoBillingHistory}</h3>
                  <p className="text-sm sm:text-base text-foreground-muted">{translations.subscriptionBillingHistoryWillAppear}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}