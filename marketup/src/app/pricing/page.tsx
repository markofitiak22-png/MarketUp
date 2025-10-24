"use client";
import React, { useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

const getPlans = (translations: any) => [
  {
    id: 'free',
    name: translations.pricingFree,
    price: 0,
    period: 'forever',
    description: translations.pricingPerfectForGettingStarted,
    features: [
      translations.pricing3VideosPerMonth,
      translations.pricingStandardQuality720p,
      translations.pricingBasicAvatars,
      translations.pricing5Languages,
      translations.pricingCommunitySupport,
      translations.pricingWatermarkOnVideos
    ],
    popular: false,
    cta: translations.pricingGetStartedFree,
    color: 'border-border'
  },
  {
    id: 'pro',
    name: translations.pricingPro,
    price: 29,
    period: 'month',
    description: translations.pricingBestForProfessionals,
    features: [
      translations.pricing50VideosPerMonth,
      translations.pricingHDQuality1080p,
      translations.pricingAllAvatarsVoices,
      translations.pricing20PlusLanguages,
      translations.pricingPrioritySupport,
      translations.pricingNoWatermark,
      translations.pricingCustomBackgrounds,
      translations.pricingAdvancedEditingTools,
      translations.pricingAPIAccess
    ],
    popular: true,
    cta: translations.pricingStartProTrial,
    color: 'border-accent',
    badge: translations.pricingMostPopular
  },
  {
    id: 'enterprise',
    name: translations.pricingEnterprise,
    price: 99,
    period: 'month',
    description: translations.pricingForTeamsOrganizations,
    features: [
      translations.pricingUnlimitedVideos,
      translations.pricing4KQuality2160p,
      translations.pricingCustomAvatars,
      translations.pricingAllLanguagesVoices,
      translations.pricingDedicatedSupport,
      translations.pricingNoWatermark,
      translations.pricingCustomBranding,
      translations.pricingTeamCollaboration,
      translations.pricingAdvancedAnalytics,
      translations.pricingWhiteLabelSolution,
      translations.pricingCustomIntegrations,
      translations.pricingSLAGuarantee
    ],
    popular: false,
    cta: translations.pricingContactSales,
    color: 'border-accent-2',
    badge: translations.pricingEnterpriseBadge
  }
];

const getFeatures = (translations: any) => [
  {
    category: translations.pricingVideoCreation,
    items: [
      { name: translations.pricingVideosPerMonth, free: '3', pro: '50', enterprise: translations.pricingUnlimitedVideos },
      { name: translations.pricingVideoQuality, free: '720p', pro: '1080p', enterprise: '4K' },
      { name: translations.pricingVideoDuration, free: '60s max', pro: '10 min max', enterprise: translations.pricingUnlimitedVideos },
      { name: translations.pricingExportFormats, free: 'MP4', pro: 'MP4, WebM', enterprise: 'All formats' }
    ]
  },
  {
    category: translations.pricingAvatarsVoices,
    items: [
      { name: translations.pricingAvailableAvatars, free: '3', pro: '12+', enterprise: 'Unlimited + Custom' },
      { name: translations.pricingVoiceOptions, free: translations.pricing5Languages, pro: translations.pricing20PlusLanguages, enterprise: translations.pricingAllLanguagesVoices },
      { name: translations.pricingVoiceQuality, free: 'Standard', pro: 'Premium', enterprise: 'Ultra HD' },
      { name: translations.pricingCustomVoices, free: '❌', pro: '❌', enterprise: '✅' }
    ]
  },
  {
    category: translations.pricingFeatures,
    items: [
      { name: translations.pricingBackgroundOptions, free: '5', pro: '20+', enterprise: 'Unlimited + Custom' },
      { name: 'Watermark', free: 'Yes', pro: 'No', enterprise: 'No' },
      { name: 'API access', free: '❌', pro: '✅', enterprise: '✅' },
      { name: translations.pricingTeamCollaboration, free: '❌', pro: '❌', enterprise: '✅' }
    ]
  },
  {
    category: translations.pricingSupport,
    items: [
      { name: translations.pricingEmailSupport, free: '✅', pro: '✅', enterprise: '✅' },
      { name: translations.pricingPrioritySupport, free: '❌', pro: '✅', enterprise: '✅' },
      { name: translations.pricingDedicatedSupport, free: '❌', pro: '❌', enterprise: '✅' },
      { name: translations.pricingSLAGuarantee, free: '❌', pro: '❌', enterprise: '✅' }
    ]
  }
];

export default function PricingPage() {
  const { translations } = useTranslations();
  // const { data: session } = useSession();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  // const [selectedPlan] = useState<string | null>(null);
  
  const plans = getPlans(translations);
  const features = getFeatures(translations);

  const handlePlanSelect = (planId: string) => {
    if (planId === 'enterprise') {
      // Redirect to contact form for enterprise
      router.push('/contact?plan=enterprise');
    } else {
      // setSelectedPlan(planId);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="section-lg text-center">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                <span className="text-gradient font-semibold text-base">{translations.pricingTransparentPricing}</span>
                <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
              </div>
              
              {/* Main heading */}
              <div className="space-y-8 mb-16">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                  {translations.pricingSimpleTransparent} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">pricing</span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                  {translations.pricingChoosePerfectPlan} <span className="text-accent font-medium">{translations.pricingNoHiddenFees}</span>
                </p>
              </div>
            
              {/* Billing Toggle */}
              <div className="inline-flex items-center glass-elevated rounded-2xl p-2 border border-accent/20">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    billingPeriod === 'monthly' 
                      ? 'bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/25' 
                      : 'text-foreground-muted hover:text-foreground hover:bg-accent/5'
                  }`}
                >
                  {translations.pricingMonthly}
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                    billingPeriod === 'yearly' 
                      ? 'bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/25' 
                      : 'text-foreground-muted hover:text-foreground hover:bg-accent/5'
                  }`}
                >
                  {translations.pricingYearly}
                  {billingPeriod === 'yearly' && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-success to-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                      {translations.pricingSave20}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="section relative">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`group relative glass-elevated rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] ${
                      plan.popular 
                        ? 'border-2 border-accent shadow-2xl shadow-accent/20 bg-gradient-to-br from-accent/5 to-accent-2/5' 
                        : 'border border-[var(--border)] hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10'
                    }`}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-2/10 to-transparent rounded-tr-3xl" />
                    
                    {plan.badge && (
                      <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-lg ${
                        plan.badge === 'Most Popular' 
                          ? 'bg-gradient-to-r from-accent to-accent-2 text-white' 
                          : 'bg-gradient-to-r from-accent-2 to-purple-600 text-white'
                      }`}>
                        {plan.badge}
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-foreground mb-3">{plan.name}</h3>
                        <p className="text-foreground-muted mb-6 text-lg">{plan.description}</p>
                
                        <div className="mb-8">
                          <div className="flex items-baseline justify-center">
                            <span className="text-6xl font-bold text-foreground">
                              ${billingPeriod === 'yearly' && plan.price > 0 
                                ? getYearlyPrice(plan.price)
                                : plan.price
                              }
                            </span>
                            <span className="text-xl text-foreground-muted ml-2">
                              /{plan.period === 'forever' ? translations.pricingForever : billingPeriod === 'yearly' ? translations.pricingYear : translations.pricingMonth}
                            </span>
                          </div>
                          
                          {billingPeriod === 'yearly' && plan.price > 0 && (
                            <div className="mt-3">
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-success to-green-500 text-white shadow-lg">
                                {translations.pricingSavePerYear.replace('$', `$${getYearlyDiscount(plan.price)}`)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-success to-green-500 flex items-center justify-center mt-0.5 shadow-lg">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-foreground text-base font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePlanSelect(plan.id)}
                        className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                          plan.popular
                            ? 'bg-gradient-to-r from-accent to-accent-2 text-white hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1'
                            : plan.id === 'free'
                            ? 'bg-surface-elevated text-foreground border-2 border-[var(--border)] hover:border-accent/50 hover:bg-accent/5'
                            : 'bg-gradient-to-r from-accent-2 to-purple-600 text-white hover:shadow-xl hover:shadow-accent-2/30 hover:-translate-y-1'
                        }`}
                      >
                        <span className="relative z-10">{plan.cta}</span>
                        {plan.popular && (
                          <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/3" />
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {translations.pricingFeatureComparison}
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                {translations.pricingCompareAllFeatures} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">features</span>
              </h2>
              <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                {translations.pricingEverythingYouNeed}
              </p>
            </div>

            <div className="glass-elevated rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-8 px-8 font-bold text-foreground text-xl">{translations.pricingFeatures}</th>
                      <th className="text-center py-8 px-8 font-bold text-foreground text-xl">{translations.pricingFree}</th>
                      <th className="text-center py-8 px-8 font-bold text-foreground text-xl bg-gradient-to-br from-accent/10 to-accent-2/10 relative">
                        {translations.pricingPro}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-accent to-accent-2 text-white text-sm font-bold">
                          {translations.pricingMostPopular}
                        </div>
                      </th>
                      <th className="text-center py-8 px-8 font-bold text-foreground text-xl">{translations.pricingEnterprise}</th>
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
                          <tr key={itemIndex} className="border-b border-[var(--border)]/30 hover:bg-surface-elevated/30 transition-colors">
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
        </section>

        {/* FAQ Section */}
        <section className="section relative">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                {translations.pricingFrequentlyAsked} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">{translations.pricingQuestions}</span>
              </h2>
              <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                {translations.pricingEverythingYouNeedToKnow}
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: translations.pricingCanChangePlanAnytime,
                  answer: translations.pricingCanChangePlanAnytimeAnswer
                },
                {
                  question: translations.pricingWhatHappensToVideos,
                  answer: translations.pricingWhatHappensToVideosAnswer
                },
                {
                  question: translations.pricingDoYouOfferRefunds,
                  answer: translations.pricingDoYouOfferRefundsAnswer
                },
                {
                  question: translations.pricingCanCancelSubscription,
                  answer: translations.pricingCanCancelSubscriptionAnswer
                },
                {
                  question: translations.pricingCustomEnterpriseSolutions,
                  answer: translations.pricingCustomEnterpriseSolutionsAnswer
                }
              ].map((faq, index) => (
                <div key={index} className="group glass-elevated rounded-3xl p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">{faq.question}</h3>
                  <p className="text-foreground-muted text-lg leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent-2/5 to-purple-500/5 rounded-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent" />
          
          <div className="container relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {translations.pricingGetStarted}
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white leading-tight">
                {translations.pricingReadyToCreate} <span className="text-gradient bg-gradient-to-r from-white via-accent-2 to-purple-300 bg-clip-text text-transparent">AI videos?</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
                {translations.pricingJoinThousands}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => handlePlanSelect('pro')}
                  className="group relative bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {translations.pricingStartFreeTrial}
                  </span>
                </button>
                <Link
                  href="/contact"
                  className="group bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {translations.pricingContactSales}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}