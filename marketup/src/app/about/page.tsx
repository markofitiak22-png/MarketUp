"use client";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function AboutPage() {
  const { translations } = useTranslations();
  
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[60vh] sm:min-h-[70vh] flex items-center relative overflow-hidden w-full max-w-full">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-2/8 to-purple-500/6" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        
        {/* Floating animated elements */}
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-16 left-16 sm:bottom-32 sm:left-32 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-2/30 to-purple-500/30 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Content overlaid on the background */}
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 lg:pr-96 max-w-full">
              
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-4 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 glass-glow rounded-2xl sm:rounded-3xl border border-accent/30 text-xs sm:text-sm group hover:scale-105 transition-all duration-300">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                <span className="text-gradient font-bold text-sm sm:text-base lg:text-lg">{translations.aboutTitle}</span>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-accent-2 rounded-full animate-ping" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse delay-300" />
              </div>
              
              {/* Enhanced Main heading */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9]">
                  {translations.aboutTitle} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent animate-pulse">MarketUp</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground-muted max-w-3xl leading-relaxed font-light">
                  {translations.aboutWelcome}
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground-muted max-w-3xl leading-relaxed font-light mt-4">
                  {translations.aboutEasilyAffordably}
                </p>
              </div>
              
              {/* Enhanced Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 lg:gap-10 pt-6 sm:pt-8 lg:pt-12">
                <div className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground-muted hover:text-accent transition-colors duration-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-success to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{translations.aboutEuropeanPlatform}</span>
                </div>
                <div className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground-muted hover:text-accent-2 transition-colors duration-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{translations.aboutForEveryone}</span>
                </div>
                <div className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground-muted hover:text-purple-500 transition-colors duration-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{translations.aboutEasyAffordable}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">

        {/* Mission & Vision Section */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-24 px-4">
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                {translations.aboutOurMissionVision}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light">
                {translations.aboutDrivingInnovation} <span className="text-accent font-medium">{translations.aboutEveryone}</span>
              </p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-accent-2/15 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                      {translations.aboutOurMission}
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-foreground-muted leading-relaxed">
                      {translations.aboutMissionText}
                    </p>
                  </div>
                </div>

                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-2/20 group-hover:border-accent-2/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-500/15 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                      {translations.aboutOurVision}
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-foreground-muted leading-relaxed">
                      {translations.aboutVisionText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent-2/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-500/15 to-purple-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-accent-2/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <div className="max-w-5xl mx-auto px-4">
              <div className="glass-elevated rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 border border-accent-2/10 hover:border-accent-2/30">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-accent-2/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-2/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                
                <div className="relative z-10">
                  
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 lg:mb-10 leading-tight text-foreground">
                    {translations.aboutWhatMakesDifferent}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed max-w-4xl mx-auto group-hover:text-foreground transition-colors duration-300">
                    {translations.aboutDrivingInnovation} {translations.aboutEveryone}
                  </p>
                  
                  {/* Decorative floating elements */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-accent-2/30 to-purple-500/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MarketUp Offers */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse overflow-hidden"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000 overflow-hidden"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500 overflow-hidden"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-700 overflow-hidden"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-300 overflow-hidden"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16 sm:mb-20 lg:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
                {translations.aboutWhatMarketUpOffers}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light px-4">
                {translations.aboutComprehensiveSolutions}
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="glass-elevated rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                
                <div className="relative z-10">
                  <ul className="space-y-6 sm:space-y-8 text-left">
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed">
                        {translations.aboutSmartAIVideo}
                      </p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed">
                        {translations.aboutAffordablePricing}
                      </p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed">
                        {translations.aboutMultilingualSupport}
                      </p>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed">
                        {translations.aboutEasyToUse}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Support Statement */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-500/5" />
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="glass-elevated rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-center">
               
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-foreground">
                  {translations.aboutOurCommitment}
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
                  {translations.aboutCommitmentText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="section relative">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-surface-elevated border border-accent/30 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl shadow-accent/10">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-relaxed">
                    {translations.aboutQuote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slogans Section */}
        <section className=" relative">
          <div className="absolute bg-gradient-to-br from-background via-background to-accent/3" />
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
               
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                  {translations.aboutOurSlogans}
                </h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="group bg-surface-elevated border border-accent/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-4 sm:mb-6">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">{translations.aboutSlogan}</h3>
                  <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
                    {translations.aboutSloganText}
                  </p>
                </div>
                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent-2/20">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center mb-4 sm:mb-6">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">{translations.aboutTagline}</h3>
                  <p className="text-base sm:text-lg text-foreground-muted leading-relaxed">
                    {translations.aboutTaglineText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container px-4">
            <div className="text-center">
              
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 sm:mb-8 text-foreground leading-tight">
                {translations.aboutReadyToTransform} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">{translations.aboutMarketing}</span>?
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed font-light">
                {translations.aboutJoinThousands}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
                <Link
                  href="/onboarding"
                  className="group relative bg-gradient-to-r from-accent to-accent-2 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg lg:text-xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-accent/20 hover:border-accent/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="flex items-center gap-3 sm:gap-4 relative z-10">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {translations.aboutGetStarted}
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  </span>
                </Link>
                <Link
                  href="/pricing"
                  className="group bg-surface-elevated border border-accent/20 text-foreground px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg lg:text-xl hover:bg-accent/10 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                >
                  <span className="flex items-center gap-3 sm:gap-4">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {translations.aboutSeePricing}
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse"></div>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}