"use client";
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect, useRef, useState } from "react";

interface HomeClientProps {
  session: any;
}

export default function HomeClient({ session }: HomeClientProps) {
  const { translations } = useTranslations();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const setupObservers = () => {
      const sectionKeys = ["how-it-works", "preview", "pricing"];
      
      sectionKeys.forEach((key) => {
        const element = sectionRefs.current[key];
        if (!element) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleSections((prev) => new Set(prev).add(key));
              } else {
                setVisibleSections((prev) => {
                  const next = new Set(prev);
                  next.delete(key);
                  return next;
                });
              }
            });
          },
          {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px",
          }
        );

        observer.observe(element);
        observers.push(observer);
      });
    };

    const timeoutId = setTimeout(setupObservers, 200);

    return () => {
      clearTimeout(timeoutId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const setSectionRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative">
      {/* Shared background blobs for all sections */}
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
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden w-full z-10">
        {/* Background image - KEEPING AS IS */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/95 via-[#0b0b0b]/85 to-transparent z-0" />
        
        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-20 max-w-7xl mx-auto py-20">
          <div className="max-w-3xl space-y-8">
              {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {translations.heroTitle}
                </span>
                </h1>
                
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed animate-fade-in-up">
                  {translations.heroSubtitle}
                </p>
              </div>
              
              {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                <a 
                  href="/studio" 
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden animate-glow-pulse"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {translations.getStarted}
                    </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  </a>
                ) : (
                <a 
                  href="/auth" 
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden animate-glow-pulse"
                >
                    <span className="relative z-10 flex items-center gap-3">
                    <svg className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {translations.getStarted}
                    </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  </a>
                )}
              <a 
                href="/pricing" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10 transition-all duration-300 overflow-hidden"
              >
                <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {translations.seePricing}
                </a>
              </div>

              {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.noCreditCard}</span>
                </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.fiveMinuteSetup}</span>
                </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.hdQuality}</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                10K+
              </div>
              <div className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Active Users
              </div>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Videos Created
              </div>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                99%
              </div>
              <div className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Satisfaction
              </div>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-pink-500/50 hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors duration-300">
                Support
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* How it works Section */}
        <section 
          ref={setSectionRef("how-it-works")}
        className={`py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 transition-all duration-1000 ${
            visibleSections.has("how-it-works")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has("how-it-works")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              {translations.howItWorks}
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {translations.howItWorksSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Step 01 */}
              <div className={`group transition-all duration-700 delay-100 ${
                visibleSections.has("how-it-works")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}>
              <div className="relative h-full p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/30 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-tr-2xl group-hover:from-indigo-500/15 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/8 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-indigo-500/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <span className="relative z-10">01</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent group-hover:from-indigo-500/80 group-hover:h-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-300">{translations.step1Title}</h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {translations.step1Description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 02 */}
              <div className={`group transition-all duration-700 delay-200 ${
                visibleSections.has("how-it-works")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}>
              <div className="relative h-full p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-2xl group-hover:from-purple-500/30 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-tr-2xl group-hover:from-purple-500/15 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/8 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-purple-500/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <span className="relative z-10">02</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent group-hover:from-purple-500/80 group-hover:h-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300">{translations.step2Title}</h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {translations.step2Description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 03 */}
              <div className={`group transition-all duration-700 delay-300 ${
                visibleSections.has("how-it-works")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}>
              <div className="relative h-full p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 hover:bg-gradient-to-br hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/30 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-tr-2xl group-hover:from-indigo-500/15 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/8 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-indigo-500/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <span className="relative z-10">03</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent group-hover:from-indigo-500/80 group-hover:h-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-300">{translations.step3Title}</h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {translations.step3Description}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 04 */}
              <div className={`group transition-all duration-700 delay-400 ${
                visibleSections.has("how-it-works")
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}>
              <div className="relative h-full p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-2xl group-hover:from-purple-500/30 group-hover:w-40 group-hover:h-40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-tr-2xl group-hover:from-purple-500/15 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/8 group-hover:to-transparent transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 group-hover:shadow-purple-500/70 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      <span className="relative z-10">04</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent group-hover:from-purple-500/80 group-hover:h-0.5 transition-all duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300">{translations.step4Title}</h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {translations.step4Description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section 
        ref={setSectionRef("preview")}
        className={`py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 transition-all duration-1000 ${
          visibleSections.has("preview")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has("preview")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              {translations.seeItInAction}
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {translations.previewSubtitle}
            </p>
          </div>
          
          <div className={`transition-all duration-700 delay-200 ${
              visibleSections.has("preview")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}>
            <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/15 group-hover:w-44 group-hover:h-44 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-2xl group-hover:from-purple-500/15 group-hover:w-36 group-hover:h-36 transition-all duration-500" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-500/5 to-transparent rounded-full blur-3xl group-hover:from-pink-500/7 group-hover:w-72 group-hover:h-72 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/4 group-hover:via-purple-500/4 group-hover:to-pink-500/4 transition-all duration-500" />
                
                <div className="relative z-10">
                {/* Video Preview */}
                <div className="bg-black rounded-xl aspect-video relative overflow-hidden mb-8 group/video border border-slate-700/50 hover:border-indigo-500/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-black flex items-center justify-center">
                    <div className="text-center text-white relative z-10">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center group-hover/video:scale-105 group-hover/video:shadow-lg group-hover/video:shadow-indigo-500/30 transition-all duration-300">
                        <svg className="w-10 h-10 text-indigo-400 group-hover/video:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                      <h3 className="text-lg font-bold mb-1 group-hover/video:text-indigo-200 transition-colors duration-300">AI Avatar Video</h3>
                      <p className="text-sm opacity-75 group-hover/video:opacity-90 transition-opacity duration-300">Premium Quality Demo</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover/video:from-indigo-500/5 group-hover/video:to-purple-500/5 transition-all duration-500" />
                  </div>
                  </div>
                  
                  {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`group/feature relative text-center p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/35 hover:bg-gradient-to-br hover:from-indigo-500/15 hover:to-indigo-500/8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20 delay-300 overflow-hidden ${
                      visibleSections.has("preview")
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-xl group-hover/feature:from-indigo-500/15 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover/feature:scale-105 group-hover/feature:shadow-lg group-hover/feature:shadow-indigo-500/40 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl opacity-0 group-hover/feature:opacity-50 transition-opacity duration-300 blur-sm" />
                        <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover/feature:text-indigo-200 transition-colors duration-300">{translations.lightningFast}</h4>
                      <p className="text-sm text-white/70 group-hover/feature:text-white/80 transition-colors duration-300">{translations.lightningFastDesc}</p>
                    </div>
                    </div>
                    
                  <div className={`group/feature relative text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/35 hover:bg-gradient-to-br hover:from-purple-500/15 hover:to-purple-500/8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 delay-400 overflow-hidden ${
                    visibleSections.has("preview")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                    }`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-xl group-hover/feature:from-purple-500/15 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover/feature:scale-105 group-hover/feature:shadow-lg group-hover/feature:shadow-purple-500/40 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-0 group-hover/feature:opacity-50 transition-opacity duration-300 blur-sm" />
                        <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover/feature:text-purple-200 transition-colors duration-300">{translations.hdQualityTitle}</h4>
                      <p className="text-sm text-white/70 group-hover/feature:text-white/80 transition-colors duration-300">{translations.hdQualityDesc}</p>
                    </div>
                    </div>
                    
                  <div className={`group/feature relative text-center p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/35 hover:bg-gradient-to-br hover:from-pink-500/15 hover:to-pink-500/8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/20 delay-500 overflow-hidden ${
                    visibleSections.has("preview")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                    }`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-xl group-hover/feature:from-pink-500/15 transition-all duration-300" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover/feature:scale-105 group-hover/feature:shadow-lg group-hover/feature:shadow-pink-500/40 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl opacity-0 group-hover/feature:opacity-50 transition-opacity duration-300 blur-sm" />
                        <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover/feature:text-pink-200 transition-colors duration-300">{translations.autoPublishing}</h4>
                      <p className="text-sm text-white/70 group-hover/feature:text-white/80 transition-colors duration-300">{translations.autoPublishingDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section 
        ref={setSectionRef("pricing")}
        className={`py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 transition-all duration-1000 ${
          visibleSections.has("pricing")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 delay-100 ${
            visibleSections.has("pricing")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              {translations.simplePricing}
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              {translations.pricingSubtitle}
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-200 ${
            visibleSections.has("pricing")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <a 
              href="/pricing" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-2xl hover:shadow-white/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {translations.seePricingButton}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            {session ? (
              <a 
                href="/studio" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {translations.startNow}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
              </a>
            ) : (
              <a 
                href="/auth" 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {translations.startNow}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
              </a>
            )}
          </div>
        </div>
      </section>
      </div>
  );
}
