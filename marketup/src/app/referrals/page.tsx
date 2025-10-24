"use client";
import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
// import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useTranslations } from "@/hooks/useTranslations";

export default function ReferralsPage() {
  const { translations } = useTranslations();
  const [ownerId, setOwnerId] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [status, setStatus] = useState<"ok" | "error" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const origin = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

  async function createCode() {
    setStatus(null);
    setError(null);
    if (!ownerId.trim()) { setError(translations.referralsProvideUserId); return; }
    setCreating(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_code", ownerId }),
      });
      const data = await res.json();
      if (res.ok) setCode(data.code);
      else setError(data.error || translations.referralsInvalidCode);
    } catch {
      setError(translations.referralsNetworkError);
    } finally {
      setCreating(false);
    }
  }

  async function redeem() {
    setStatus(null);
    setError(null);
    if (!redeemCode.trim()) { setError(translations.referralsEnterCodeToRedeem); return; }
    setRedeeming(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem", code: redeemCode.trim() }),
      });
      const data = await res.json();
      setStatus(res.ok ? "ok" : "error");
      if (!res.ok) setError(data.error || translations.referralsInvalidCode);
    } catch {
      setStatus("error");
      setError(translations.referralsNetworkError);
    } finally {
      setRedeeming(false);
    }
  }

  async function copyLink() {
    if (!code) return;
    const url = `${origin}/?ref=${code}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  }

  return (
    <>
    

      <Container>

      {/* Content */}
      <Section>
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="grid lg:grid-cols-3 gap-10 relative z-10">
            {/* Create code */}
            <div className="lg:col-span-2">
              <div className="glass-elevated rounded-3xl p-10 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 border border-accent/10 hover:border-accent/30">
                {/* Corner gradient decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gradient mb-2">{translations.referralsCreateCode}</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="text-sm text-foreground-muted font-medium">{translations.referralsGenerateLink}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end mb-6">
                    <div className="grid gap-3">
                      <label className="text-sm font-medium text-foreground" htmlFor="owner">{translations.referralsYourUserId}</label>
                      <input 
                        id="owner" 
                        placeholder={translations.referralsUserIdPlaceholder} 
                        value={ownerId} 
                        onChange={(e) => setOwnerId(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-accent/20 bg-surface-elevated/50 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      />
                    </div>
                    <Button 
                      onClick={createCode} 
                      disabled={creating} 
                      variant="primary" 
                      className="px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300"
                    >
                      {creating ? translations.referralsGenerating : translations.referralsGenerate}
                    </Button>
                  </div>
                  
                  {code ? (
                    <div className="glass-elevated rounded-2xl p-6 border border-accent/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-success">{translations.referralsCodeReady}</span>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <div className="text-sm text-foreground-muted mb-2">{translations.referralsYourCode}</div>
                          <div className="flex items-center gap-3">
                            <code className="px-4 py-3 rounded-xl border border-accent/20 bg-surface-elevated/50 select-all font-mono text-lg font-bold text-accent">{code}</code>
                            <Button 
                              onClick={copyLink} 
                              variant="outline"
                              className="px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                            >
                              {translations.referralsCopyLink}
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-foreground-muted">
                          {translations.referralsShareLink} <span className="font-mono text-accent">{origin ? `${origin}/?ref=${code}` : `/?ref=${code}`}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  {error ? (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-500 font-medium">{error}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Redeem */}
            <div>
              <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 border border-accent-2/10 hover:border-accent-2/30">
                {/* Corner gradient decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-2/20 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-2 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gradient mb-1">{translations.referralsRedeemCode}</h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent-2 rounded-full animate-pulse"></div>
                        <span className="text-sm text-foreground-muted font-medium">{translations.referralsEnterCode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block" htmlFor="redeem">{translations.referralsCode}</label>
                      <input 
                        id="redeem" 
                        placeholder={translations.referralsCodePlaceholder} 
                        value={redeemCode} 
                        onChange={(e) => setRedeemCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-accent-2/20 bg-surface-elevated/50 focus:border-accent-2/50 focus:ring-2 focus:ring-accent-2/20 transition-all duration-300"
                      />
                    </div>
                    <Button 
                      onClick={redeem} 
                      disabled={redeeming} 
                      className="w-full py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300"
                    >
                      {redeeming ? translations.referralsRedeeming : translations.referralsRedeem}
                    </Button>
                    
                    {status === "ok" ? (
                      <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                        <p className="text-sm text-success font-medium">{translations.referralsSuccess}</p>
                      </div>
                    ) : null}
                    
                    {status === "error" || error ? (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-500 font-medium">{error || translations.referralsInvalidCode}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section size="sm">
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                {translations.referralsHowReferralsWork}
              </h2>
              <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
                Simple steps to <span className="text-accent-2 font-medium">{translations.referralsStartEarning}</span> with referrals
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  t: translations.referralsGenerateStep, 
                  d: translations.referralsGenerateDesc,
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  ),
                  gradient: "from-accent to-accent-2"
                },
                { 
                  t: translations.referralsShareStep, 
                  d: translations.referralsShareDesc,
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  ),
                  gradient: "from-accent-2 to-purple-500"
                },
                { 
                  t: translations.referralsEarnStep, 
                  d: translations.referralsEarnDesc,
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  ),
                  gradient: "from-purple-500 to-pink-500"
                },
              ].map((s, i) => (
                <div key={i} className="group glass-elevated rounded-3xl p-8 transition-all duration-700 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-accent/30 group-hover:border-accent/50 relative overflow-hidden border border-accent/10 hover:border-accent/30">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-accent/40 to-accent-2/40 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-br from-accent-2/40 to-purple-500/40 rounded-full animate-pulse delay-500"></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                      {s.icon}
                    </div>
                    <div className="text-sm text-foreground-muted font-medium mb-3 group-hover:text-accent transition-colors duration-300">{s.t}</div>
                    <div className="text-lg font-bold text-foreground group-hover:text-foreground transition-colors duration-300">{s.d}</div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mt-6">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-sm text-accent font-medium">{translations.referralsStep} {i + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Container>
    </>
  );
}


