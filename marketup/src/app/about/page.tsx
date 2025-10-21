"use client";
import Link from "next/link";

export default function AboutPage() {
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
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                <span className="text-gradient font-semibold text-base">About MarketUp</span>
                <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
              </div>
              
              <div className="space-y-8 mb-16">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                  About <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">MarketUp</span>
                </h1>
                
                <p className="text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light">
                  Welcome to MarketUp, a European platform designed to help everyone — from small shop owners and cafés to large companies — promote their business easily and affordably.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="section relative">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Our Purpose
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Our <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">Mission</span> & Vision
                </h2>
                <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                  Driving innovation in marketing technology for everyone
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="group glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Our <span className="text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">Mission</span>
                  </h3>
                  <p className="text-lg text-foreground-muted leading-relaxed">
                    Our mission is to empower individuals and businesses to promote their products or services without the need for expensive advertising agencies — just simple, smart, and effective marketing.
                  </p>
                </div>

                <div className="group glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent-2/20">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-accent-2/25 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Our <span className="text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent">Vision</span>
                  </h3>
                  <p className="text-lg text-foreground-muted leading-relaxed">
                    Our vision for the future is to expand MarketUp in new and innovative ways that make marketing even easier and more powerful for all users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/3" />
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-elevated rounded-3xl p-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-2/10 border border-accent-2/20 text-accent-2 text-sm font-medium mb-8 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What Sets Us Apart
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                  What Makes Us <span className="text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent">Different</span>
                </h2>
                <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
                  What makes us different is our focus on simplicity, quality, and accessibility.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MarketUp Offers */}
        <section className="section relative">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Our Solutions
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  What <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">MarketUp</span> Offers
                </h2>
                <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                  Comprehensive solutions for all your marketing needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Smart AI-powered video creation",
                    description: "for marketing"
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    ),
                    title: "Affordable pricing plans",
                    description: "suitable for all users"
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    ),
                    title: "Multilingual support team",
                    description: "English, Arabic, Swedish, and Turkish"
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Easy-to-use tools",
                    description: "that make video marketing faster, more creative, and within everyone's reach"
                  }
                ].map((feature, index) => (
                  <div key={index} className="group glass-elevated rounded-3xl p-8 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white mb-6 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-foreground-muted leading-relaxed">{feature.description}</p>
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
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-sm font-medium mb-8 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Our Promise
                </div>
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
                    "MarketUp – where your ideas become marketing power"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slogans Section */}
        <section className="section relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/3" />
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8 backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Our Message
                </div>
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
                    "MarketUp – your business deserves to be seen"
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
                    "Your story, our technology – one vision for success"
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
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
                Ready to transform your <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">marketing?</span>
              </h2>
              <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-16 leading-relaxed font-light">
                Join thousands of businesses who are already using MarketUp to create professional marketing videos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/onboarding"
                  className="group relative bg-gradient-to-r from-accent to-accent-2 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/25 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started
                  </span>
                </Link>
                <Link
                  href="/pricing"
                  className="group bg-surface-elevated border border-[var(--border)] text-foreground px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-accent/5 hover:border-accent/50 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    See Pricing
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