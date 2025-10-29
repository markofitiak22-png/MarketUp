"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

const countries = [
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" }
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ar", name: "العربية", flag: "🇦🇪" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" }
];

export default function OnboardingPage() {
  const { translations } = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [country, setCountry] = useState("");
  const [locale, setLocale] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Add onboarding page class but allow scrolling
    document.body.classList.add('onboarding-page');
    
    (async () => {
      const res = await fetch("/api/profile", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCountry(data.country || "");
        setLocale(data.locale || "");
      }
    })();

    // Cleanup: remove class when component unmounts
    return () => {
      document.body.classList.remove('onboarding-page');
    };
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country, locale }) });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/studio");
    } catch {
      setError(translations.onboardingError);
    } finally {
      setLoading(false);
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Welcome step
      case 2: return country !== ""; // Country selection
      case 3: return locale !== ""; // Language selection
      default: return false;
    }
  };

  return (
    <div className="onboarding-page min-h-screen bg-background relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        
        {/* Main Content */}
        <div>
          <section className="section-lg text-center">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Welcome */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                      <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                      <span className="text-gradient font-semibold text-base">{translations.onboardingWelcome}</span>
                      <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] mb-8">
                      {translations.onboardingGetStarted}
                    </h1>
                    
                    <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light mb-12">
                      {translations.onboardingSetupTime}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                      <div className="glass-elevated rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                          1
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{translations.onboardingPersonalize}</h3>
                        <p className="text-sm text-foreground-muted">{translations.onboardingPersonalizeDesc}</p>
                      </div>
                      <div className="glass-elevated rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                          2
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{translations.onboardingConfigure}</h3>
                        <p className="text-sm text-foreground-muted">{translations.onboardingConfigureDesc}</p>
                      </div>
                      <div className="glass-elevated rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                          3
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{translations.onboardingCreate}</h3>
                        <p className="text-sm text-foreground-muted">{translations.onboardingCreateDesc}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Country Selection */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                      <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                      <span className="text-gradient font-semibold text-base">{translations.onboardingStep} 1 {translations.onboardingOf} 3</span>
                      <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
                      {translations.onboardingWhereLocated}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed font-light mb-12">
                      {translations.onboardingLocationDesc}
                    </p>

                    <div className="max-w-3xl mx-auto">
                      <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {countries.map((countryItem) => (
                            <button
                              key={countryItem.name}
                              type="button"
                              onClick={() => setCountry(countryItem.name)}
                              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                                country === countryItem.name
                                  ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20 scale-105'
                                  : 'border-[var(--border)] hover:border-accent/50 hover:bg-accent/5 hover:scale-102'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3">
                                <span className="text-4xl">{countryItem.flag}</span>
                                <span className="font-medium text-foreground text-center">{countryItem.name}</span>
                              </div>
                              {country === countryItem.name && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                </div>
              </div>
                )}

                {/* Step 3: Language Selection */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                      <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                      <span className="text-gradient font-semibold text-base">{translations.onboardingStep} 2 {translations.onboardingOf} 3</span>
                      <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
                      {translations.onboardingWhatLanguage}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto leading-relaxed font-light mb-12">
                      {translations.onboardingLanguageDesc}
                    </p>

                    <div className="max-w-3xl mx-auto">
                      <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-3xl" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {languages.map((languageItem) => (
                            <button
                              key={languageItem.code}
                              type="button"
                              onClick={() => setLocale(languageItem.code)}
                              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                                locale === languageItem.code
                                  ? 'border-accent-2 bg-accent-2/10 shadow-lg shadow-accent-2/20 scale-105'
                                  : 'border-[var(--border)] hover:border-accent-2/50 hover:bg-accent-2/5 hover:scale-102'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3">
                                <span className="text-4xl">{languageItem.flag}</span>
                                <div className="text-center">
                                  <div className="font-medium text-foreground">{languageItem.name}</div>
                                  <div className="text-sm text-foreground-muted">{languageItem.code.toUpperCase()}</div>
                                </div>
                              </div>
                              {locale === languageItem.code && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="group btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:bg-accent/5 transition-all duration-300 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {translations.onboardingBack}
                    </button>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="group relative btn-primary btn-lg px-8 py-4 text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {translations.onboardingContinue}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href="/studio" 
                        className="group btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:bg-accent/5 transition-all duration-300 flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {translations.onboardingSkip}
                      </a>
                      <button 
                        onClick={save}
                        disabled={loading || !country || !locale}
                        className="group relative btn-primary btn-lg px-8 py-4 text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {loading ? (
                            <>
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {translations.onboardingSettingUp}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {translations.onboardingCompleteSetup}
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-8 max-w-md mx-auto p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}