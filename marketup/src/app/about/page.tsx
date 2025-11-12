"use client";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default function AboutPage() {
  const { translations } = useTranslations();
  
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
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/95 via-[#0b0b0b]/90 to-[#0b0b0b]/70 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0b0b]/50 z-0" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000 z-0" />
        
        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-20 max-w-7xl mx-auto py-20">
          <div className="max-w-3xl space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>{translations.aboutTitle}</span>
              </div>
              
            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  {translations.aboutTitle}
                </span>
                <span className="block mt-2 text-white">
                  MarketUp
                </span>
                </h1>
                
              <div className="space-y-4 pt-4">
                <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-2xl leading-relaxed font-light">
                  {translations.aboutWelcome}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl text-white/75 max-w-2xl leading-relaxed">
                  {translations.aboutEasilyAffordably}
                </p>
              </div>
              </div>
              
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              {[
                { text: translations.aboutEuropeanPlatform, icon: "✓" },
                { text: translations.aboutForEveryone, icon: "✓" },
                { text: translations.aboutEasyAffordable, icon: "✓" }
              ].map((item, idx) => (
                <div key={idx} className="group flex items-center gap-3 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-green-500/20">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Mission & Vision Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white">
                {translations.aboutOurMissionVision}
              </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {translations.aboutDrivingInnovation} <span className="text-indigo-400 font-semibold">{translations.aboutEveryone}</span>
              </p>
            </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
              {/* Mission Card */}
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative h-full p-10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:border-indigo-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-transparent rounded-bl-[3rem] group-hover:from-indigo-500/30 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-tr-[3rem]" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/80 to-indigo-500/80 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-indigo-500/20">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 group-hover:text-indigo-300 transition-colors duration-300">
                      {translations.aboutOurMission}
                    </h3>
                    <p className="text-white/75 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">
                      {translations.aboutMissionText}
                    </p>
                  </div>
                  </div>
                </div>

              {/* Vision Card */}
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative h-full p-10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent rounded-bl-[3rem] group-hover:from-purple-500/30 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-[3rem]" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/80 to-purple-500/80 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-purple-500/20">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 group-hover:text-purple-300 transition-colors duration-300">
                      {translations.aboutOurVision}
                    </h3>
                    <p className="text-white/75 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">
                      {translations.aboutVisionText}
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full">
              <span className="text-sm font-semibold text-indigo-300">Our Difference</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
              {translations.aboutWhatMakesDifferent}
            </h2>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            
            <div className="relative p-12 bg-gradient-to-br from-slate-800/70 via-slate-800/60 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm border border-indigo-500/30 mb-8">
                  <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl text-white/90 leading-relaxed max-w-4xl mx-auto font-light">
                  {translations.aboutDrivingInnovation} <span className="font-semibold text-indigo-300">{translations.aboutEveryone}</span>
                </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MarketUp Offers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white">
                {translations.aboutWhatMarketUpOffers}
              </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {translations.aboutComprehensiveSolutions}
              </p>
            </div>
            
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 rounded-3xl blur opacity-50" />
              
              <div className="relative p-10 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:20px_20px]" />
                </div>
                
                <div className="relative z-10">
                  <ul className="space-y-8">
                    {[
                      { text: translations.aboutSmartAIVideo, color: "indigo" },
                      { text: translations.aboutAffordablePricing, color: "purple" },
                      { text: translations.aboutMultilingualSupport, color: "pink" },
                      { text: translations.aboutEasyToUse, color: "indigo" }
                    ].map((item, idx) => {
                      const colorClasses = {
                        indigo: "from-indigo-600 to-indigo-500 shadow-indigo-500/30",
                        purple: "from-purple-600 to-purple-500 shadow-purple-500/30",
                        pink: "from-pink-600 to-pink-500 shadow-pink-500/30"
                      };
                      
                      return (
                        <li key={idx} className="group flex items-start gap-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300">
                          <div className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[item.color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                            <div className="relative z-10 w-3 h-3 bg-white rounded-full shadow-lg" />
                      </div>
                          
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent group-hover:from-white/40 transition-colors" />
                              <span className="text-xs font-semibold text-white/50">0{idx + 1}</span>
                      </div>
                            <p className="text-xl sm:text-2xl text-white leading-relaxed group-hover:text-white/95 transition-colors">
                              {item.text}
                      </p>
                      </div>
                    </li>
                      );
                    })}
                  </ul>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Combined: Commitment, Quote & Slogans */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          {/* Commitment */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              
              <div className="relative p-12 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,.05)_25px,rgba(255,255,255,.05)_26px,transparent_27px,transparent_74px,rgba(255,255,255,.05)_75px,rgba(255,255,255,.05)_76px,transparent_77px)] bg-[length:100px_100px]" />
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-sm border border-indigo-500/30 mb-8 shadow-xl shadow-indigo-500/10">
                    <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                  {translations.aboutOurCommitment}
                </h2>
                  <p className="text-lg sm:text-xl text-white/75 leading-relaxed max-w-3xl mx-auto">
                  {translations.aboutCommitmentText}
                </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -top-8 -left-8 w-32 h-32 text-indigo-500/10 text-[120px] font-serif leading-none select-none">"</div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 text-purple-500/10 text-[120px] font-serif leading-none select-none rotate-180">"</div>
              
              <div className="relative p-12 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/50 to-purple-600/50 backdrop-blur-sm border border-indigo-500/30 mb-8 shadow-lg">
                    <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed mb-6 italic">
                    {translations.aboutQuote}
                  </blockquote>
                  
                  <div className="inline-flex items-center gap-3 mt-8">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slogans */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full">
                <span className="text-sm font-semibold text-indigo-300">Our Values</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white">
                  {translations.aboutOurSlogans}
                </h2>
              </div>
              
            <div className="grid sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative p-10 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl hover:border-indigo-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-[2rem]" />
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{translations.aboutSlogan}</h3>
                  <p className="text-lg text-white/75 leading-relaxed group-hover:text-white/90 transition-colors">
                    {translations.aboutSloganText}
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative p-10 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-[2rem]" />
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center mb-6 shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{translations.aboutTagline}</h3>
                  <p className="text-lg text-white/75 leading-relaxed group-hover:text-white/90 transition-colors">
                    {translations.aboutTaglineText}
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-indigo-300">Ready to Start?</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight">
              {translations.aboutReadyToTransform}{" "}
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {translations.aboutMarketing}?
              </span>
              </h2>
            <p className="text-xl md:text-2xl text-white/75 max-w-3xl mx-auto mb-12 leading-relaxed">
                {translations.aboutJoinThousands}
              </p>
              
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/studio"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.05] transition-all duration-300 overflow-hidden text-lg"
                >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {translations.aboutGetStarted}
                  </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </Link>
              
                <Link
                  href="/pricing"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/40 hover:scale-[1.05] hover:shadow-xl hover:shadow-white/10 transition-all duration-300 overflow-hidden text-lg"
                >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {translations.aboutSeePricing}
                  </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>

      {/* Reviews Section - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Enhanced header with decorative elements */}
          <div className="text-center mb-20 relative">
            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
              {/* Badge with enhanced design */}
              <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/10">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-indigo-300">Testimonials</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300" />
                </div>
                
              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500/50" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-purple-500/50 to-purple-500/50" />
              </div>
              
              {/* Main heading */}
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
                What Our Users Say
              </h2>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Real feedback from real users who transformed their marketing with MarketUp
              </p>
            </div>
          </div>
          
          {/* Reviews content with enhanced container */}
          <div className="relative">
            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-2xl opacity-50 pointer-events-none" />
            
            {/* Content wrapper */}
            <div className="relative z-10">
              <ReviewsSection />
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}
