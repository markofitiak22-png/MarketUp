"use client";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function ContactPage() {
  const { translations } = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!name.trim() || !email.trim() || !message.trim()) return translations.contactFillAllFields;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return translations.contactValidEmail;
    if (message.trim().length < 10) return translations.contactMessageLength;
    return null;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setStatus(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message }) });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[50vh] sm:min-h-[60vh] flex items-center relative overflow-hidden w-full max-w-full">
        {/* Full-width background image */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent-2/6 to-accent/8" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
        
        {/* Content overlaid on the background */}
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6 sm:space-y-8 lg:pr-96 max-w-full">
              
              {/* Main heading */}
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95]">
                  We&apos;d love to <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">{translations.contactHearFromYou}</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-2xl leading-relaxed font-light">
                  {translations.contactQuestionsPartnerships} <span className="text-accent font-medium">{translations.contactResponseTime}</span>
                </p>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 pt-6 sm:pt-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground-muted">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.contact24hResponse}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground-muted">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.contactExpertSupport}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground-muted">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{translations.contactNoSpam}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">

        {/* Contact Form Section */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
                {translations.contactGetInTouch}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light px-4">
                {translations.contactSendMessage}
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                {/* Left Column - Form + Additional Info */}
                <div className="space-y-8">
                  {/* Form */}
                  <div>
                    {status === "success" ? (
                      <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-success/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-success/10 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                        
                        <div className="relative z-10">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-success to-green-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">{translations.contactThanksMessage}</h2>
                          <p className="text-base sm:text-lg lg:text-xl text-foreground-muted mb-6 sm:mb-8">{translations.contactResponseTimeDesc}</p>
                          <button 
                            onClick={() => setStatus(null)} 
                            className="group relative btn-outline btn-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                          >
                            <span className="flex items-center gap-2 sm:gap-3">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              {translations.contactSendAnother}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-2/10 to-transparent rounded-tr-3xl" />
                        
                        <div className="relative z-10">
                          <form className="space-y-4 sm:space-y-6" onSubmit={submit} noValidate>
                            <div className="space-y-3 sm:space-y-4">
                              <label className="text-sm sm:text-base font-medium text-foreground">{translations.contactName}</label>
                              <input 
                                id="name" 
                                placeholder={translations.contactNamePlaceholder} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>
                            
                            <div className="space-y-3 sm:space-y-4">
                              <label className="text-sm sm:text-base font-medium text-foreground">{translations.contactEmail}</label>
                              <input 
                                id="email" 
                                type="email" 
                                placeholder={translations.contactEmailPlaceholder} 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200 text-sm sm:text-base"
                              />
                            </div>
                            
                            <div className="space-y-3 sm:space-y-4">
                              <label className="text-sm sm:text-base font-medium text-foreground">{translations.contactMessage}</label>
                              <textarea 
                                id="message" 
                                rows={4} 
                                placeholder={translations.contactMessagePlaceholder} 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                required 
                                className="w-full p-3 sm:p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200 resize-none text-sm sm:text-base"
                              />
                              <p className="text-xs sm:text-sm text-foreground-muted">{translations.contactNoBotsSpam}</p>
                            </div>
                            
                            {error && (
                              <div className="p-3 sm:p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs sm:text-sm">
                                {error}
                              </div>
                            )}
                            
                            {status === "error" && (
                              <div className="p-3 sm:p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs sm:text-sm">
                                {translations.contactSomethingWrong}
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                              <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 btn-primary px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loading ? translations.contactSending : translations.contactSendMessage}
                              </button>
                              <button 
                                type="button" 
                                onClick={() => { setName(""); setEmail(""); setMessage(""); }}
                                className="btn-outline px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold"
                              >
                                {translations.contactClear}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Contact Info - Under the form */}
                  <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-pink-500/15 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                    
                    <div className="relative z-10">
                      <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">{translations.contactOtherWays}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm sm:text-base">{translations.contactBusinessHours}</p>
                            <p className="text-xs sm:text-sm text-foreground-muted">{translations.contactBusinessHoursDesc}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm sm:text-base">{translations.contactResponseTimeLabel}</p>
                            <p className="text-xs sm:text-sm text-foreground-muted">{translations.contactResponseTimeValue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Methods */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Email Contact - Primary */}
                  <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">{translations.contactEmailSupport}</h3>
                          <p className="text-base sm:text-lg lg:text-xl text-foreground-muted">{translations.contactGetHelpEmail}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm text-success font-medium">{translations.contactOnlineNow}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-base sm:text-lg lg:text-xl text-foreground-muted mb-6 sm:mb-10 leading-relaxed">
                        {translations.contactEmailDescription}
                      </p>
                      <div className="space-y-3 sm:space-y-4">
                        <a 
                          href="mailto:support@marketup.app" 
                          className="group relative btn-primary btn-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-sm sm:text-base lg:text-lg font-bold overflow-hidden block text-center"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">{translations.contactEmailButton}</span>
                            <span className="sm:hidden">{translations.contactEmailSupportMobile}</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-foreground-muted">
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{translations.contact24hResponseLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{translations.contactExpertSupportLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp - Coming Soon */}
                  <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-green-500/20 group-hover:border-green-500/40 relative overflow-hidden opacity-60">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-green-600/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                          </svg>
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">{translations.contactWhatsAppSupport}</h3>
                          <p className="text-base sm:text-lg lg:text-xl text-foreground-muted">{translations.contactComingSoon}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-xs sm:text-sm text-yellow-500 font-medium">{translations.contactInDevelopment}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-base sm:text-lg lg:text-xl text-foreground-muted mb-6 sm:mb-10 leading-relaxed">
                        {translations.contactWhatsAppDescription}
                      </p>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="btn-outline w-full justify-center py-4 sm:py-5 text-sm sm:text-base lg:text-lg font-bold cursor-not-allowed">
                          <span className="flex items-center justify-center gap-2 sm:gap-3">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                            </svg>
                            <span className="hidden sm:inline">{translations.contactWhatsAppButton}</span>
                            <span className="sm:hidden">{translations.contactWhatsAppMobile}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-foreground-muted">
                          <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{translations.contactInstantChat}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section relative overflow-hidden">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
                {translations.contactFrequentlyAsked} <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">{translations.contactQuestions}</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground-muted max-w-4xl mx-auto leading-relaxed font-light px-4">
                {translations.contactQuickAnswers} <span className="text-accent font-medium">{translations.contactAIVideoPlatform}</span>
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {/* FAQ Items */}
                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{translations.contactHowLong}</h3>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-foreground-muted leading-relaxed">
                      {translations.contactHowLongDesc}
                    </p>
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactUnder5Minutes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactHDQuality}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent-2/20 group-hover:border-accent-2/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent-2/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{translations.contactVideoQuality}</h3>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-foreground-muted leading-relaxed">
                      {translations.contactVideoQualityDesc}
                    </p>
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contact1080pHD}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactMultipleFormats}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:border-purple-500/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{translations.contactCustomVoice}</h3>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-foreground-muted leading-relaxed">
                      {translations.contactCustomVoiceDesc}
                    </p>
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-500">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactComingSoonLabel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactAIVoicesNow}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:border-accent/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-2xl sm:rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{translations.contactCommercialUse}</h3>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-foreground-muted leading-relaxed">
                      {translations.contactCommercialUseDesc}
                    </p>
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactCommercialRights}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-success">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{translations.contactNoExtraFees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}