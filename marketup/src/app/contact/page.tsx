"use client";
import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!name.trim() || !email.trim() || !message.trim()) return "Please fill all fields.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return "Enter a valid email address.";
    if (message.trim().length < 10) return "Message should be at least 10 characters.";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Language Selector */}
      <LanguageSelector />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="section-lg text-center">
          <div className="container">
            <div className="max-w-4xl mx-auto">
             
              
              {/* Main heading */}
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
                  We'd love to <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">hear from you</span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                  Questions, partnerships, or press — send us a message and we'll reply shortly. <span className="text-accent font-medium">We usually respond within 24 hours.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section relative">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
                <div>
            {status === "success" ? (
                    <div className="glass-elevated rounded-3xl p-12 text-center relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/10 to-transparent rounded-bl-3xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-success/10 to-transparent rounded-tr-3xl" />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Thanks! Your message has been sent.</h2>
                        <p className="text-xl text-foreground-muted mb-8">We usually respond within 24 hours.</p>
                        <button 
                          onClick={() => setStatus(null)} 
                          className="group relative btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:bg-accent/5 transition-all duration-300"
                        >
                          <span className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Send another
                          </span>
                        </button>
                </div>
              </div>
            ) : (
                    <div className="glass-elevated rounded-3xl p-10 relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-3xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-2/10 to-transparent rounded-tr-3xl" />
                      
                      <div className="relative z-10">
                        <form className="space-y-6" onSubmit={submit} noValidate>
                          <div className="space-y-4">
                            <label className="text-base font-medium text-foreground">Name</label>
                            <input 
                              id="name" 
                              placeholder="Your name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              required 
                              className="w-full p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <label className="text-base font-medium text-foreground">Email</label>
                            <input 
                              id="email" 
                              type="email" 
                              placeholder="you@company.com" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                              required 
                              className="w-full p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <label className="text-base font-medium text-foreground">Message</label>
                            <textarea 
                              id="message" 
                              rows={5} 
                              placeholder="How can we help?" 
                              value={message} 
                              onChange={(e) => setMessage(e.target.value)} 
                              required 
                              className="w-full p-4 rounded-xl border border-[var(--border)] bg-surface-elevated text-foreground placeholder-foreground-muted focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200 resize-none"
                            />
                            <p className="text-sm text-foreground-muted">No bots, no spam. We'll only use your email to reply.</p>
                          </div>
                          
                          {error && (
                            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                              {error}
                            </div>
                          )}
                          
                          {status === "error" && (
                            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                              Something went wrong. Please try again.
                            </div>
                          )}
                          
                          <div className="flex gap-4 pt-4">
                            <button 
                              type="submit" 
                              disabled={loading}
                              className="flex-1 btn-primary px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? "Sending..." : "Send message"}
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setName(""); setEmail(""); setMessage(""); }}
                              className="btn-outline px-6 py-3 font-semibold"
                            >
                              Clear
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  {/* Email Contact - Primary */}
                  <div className="group bg-surface-elevated border border-border rounded-3xl p-8 transition-all duration-300 hover:shadow-lg hover:border-accent/50">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-foreground">Email Support</h3>
                          <p className="text-lg text-foreground-muted">Get help via email</p>
                        </div>
                      </div>
                      <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
                        Send us an email and we'll get back to you within 24 hours. Perfect for detailed questions, feedback, or support requests.
                      </p>
                      <a 
                        href="mailto:support@marketup.app" 
                        className="w-full justify-center py-4 text-lg font-bold"
                      >
                        <span className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          support@marketup.app
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp - Coming Soon */}
                  <div className="group bg-surface-elevated border border-border rounded-3xl p-8 transition-all duration-300 hover:shadow-lg hover:border-green-500/50 opacity-60">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-foreground">WhatsApp Support</h3>
                          <p className="text-lg text-foreground-muted">Coming soon</p>
                        </div>
                      </div>
                      <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
                        WhatsApp support will be available soon for instant messaging and quick questions.
                      </p>
                      <div className="btn-outline w-full justify-center py-4 text-lg font-bold cursor-not-allowed">
                        <span className="flex items-center gap-3">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                          </svg>
                          WhatsApp (Coming Soon)
                        </span>
                      </div>
                    </div>
                  </div>

                
                </div>
                </div>
                </div>
          </div>
        </section>
          </div>
        </div>
  );
}