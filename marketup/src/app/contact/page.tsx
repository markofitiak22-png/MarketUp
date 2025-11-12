"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function ContactPage() {
  const { translations } = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const setupObservers = () => {
      const sectionKeys = ["contact-form", "faq"];
      
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
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b]/95 via-[#0b0b0b]/85 to-transparent z-0" />
        
        {/* Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-20 max-w-7xl mx-auto py-20">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  We&apos;d love to {translations.contactHearFromYou}
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed animate-fade-in-up">
                {translations.contactQuestionsPartnerships} <span className="text-indigo-400 font-medium">{translations.contactResponseTime}</span>
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="group flex items-center gap-3 px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-lg hover:bg-slate-800/80 hover:border-slate-600/60 transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">{translations.contact24hResponse}</span>
              </div>
              <div className="group flex items-center gap-3 px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-lg hover:bg-slate-800/80 hover:border-slate-600/60 transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">{translations.contactExpertSupport}</span>
              </div>
              <div className="group flex items-center gap-3 px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-lg hover:bg-slate-800/80 hover:border-slate-600/60 transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">{translations.contactNoSpam}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section 
        ref={setSectionRef("contact-form")}
        className={`py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 transition-all duration-1000 ${
          visibleSections.has("contact-form")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has("contact-form")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              {translations.contactGetInTouch}
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {translations.contactSendMessage}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Left Column - Form */}
            <div className={`space-y-6 transition-all duration-700 delay-100 ${
              visibleSections.has("contact-form")
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}>
              {status === "success" ? (
                <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-2xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-green-500/10 to-transparent rounded-tr-2xl" />
                  
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{translations.contactThanksMessage}</h3>
                    <p className="text-lg text-white/70 mb-8">{translations.contactResponseTimeDesc}</p>
                    <button 
                      onClick={() => setStatus(null)} 
                      className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] transition-all duration-300"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {translations.contactSendAnother}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-2xl" />
                  
                  <div className="relative z-10">
                    <form className="space-y-6" onSubmit={submit} noValidate>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          {translations.contactName}
                        </label>
                        <input 
                          id="name" 
                          placeholder={translations.contactNamePlaceholder} 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          required 
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-slate-800/50 text-white placeholder-white/40 focus:outline-none ${
                            error && !name.trim()
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                              : 'border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          {translations.contactEmail}
                        </label>
                        <input 
                          id="email" 
                          type="email" 
                          placeholder={translations.contactEmailPlaceholder} 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-slate-800/50 text-white placeholder-white/40 focus:outline-none ${
                            error && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                              : 'border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          {translations.contactMessage}
                        </label>
                        <textarea 
                          id="message" 
                          rows={6} 
                          placeholder={translations.contactMessagePlaceholder} 
                          value={message} 
                          onChange={(e) => setMessage(e.target.value)}
                          required 
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-slate-800/50 text-white placeholder-white/40 focus:outline-none resize-none ${
                            error && (!message.trim() || message.trim().length < 10)
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                              : 'border-slate-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          }`}
                        />
                        <p className="text-xs text-white/50 mt-2">{translations.contactNoBotsSpam}</p>
                      </div>
                      
                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          {error}
                        </div>
                      )}
                      
                      {status === "error" && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          {translations.contactSomethingWrong}
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <button 
                          type="submit" 
                          disabled={loading}
                          className="group relative flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-glow-pulse"
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            {loading ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                            {loading ? translations.contactSending : translations.contactSendMessage}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setName(""); setEmail(""); setMessage(""); setError(null); }}
                          className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                        >
                          {translations.contactClear}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Additional Contact Info */}
              <div className="relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-2xl" />
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-6">{translations.contactOtherWays}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{translations.contactBusinessHours}</p>
                        <p className="text-xs text-white/60">{translations.contactBusinessHoursDesc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{translations.contactResponseTimeLabel}</p>
                        <p className="text-xs text-white/60">{translations.contactResponseTimeValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Methods */}
            <div className={`space-y-6 transition-all duration-700 delay-200 ${
              visibleSections.has("contact-form")
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}>
              {/* Email Contact */}
              <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-2xl group-hover:from-purple-500/20 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{translations.contactEmailSupport}</h3>
                      <p className="text-white/70 mb-3">{translations.contactGetHelpEmail}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">{translations.contactOnlineNow}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {translations.contactEmailDescription}
                  </p>
                  <a 
                    href="mailto:support@marketup.app" 
                    className="group/btn relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden animate-glow-pulse"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {translations.contactEmailButton}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity duration-300" />
                  </a>
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{translations.contact24hResponseLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{translations.contactExpertSupportLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-2xl group-hover:from-green-500/20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-600/10 to-transparent rounded-tr-2xl group-hover:from-green-600/20 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{translations.contactWhatsAppSupport}</h3>
                      <p className="text-white/70 mb-3">{translations.contactGetHelpEmail || "Get instant help via WhatsApp"}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-medium">{translations.contactOnlineNow}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {translations.contactWhatsAppDescription}
                  </p>
                  <a 
                    href="https://wa.me/46767855060" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative inline-flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden animate-glow-pulse"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                      {translations.contactWhatsAppButton}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-30 group-hover/btn:opacity-50 transition-opacity duration-300" />
                  </a>
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{translations.contact24hResponseLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{translations.contactExpertSupportLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        ref={setSectionRef("faq")}
        className={`py-24 px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 transition-all duration-1000 ${
          visibleSections.has("faq")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            visibleSections.has("faq")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
              {translations.contactFrequentlyAsked} <span className="text-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{translations.contactQuestions}</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {translations.contactQuickAnswers} <span className="text-indigo-400 font-medium">{translations.contactAIVideoPlatform}</span>
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* FAQ Items */}
            <div className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-700 delay-100 ${
              visibleSections.has("faq")
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/20 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">{translations.contactHowLong}</h3>
                </div>
                <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                  {translations.contactHowLongDesc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactUnder5Minutes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactHDQuality}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-700 delay-200 ${
              visibleSections.has("faq")
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-2xl group-hover:from-purple-500/20 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">{translations.contactVideoQuality}</h3>
                </div>
                <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                  {translations.contactVideoQualityDesc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contact1080pHD}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactMultipleFormats}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1 transition-all duration-700 delay-300 ${
              visibleSections.has("faq")
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-2xl group-hover:from-pink-500/20 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300">{translations.contactCustomVoice}</h3>
                </div>
                <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                  {translations.contactCustomVoiceDesc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-yellow-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactComingSoonLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactAIVoicesNow}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-700 delay-400 ${
              visibleSections.has("faq")
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl group-hover:from-indigo-500/20 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">{translations.contactCommercialUse}</h3>
                </div>
                <p className="text-white/70 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                  {translations.contactCommercialUseDesc}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactCommercialRights}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{translations.contactNoExtraFees}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
