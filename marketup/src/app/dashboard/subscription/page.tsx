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
    downloadUrl?: string;
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
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

      <div className="relative z-10 p-3 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-slate-800/40 rounded mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="lg:col-span-2 h-32 sm:h-40 lg:h-48 bg-slate-800/40 rounded"></div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="h-16 sm:h-20 lg:h-24 bg-slate-800/40 rounded"></div>
                  <div className="h-16 sm:h-20 lg:h-24 bg-slate-800/40 rounded"></div>
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
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.subscriptionErrorLoadingData}</h2>
              <p className="text-sm sm:text-base text-white/60 mb-4 sm:mb-6">{translations.subscriptionPleaseTryRefreshing}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
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
              <span>Subscription</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              {subscriptionData?.currentPlan?.tier === 'FREE' ? (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              ) : subscriptionData?.currentPlan?.tier === 'STANDARD' ? (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {translations.subscriptionManagement}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.subscriptionManageBillingUpgrade}</p>
          </div>
          </div>

        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Current Plan - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    {subscriptionData?.currentPlan?.tier === 'FREE' ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    ) : subscriptionData?.currentPlan?.tier === 'STANDARD' ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    )}
                  </div>
              <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.subscriptionCurrentPlan}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {subscriptionData?.currentPlan?.name}
                    </p>
                  </div>
              </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${
                  subscriptionData?.currentPlan?.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : subscriptionData?.currentPlan?.cancelAtPeriodEnd
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? translations.subscriptionCancelling : subscriptionData?.currentPlan?.status}
                </span>
                  {subscriptionData?.currentPlan?.price != null && subscriptionData.currentPlan.price > 0 && (
                    <span className="text-xs sm:text-sm font-semibold text-white/60">
                      ${subscriptionData.currentPlan.price}/{subscriptionData.currentPlan.period}
                  </span>
                )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">
                  {subscriptionData?.currentPlan?.features?.length || 0} {translations.subscriptionFeatures || "features"}
                </span>
              </div>
              </div>
            </div>

          {/* Usage - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                    </div>
                    <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.subscriptionUsageThisMonth}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {subscriptionData?.usage?.videosThisMonth || 0}/{subscriptionData?.usage?.limit === 'unlimited' ? '∞' : subscriptionData?.usage?.limit}
                  </p>
                </div>
              </div>
              {subscriptionData?.usage?.limit !== 'unlimited' && (
                <div className="mt-3 sm:mt-4">
                  <div className="flex justify-between text-xs text-white/60 mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs">{translations.subscriptionVideosCreated}</span>
                    <span className="text-[10px] sm:text-xs">{Math.round(((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, ((subscriptionData?.usage?.videosThisMonth || 0) / Number(subscriptionData?.usage?.limit || 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Available Plans */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.subscriptionAvailablePlans}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {subscriptionData?.availablePlans?.map((plan, index) => (
                  <div
                    key={index}
                    className={`bg-slate-800/40 border rounded-lg sm:rounded-xl p-3 sm:p-4 pt-5 sm:pt-6 relative hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group ${
                      plan.popular ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' : 'border-slate-700/60'
                    } ${plan.current ? 'opacity-75' : ''}`}
                  >
                    {plan.current ? (
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold shadow-lg">
                          {translations.subscriptionCurrentPlan}
                        </span>
                      </div>
                    ) : plan.popular ? (
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold shadow-lg">
                          {translations.subscriptionMostPopular}
                        </span>
                      </div>
                    ) : null}

                    <div className="text-center mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-white mb-1 sm:mb-2">{plan.name}</h3>
                      <div className="mb-2 sm:mb-3">
                        {plan.price === 0 ? (
                          <>
                            <span className="text-xl sm:text-2xl font-bold text-white">Free</span>
                            <span className="text-[10px] sm:text-xs text-white/60"> forever</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl sm:text-2xl font-bold text-white">${plan.price}</span>
                            <span className="text-[10px] sm:text-xs text-white/60">/{plan.period}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-2 sm:mb-3">
                      {plan.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-[10px] sm:text-xs text-white/80 truncate">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-[10px] sm:text-xs text-white/60 text-center">+{plan.features.length - 3} more</div>
                      )}
                    </div>

                    <button
                      className={`w-full py-1.5 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs transition-all duration-300 ${
                        plan.current
                          ? 'bg-slate-800/40 text-white/50 cursor-not-allowed border border-slate-700/60'
                          : plan.popular
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-800/40 hover:bg-slate-800/60 text-white border border-slate-700/60 hover:border-indigo-500/40'
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
          </div>
          
          {/* Right Column - Actions & Billing */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Actions Card */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
                <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">{translations.subscriptionActions || "Actions"}</h3>
                <div className="space-y-2 sm:space-y-3">
              {subscriptionData?.currentPlan?.tier !== 'FREE' && (
                <>
                  <button 
                        className="w-full px-3 py-2 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-indigo-500/40 text-xs sm:text-sm font-semibold transition-all duration-300"
                    onClick={() => alert(translations.subscriptionChangePlanFunctionalityComingSoon)}
                  >
                    {translations.subscriptionChangePlan}
                  </button>
                  <button 
                        className="w-full px-3 py-2 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-purple-500/40 text-xs sm:text-sm font-semibold transition-all duration-300"
                    onClick={() => alert(translations.subscriptionUpdatePaymentFunctionalityComingSoon)}
                  >
                    {translations.subscriptionUpdatePayment}
                  </button>
                  <button 
                        className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:border-red-500/40 text-xs sm:text-sm font-semibold transition-all duration-300"
                    onClick={() => alert(translations.subscriptionCancelSubscriptionFunctionalityComingSoon)}
                  >
                    {subscriptionData?.currentPlan?.cancelAtPeriodEnd ? translations.subscriptionReactivate : translations.subscriptionCancelSubscription}
                  </button>
                </>
              )}
              {subscriptionData?.currentPlan?.tier === 'FREE' && (
                <button 
                      className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
                  onClick={() => alert(translations.subscriptionUpgradePlanFunctionalityComingSoon)}
                >
                  {translations.subscriptionUpgradePlan}
                </button>
              )}
            </div>
          </div>
            </div>

            {/* Next Billing Card */}
            {subscriptionData?.currentPlan?.nextBilling && (
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl" />
                <div className="relative z-10">
                  <h3 className="text-xs sm:text-sm font-semibold text-white/60 mb-1 sm:mb-2">{translations.subscriptionNextBilling}</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {subscriptionData?.currentPlan?.price === 0 ? 'Free' : `$${subscriptionData?.currentPlan?.price}`}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/50">{subscriptionData?.currentPlan?.nextBilling}</p>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Billing History */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.subscriptionBillingHistory}</h2>
          <div className="space-y-2 sm:space-y-3">

              {(subscriptionData?.billingHistory?.length || 0) > 0 ? (
                subscriptionData?.billingHistory?.map((invoice, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    </div>
                    <div>
                    <p className="text-xs sm:text-sm font-semibold text-white">{invoice.description}</p>
                    <p className="text-[10px] sm:text-xs text-white/60">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-white">{invoice.amount}</span>
                  <span className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                      {invoice.status}
                    </span>
                    <button 
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-800/60 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-[10px] sm:text-xs font-semibold transition-all duration-300 border border-slate-700/60 hover:border-indigo-500/40 flex items-center gap-1.5"
                      onClick={() => {
                        if (invoice.downloadUrl) {
                          const newWindow = window.open(invoice.downloadUrl, '_blank');
                          if (newWindow) {
                            newWindow.onload = () => {
                              setTimeout(() => {
                                newWindow.print();
                              }, 500);
                            };
                          }
                        }
                      }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {translations.subscriptionDownload}
                    </button>
                  </div>
                </div>
                ))
              ) : (
              <div className="text-center py-6 sm:py-8 lg:py-12">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{translations.subscriptionNoBillingHistory}</h3>
                <p className="text-xs sm:text-sm text-white/60">{translations.subscriptionBillingHistoryWillAppear}</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}