"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

const getPlans = (translations: any) => [
  {
    id: 'free',
    name: translations.pricingFree,
    price: 0,
    period: 'forever',
    description: translations.pricingPerfectForTesting,
    features: [
      translations.pricing1VideoPerMonth,
      translations.pricingStandardQuality,
      translations.pricingNoSubtitles,
      translations.pricingLimitedAvatars,
      translations.pricingNoSocialPublishing,
      translations.pricingDefaultBackgrounds,
      translations.pricingAdditionalSupport
    ],
    popular: false,
    cta: translations.pricingGetStartedFree,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50/10',
    borderColor: 'border-slate-200/20'
  },
  {
    id: 'pro',
    name: translations.pricingPro,
    price: 42,
    period: 'month',
    description: translations.pricingIdealForBusiness,
    features: [
      translations.pricing4VideosPerMonth,
      translations.pricingHDQuality,
      translations.pricingSubtitlesIncluded,
      translations.pricingExtendedAvatars,
      translations.pricingSocialPublishing,
      translations.pricing2BackgroundImages,
      translations.pricingTeamSupport,
      translations.pricingCompanyInfo
    ],
    popular: true,
    cta: translations.pricingStartProTrial,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-blue-50/20 to-purple-50/20',
    borderColor: 'border-blue-400/30'
  },
  {
    id: 'premium',
    name: translations.pricingPremium,
    price: 59,
    period: 'month',
    description: translations.pricingSuitableForEveryone,
    features: [
      translations.pricing7VideosPerMonth,
      translations.pricing4KQuality,
      translations.pricingSubtitlesIncluded,
      translations.pricingFullAvatars,
      translations.pricingSocialPublishing,
      translations.pricing4BackgroundImages,
      translations.pricingTeamSupport,
      translations.pricingCompanyInfo,
      translations.pricingTemplateAccess,
      translations.pricingMarketingSupport,
      translations.pricingVideoAnalytics,
      translations.pricingCloudLibrary,
      translations.pricingVerifiedPartner
    ],
    popular: false,
    cta: translations.pricingStartPremiumTrial,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-gradient-to-br from-amber-50/20 to-orange-50/20',
    borderColor: 'border-amber-400/30'
  }
];

// Country code to pricing mapping
const getCountryPricingMap = () => {
  return {
    'JO': { pro: 42, premium: 59 }, // Jordan
    'SE': { pro: 41, premium: 58 }, // Sweden
    'LB': { pro: 31, premium: 49 }, // Lebanon
    'TR': { pro: 35, premium: 48 }, // Turkey
    'SY': { pro: 29, premium: 45 }, // Syria
    // European countries use Sweden's pricing
    'DE': { pro: 41, premium: 58 }, // Germany
    'FR': { pro: 41, premium: 58 }, // France
    'IT': { pro: 41, premium: 58 }, // Italy
    'ES': { pro: 41, premium: 58 }, // Spain
    'NL': { pro: 41, premium: 58 }, // Netherlands
    'PL': { pro: 41, premium: 58 }, // Poland
    'NO': { pro: 41, premium: 58 }, // Norway
    'DK': { pro: 41, premium: 58 }, // Denmark
    // Default pricing for other countries
    'US': { pro: 42, premium: 59 },
    'GB': { pro: 42, premium: 59 },
    'CA': { pro: 42, premium: 59 },
    'AU': { pro: 42, premium: 59 },
    'JP': { pro: 42, premium: 59 },
    'AE': { pro: 42, premium: 59 },
  };
};

// Get pricing for a specific country
const getPricingForCountry = (countryCode: string | null | undefined) => {
  const pricingMap = getCountryPricingMap();
  // Default to Jordan pricing if country not found
  return pricingMap[countryCode as keyof typeof pricingMap] || { pro: 42, premium: 59 };
};

export default function PricingPage() {
  const { translations } = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const [userSubscription, setUserSubscription] = useState<{ tier: string; status: string } | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get pricing for user's country
  const countryPricing = getPricingForCountry(userCountry);
  
  // Update plans with country-specific pricing
  const plans = getPlans(translations).map(plan => {
    if (plan.id === 'pro') {
      return { ...plan, price: countryPricing.pro };
    } else if (plan.id === 'premium') {
      return { ...plan, price: countryPricing.premium };
    }
    return plan;
  });

  // Update background height to match content
  useEffect(() => {
    const updateBackgroundHeight = () => {
      const bg = document.getElementById('pricing-background');
      const contentContainer = document.querySelector('[data-pricing-content]');
      if (bg && contentContainer) {
        bg.style.height = `${contentContainer.scrollHeight}px`;
      }
    };

    // Update after a short delay to ensure content is rendered
    const timeoutId = setTimeout(updateBackgroundHeight, 100);
    window.addEventListener('resize', updateBackgroundHeight);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBackgroundHeight);
    };
  }, [loading, userSubscription]);

  // Fetch user subscription and country
  useEffect(() => {
    if (session) {
      Promise.all([
        fetch('/api/dashboard/overview', { credentials: 'include' }).then(res => res.json()),
        fetch('/api/profile', { credentials: 'include' }).then(res => res.json())
      ])
        .then(([overviewData, profileData]) => {
          if (overviewData.success && overviewData.data.subscription) {
            setUserSubscription({
              tier: overviewData.data.subscription.tier,
              status: overviewData.data.subscription.status
            });
          }
          if (profileData.country) {
            setUserCountry(profileData.country);
          }
        })
        .catch(() => {
          // Ignore errors
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  // Map plan IDs to subscription tiers
  const planTierMap: Record<string, string> = {
    'free': 'BASIC',
    'pro': 'STANDARD',
    'premium': 'PREMIUM'
  };

  const isPlanActive = (planId: string) => {
    if (!userSubscription) return false;
    const tier = planTierMap[planId];
    return userSubscription.tier === tier && userSubscription.status === 'ACTIVE';
  };

  const handlePlanSelect = (planId: string) => {
    // Check if user already has this plan
    if (isPlanActive(planId)) {
      alert('You already have an active subscription to this plan. Please visit your dashboard to manage your subscription.');
      return;
    }

    // Pro and Premium plans are available for payment
    if (planId === 'pro' || planId === 'premium') {
      router.push(`/checkout?plan=${planId}`);
    } else if (planId === 'free') {
      // Free plan - redirect to studio
      router.push('/studio');
    }
  };

  return (
    <div className="bg-[#0b0b0b] relative">
      <div className="relative z-10" data-pricing-content>
        {/* Shared background blobs for all sections */}
        <div className="absolute top-0 left-0 w-full pointer-events-none z-0 overflow-hidden" id="pricing-background">
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
        {/* Hero Section */}
        <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge with decorative lines */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span>MarketUp</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
            
            {/* Main heading */}
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
              <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                {translations.pricingSimpleTransparent}
              </span>
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-white/70 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed font-light mb-12 sm:mb-16">
              {translations.pricingAllPlansDescription}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="group relative h-full flex flex-col"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                    plan.id === 'free' ? 'from-slate-600 to-slate-400' :
                    plan.id === 'pro' ? 'from-indigo-600 to-purple-600' :
                    'from-amber-600 to-orange-600'
                  } rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  
                  <div className={`relative flex flex-col flex-1 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    plan.popular 
                      ? 'hover:border-indigo-500/60 shadow-2xl shadow-indigo-500/20' 
                      : 'hover:border-slate-600/60 hover:shadow-xl hover:shadow-slate-500/10'
                  }`}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  
                  {plan.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border border-indigo-400/50">
                      {translations.pricingMostPopular}
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${
                        plan.id === 'free' ? 'from-slate-600/80 to-slate-500/80' :
                        plan.id === 'pro' ? 'from-indigo-600/80 to-purple-600/80' :
                        'from-amber-600/80 to-orange-600/80'
                      } mb-3 sm:mb-4 shadow-xl ${
                        plan.id === 'free' ? 'shadow-slate-500/20' :
                        plan.id === 'pro' ? 'shadow-indigo-500/20' :
                        'shadow-amber-500/20'
                      }`}>
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-white/70 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">{plan.description}</p>
              
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${
                            plan.id === 'free' ? 'from-slate-300 to-slate-400' :
                            plan.id === 'pro' ? 'from-indigo-400 to-purple-400' :
                            'from-amber-400 to-orange-400'
                          } bg-clip-text text-transparent`}>
                            ${plan.price}
                          </span>
                          <span className="text-sm sm:text-base md:text-lg text-white/60 ml-1 sm:ml-2">
                            /{plan.period === 'forever' ? 'forever' : 'month'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Current Plan Badge */}
                    {isPlanActive(plan.id) && (
                      <div className="mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-center">
                        <span className="text-sm font-bold text-green-300 flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Current Plan
                        </span>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={isPlanActive(plan.id)}
                      className={`group relative w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 overflow-hidden ${
                        isPlanActive(plan.id)
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-2 border-green-400/50 cursor-not-allowed opacity-75'
                          : plan.id === 'pro' || plan.id === 'premium'
                          ? `bg-gradient-to-r ${
                              plan.id === 'pro' ? 'from-indigo-600 via-purple-600 to-pink-600' :
                              'from-amber-600 via-orange-600 to-red-600'
                            } text-white hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 cursor-pointer`
                          : plan.id === 'free'
                          ? 'bg-gradient-to-r from-slate-700/60 to-slate-800/60 text-white border-2 border-slate-600/40 hover:border-slate-500/60 hover:bg-slate-700/80 cursor-pointer'
                          : `bg-gradient-to-r ${plan.color} text-white opacity-50 cursor-not-allowed`
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isPlanActive(plan.id) 
                          ? 'Current Plan' 
                          : plan.cta}
                        {(plan.id === 'pro' || plan.id === 'premium' || plan.id === 'free') && !isPlanActive(plan.id) && (
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </span>
                      {(plan.popular || plan.id === 'premium') && (plan.id === 'pro' || plan.id === 'premium') && !isPlanActive(plan.id) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}