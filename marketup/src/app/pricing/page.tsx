"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
      translations.pricingMarketingSupport
    ],
    popular: false,
    cta: translations.pricingStartPremiumTrial,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-gradient-to-br from-amber-50/20 to-orange-50/20',
    borderColor: 'border-amber-400/30'
  }
];

const getCountryPricing = (translations: any) => [
  { country: translations.pricingJordan, free: "0", pro: "42 USD", premium: "59 USD", flag: "🇯🇴" },
  { country: translations.pricingSweden, free: "0", pro: "41 USD", premium: "58 USD", flag: "🇸🇪" },
  { country: translations.pricingLebanon, free: "0", pro: "31 USD", premium: "49 USD", flag: "🇱🇧" },
  { country: translations.pricingTurkey, free: "0", pro: "35 USD", premium: "48 USD", flag: "🇹🇷" },
  { country: translations.pricingSyria, free: "0", pro: "29 USD", premium: "45 USD", flag: "🇸🇾" }
];

export default function PricingPage() {
  const { translations } = useTranslations();
  const router = useRouter();
  
  const plans = getPlans(translations);
  const countryPricing = getCountryPricing(translations);

  const handlePlanSelect = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-glow border border-accent/20 text-foreground text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
              <span>MarketUp</span>
              <div className="w-2 h-2 bg-gradient-to-r from-accent-2 to-purple-500 rounded-full animate-pulse" />
            </div>
            
            {/* Main heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white mb-8">
              {translations.pricingSimpleTransparent}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light mb-16">
              {translations.pricingAllPlansDescription}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`group relative ${plan.bgColor} backdrop-blur-sm border ${plan.borderColor} rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    plan.popular 
                      ? 'ring-2 ring-blue-400/50 shadow-2xl shadow-blue-500/20' 
                      : 'hover:shadow-xl hover:shadow-white/10'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-3xl" />
                  
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {translations.pricingMostPopular}
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-white/70 mb-6 text-sm leading-relaxed">{plan.description}</p>
              
                      <div className="mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-white">
                            ${plan.price}
                          </span>
                          <span className="text-lg text-white/60 ml-2">
                            /{plan.period === 'forever' ? 'forever' : 'month'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-white/90 text-sm font-medium leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1'
                          : plan.id === 'free'
                          ? 'bg-white/10 text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/20'
                          : `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1`
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {plan.cta}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      {plan.popular && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Country Pricing Table */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                {translations.pricingCountryPricing}
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Prices vary by country to ensure accessibility and local market compatibility
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-6 px-8 font-bold text-white text-lg">Country</th>
                      <th className="text-center py-6 px-8 font-bold text-white text-lg">Free Plan</th>
                      <th className="text-center py-6 px-8 font-bold text-white text-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                        Pro Plan
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold">
                          {translations.pricingMostPopular}
                        </div>
                      </th>
                      <th className="text-center py-6 px-8 font-bold text-white text-lg">Premium Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryPricing.map((country, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-5 px-8 text-white font-medium flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          {country.country}
                        </td>
                        <td className="py-5 px-8 text-center">
                          <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                            {country.free}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-center bg-blue-500/5">
                          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30">
                            {country.pro}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-center">
                          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-400/30">
                            {country.premium}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black rounded-3xl p-16 text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Simple pricing
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                Simple plans for creators and businesses. See full details on the pricing page.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/pricing"
                  className="group bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  See pricing
                </Link>
                <button
                  onClick={() => handlePlanSelect('pro')}
                  className="group bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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