"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="h-[70vh] flex items-center relative overflow-hidden w-full">
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
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-accent-2/30 to-purple-500/30 rounded-full blur-xl animate-pulse delay-500"></div>
        
        {/* Content overlaid on the background */}
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-10 pr-96">
              
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-4 px-10 py-5 glass-glow rounded-3xl border border-accent/30 text-sm group hover:scale-105 transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                <span className="text-gradient font-bold text-lg">About MarketUp</span>
                <div className="w-3 h-3 bg-accent-2 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300" />
              </div>
              
              {/* Enhanced Main heading */}
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
                  About <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent animate-pulse">MarketUp</span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-3xl leading-relaxed font-light">
                  Welcome to MarketUp, a European platform designed to help everyone — from small shop owners and cafés to large companies — promote their business <span className="text-accent font-semibold bg-gradient-to-r from-accent/20 to-accent-2/20 px-2 py-1 rounded-lg">easily and affordably.</span>
                </p>
              </div>
              
              {/* Enhanced Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start gap-10 pt-12">
                <div className="group flex items-center gap-3 text-sm text-foreground-muted hover:text-accent transition-colors duration-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-success to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">European platform</span>
                </div>
                <div className="group flex items-center gap-3 text-sm text-foreground-muted hover:text-accent-2 transition-colors duration-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">For everyone</span>
                </div>
                <div className="group flex items-center gap-3 text-sm text-foreground-muted hover:text-purple-500 transition-colors duration-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Easy & affordable</span>
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
            <div className="text-center mb-24">
              
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                Our <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">Mission</span> & Vision
              </h2>
              <p className="text-2xl md:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light">
                Driving innovation in marketing technology for <span className="text-accent font-medium">everyone</span>
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="group glass-elevated rounded-3xl p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-2/15 to-transparent rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-4xl font-bold text-foreground mb-6">
                      Our <span className="text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Mission</span>
                    </h3>
                    <p className="text-xl text-foreground-muted leading-relaxed">
                      Our mission is to empower individuals and businesses to promote their products or services without the need for expensive advertising agencies — just simple, smart, and effective marketing.
                    </p>
                  </div>
                </div>

                <div className="group glass-elevated rounded-3xl p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-2/20 group-hover:border-accent-2/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/15 to-transparent rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-4xl font-bold text-foreground mb-6">
                      Our <span className="text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent">Vision</span>
                    </h3>
                    <p className="text-xl text-foreground-muted leading-relaxed">
                      Our vision for the future is to expand MarketUp in new and innovative ways that make marketing even easier and more powerful for all users.
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
            <div className="max-w-5xl mx-auto">
              <div className="glass-elevated rounded-3xl p-16 text-center relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 border border-accent-2/10 hover:border-accent-2/30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-2/20 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-accent-2/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
                
                <div className="relative z-10">
                  
                  <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-10 leading-tight text-foreground">
                    What Makes Us <span className="text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent animate-pulse">Different</span>
                  </h2>
                  <p className="text-2xl md:text-3xl text-foreground leading-relaxed max-w-4xl mx-auto group-hover:text-foreground transition-colors duration-300">
                    What makes us different is our focus on <span className="text-accent-2 font-bold bg-gradient-to-r from-accent-2/20 to-purple-500/20 px-3 py-1 rounded-xl">simplicity, quality, and accessibility.</span>
                  </p>
                  
                  {/* Decorative floating elements */}
                  <div className="absolute top-8 right-8 w-6 h-6 bg-gradient-to-br from-accent-2/30 to-purple-500/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-8 w-4 h-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MarketUp Offers */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-24">
                
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                  What <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">MarketUp</span> Offers
                </h2>
                <p className="text-2xl md:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light">
                  Comprehensive solutions for all your <span className="text-accent font-medium">marketing needs</span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  {
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Smart AI-powered video creation",
                    description: "for marketing",
                    gradient: "from-accent to-accent-2"
                  },
                  {
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    ),
                    title: "Affordable pricing plans",
                    description: "suitable for all users",
                    gradient: "from-accent-2 to-purple-500"
                  },
                  {
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    ),
                    title: "Multilingual support team",
                    description: "English, Arabic, Swedish, and Turkish",
                    gradient: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Easy-to-use tools",
                    description: "that make video marketing faster, more creative, and within everyone's reach",
                    gradient: "from-pink-500 to-accent"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group glass-elevated rounded-3xl p-12 transition-all duration-700 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-accent/30 group-hover:border-accent/50 relative overflow-hidden border border-accent/10 hover:border-accent/30">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-accent/40 to-accent-2/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-accent-2/40 to-purple-500/40 rounded-full animate-pulse delay-500"></div>
                    
                    <div className="relative z-10">
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-accent transition-colors duration-300">{feature.title}</h3>
                      <p className="text-lg text-foreground-muted leading-relaxed group-hover:text-foreground transition-colors duration-300">{feature.description}</p>
                      
                      {/* Status indicator */}
                      <div className="flex items-center gap-2 mt-6">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-sm text-accent font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Support Statement */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-500/5" />
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-elevated rounded-3xl p-12 text-center">
               
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                  Our <span className="text-gradient bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Commitment</span>
                </h2>
                <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
                  We aim to provide continuous support, smarter tools, and creative solutions to deliver the best possible experience for every customer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="section relative">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-elevated rounded-3xl p-12 border border-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-3xl" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
                    &ldquo;MarketUp – where your ideas become marketing power&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slogans Section */}
        <section className=" relative">
          <div className="absolute bg-gradient-to-br from-background via-background to-accent/3" />
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
               
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Our <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">Slogans</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Slogan</h3>
                  <p className="text-lg text-foreground-muted leading-relaxed">
                    &ldquo;MarketUp – your business deserves to be seen&rdquo;
                  </p>
                </div>
                <div className="group glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent-2/20">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Tagline</h3>
                  <p className="text-lg text-foreground-muted leading-relaxed">
                    &ldquo;Your story, our technology – one vision for success&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section">
          <div className="container">
            <div className="text-center">
              
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
                Ready to transform your <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">marketing?</span>
              </h2>
              <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-16 leading-relaxed font-light">
                Join thousands of businesses who are already using MarketUp to create professional marketing videos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link
                  href="/onboarding"
                  className="group relative bg-gradient-to-r from-accent to-accent-2 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:shadow-2xl hover:shadow-accent/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-accent/20 hover:border-accent/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="flex items-center gap-4 relative z-10">
                    <svg className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </span>
                </Link>
                <Link
                  href="/pricing"
                  className="group bg-surface-elevated border border-accent/20 text-foreground px-12 py-6 rounded-3xl font-bold text-xl hover:bg-accent/10 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                >
                  <span className="flex items-center gap-4">
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    See Pricing
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
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