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

// Internal pricing logic - not displayed to users
const getCountryPricing = (translations: any) => {
  // 5 specific countries with their own pricing
  const specificCountries = [
    { country: translations.pricingJordan, free: "0", pro: "42 USD", premium: "59 USD", flag: "🇯🇴" },
    { country: translations.pricingSweden, free: "0", pro: "41 USD", premium: "58 USD", flag: "🇸🇪" },
    { country: translations.pricingLebanon, free: "0", pro: "31 USD", premium: "49 USD", flag: "🇱🇧" },
    { country: translations.pricingTurkey, free: "0", pro: "35 USD", premium: "48 USD", flag: "🇹🇷" },
    { country: translations.pricingSyria, free: "0", pro: "29 USD", premium: "45 USD", flag: "🇸🇾" }
  ];
  
  // All other European countries use Sweden's pricing
  const europeanCountries = [
    { country: "Germany", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇩🇪" },
    { country: "France", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇫🇷" },
    { country: "Italy", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇮🇹" },
    { country: "Spain", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇪🇸" },
    { country: "Netherlands", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇳🇱" },
    { country: "Poland", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇵🇱" },
    { country: "Norway", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇳🇴" },
    { country: "Denmark", free: "0", pro: "41 USD", premium: "58 USD", flag: "🇩🇰" }
  ];
  
  return [...specificCountries, ...europeanCountries];
};

export default function PricingPage() {
  const { translations } = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const [userSubscription, setUserSubscription] = useState<{ tier: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const plans = getPlans(translations);
  const countryPricing = getCountryPricing(translations);

  // Fetch user subscription
  useEffect(() => {
    if (session) {
      fetch('/api/dashboard/overview', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.subscription) {
            setUserSubscription({
              tier: data.data.subscription.tier,
              status: data.data.subscription.status
            });
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-glow border border-accent/20 text-foreground text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
              <span>MarketUp</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-accent-2 to-purple-500 rounded-full animate-pulse" />
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-6 sm:mb-8">
              {translations.pricingSimpleTransparent}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed font-light mb-12 sm:mb-16">
              {translations.pricingAllPlansDescription}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-12 sm:pb-16 md:pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`group relative ${plan.bgColor} backdrop-blur-sm border ${plan.borderColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    plan.popular 
                      ? 'ring-2 ring-blue-400/50 shadow-2xl shadow-blue-500/20' 
                      : 'hover:shadow-xl hover:shadow-white/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  
                  {plan.popular && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {translations.pricingMostPopular}
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${plan.color} mb-3 sm:mb-4`}>
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-white/70 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">{plan.description}</p>
              
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            ${plan.price}
                          </span>
                          <span className="text-sm sm:text-base md:text-lg text-white/60 ml-1 sm:ml-2">
                            /{plan.period === 'forever' ? 'forever' : 'month'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
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
                      <div className="mb-4 px-4 py-2 rounded-lg bg-success/20 border border-success/30 text-center">
                        <span className="text-sm font-bold text-success flex items-center justify-center gap-2">
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
                          ? 'bg-success/20 text-success border-2 border-success/30 cursor-not-allowed opacity-75'
                          : plan.id === 'pro' || plan.id === 'premium'
                          ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 cursor-pointer`
                          : plan.id === 'free'
                          ? 'bg-white/10 text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/20 cursor-pointer'
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
              ))}
            </div>
          </div>
        </section>

        

        {/* CTA Section */}
        <section className="pb-12 sm:pb-16 md:pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
                Simple pricing
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                Simple plans for creators and businesses. See full details on the pricing page.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Link
                  href="/pricing"
                  className="group bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  See pricing
                </Link>
                <button
                  onClick={() => handlePlanSelect('pro')}
                  className="group bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}