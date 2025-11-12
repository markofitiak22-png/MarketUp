"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import RewardLadder from "@/components/RewardLadder";
import { useTranslations } from "@/hooks/useTranslations";
interface ReferralData {
  referralCodes: any[];
  referralEvents: any[];
  referredEvents: any[];
  totalReferrals: number;
  stats: {
    totalReferrals: number;
    totalRewards: number;
    pendingReferrals: number;
  };
}

export default function ReferralsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const { translations } = useTranslations();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [status, setStatus] = useState<"ok" | "error" | null>(null);
  const [creating, setCreating] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const origin = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const setupObservers = () => {
      const sectionKeys = ["header", "stats", "create-code", "my-codes", "use-code", "used-codes", "activity"];
      
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

  // Check authentication status
  useEffect(() => {
    if (sessionStatus === "loading") return; // Still loading
    
    if (sessionStatus === "unauthenticated" || !session) {
      // User is not authenticated, redirect to auth page
      router.push("/auth");
      return;
    }
  }, [session, sessionStatus, router]);

  // Fetch referral data on component mount
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!session || sessionStatus !== "authenticated") return;
    
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/referrals', {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch referral data');
        }

        const data = await response.json();
        setReferralData(data);
      } catch (err) {
        console.error('Error fetching referral data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [session, sessionStatus]);

  async function createCode() {
    setStatus(null);
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        // Refresh data
        const refreshResponse = await fetch('/api/referrals', {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setReferralData(refreshData);
        }
        
        // Trigger reward ladder refresh
        window.dispatchEvent(new CustomEvent('referralDataUpdated'));
      } else {
        setError(data.error || "Failed to create referral code");
        setStatus("error");
      }
    } catch {
      setError("Network error");
      setStatus("error");
    } finally {
      setCreating(false);
    }
  }

  async function redeem() {
    setStatus(null);
    setError(null);
    if (!redeemCode.trim()) { 
      setError("Please enter a referral code"); 
      setStatus("error");
      return; 
    }
    setRedeeming(true);
    try {
      const res = await fetch("/api/referrals/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: redeemCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setRedeemCode("");
        // Refresh data
        const refreshResponse = await fetch('/api/referrals', {
          credentials: "include",
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setReferralData(refreshData);
        }
        
        // Trigger reward ladder refresh
        window.dispatchEvent(new CustomEvent('referralDataUpdated'));
      } else {
        setError(data.error || "Invalid referral code");
        setStatus("error");
      }
    } catch {
      setError("Network error");
      setStatus("error");
    } finally {
      setRedeeming(false);
    }
  }

  async function copyLink(code: string) {
    const url = `${origin}/?ref=${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("ok");
    } catch {
      setError("Failed to copy link");
      setStatus("error");
    }
  }

  // Show loading while checking authentication
  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-indigo-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"></div>
            </div>
          </div>
          <p className="text-white/70 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (this should not happen due to useEffect, but just in case)
  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-indigo-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"></div>
            </div>
          </div>
          <p className="text-white/70 text-lg">Loading referral data...</p>
        </div>
      </div>
    );
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

      {/* Reward Ladder */}
      <div className="relative z-10">
        <RewardLadder />
      </div>

      <Container>
        <Section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div 
              ref={setSectionRef("header")}
              className={`text-center mb-20 transition-all duration-1000 ${
                visibleSections.has("header")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  {translations.referralsTitle}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {translations.referralsDescription}
              </p>
            </div>

            {/* Stats */}
            {referralData && (
              <div 
                ref={setSectionRef("stats")}
                className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-200 ${
                  visibleSections.has("stats")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 text-center hover:border-indigo-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                      {referralData.stats.totalReferrals}
                    </div>
                    <div className="text-white/70 text-lg">{translations.referralsTotalReferrals}</div>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 text-center hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                      {referralData.stats.totalRewards}
                    </div>
                    <div className="text-white/70 text-lg">{translations.referralsTotalRewards}</div>
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 text-center hover:border-pink-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-1">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                      {referralData.stats.pendingReferrals}
                    </div>
                    <div className="text-white/70 text-lg">{translations.referralsPending}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Referral Code */}
            <div 
              ref={setSectionRef("create-code")}
              className={`group relative mb-12 transition-all duration-1000 delay-300 ${
                visibleSections.has("create-code")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 hover:border-indigo-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/80 to-indigo-500/80 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{translations.referralsCreateReferralCode}</h2>
                </div>
                <p className="text-white/70 mb-8 text-lg">
                  {translations.referralsGenerateUnique}
                </p>
                <Button
                  onClick={createCode}
                  disabled={creating}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {translations.referralsCreating}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {translations.referralsCreateReferralCode}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* My Referral Codes */}
            {referralData?.referralCodes && referralData.referralCodes.length > 0 && (
              <div 
                ref={setSectionRef("my-codes")}
                className={`group relative mb-12 transition-all duration-1000 delay-400 ${
                  visibleSections.has("my-codes")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/80 to-purple-500/80 flex items-center justify-center shadow-xl shadow-purple-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{translations.referralsMyReferralCodes}</h2>
                  </div>
                  <div className="space-y-4">
                    {referralData.referralCodes.map((codeData) => (
                      <div key={codeData.id} className="group/card bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 flex items-center justify-between hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-lg font-mono font-semibold text-white mb-1">{codeData.code}</div>
                            <div className="text-sm text-white/60">
                              Created: {new Date(codeData.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => copyLink(codeData.code)}
                          className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white px-5 py-2.5 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Use Referral Code */}
            <div 
              ref={setSectionRef("use-code")}
              className={`group relative mb-12 transition-all duration-1000 delay-500 ${
                visibleSections.has("use-code")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 hover:border-pink-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600/80 to-pink-500/80 flex items-center justify-center shadow-xl shadow-pink-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{translations.referralsUseReferralCode}</h2>
                </div>
                <p className="text-white/70 mb-8 text-lg">
                  {translations.referralsHaveReferralCode}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="Enter referral code"
                    className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 text-lg font-mono"
                  />
                  <Button
                    onClick={redeem}
                    disabled={redeeming || !redeemCode.trim()}
                    className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {redeeming ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Using...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Use Code
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`p-5 rounded-xl mb-8 backdrop-blur-sm ${
                status === "ok" 
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300 shadow-lg shadow-green-500/20" 
                  : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/50 text-red-300 shadow-lg shadow-red-500/20"
              }`}>
                <div className="flex items-center gap-3">
                  {status === "ok" ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="font-semibold text-lg">{status === "ok" ? "Success!" : error}</span>
                </div>
              </div>
            )}

            {/* Used Referral Codes */}
            {referralData?.referredEvents && referralData.referredEvents.length > 0 && (
              <div 
                ref={setSectionRef("used-codes")}
                className={`group relative mb-12 transition-all duration-1000 delay-600 ${
                  visibleSections.has("used-codes")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 hover:border-indigo-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/80 to-indigo-500/80 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Used Referral Codes</h2>
                  </div>
                  <div className="space-y-4">
                    {referralData.referredEvents.map((event) => (
                      <div key={event.id} className="group/card bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </div>
                              <div className="text-white font-semibold text-lg">
                                Code: <span className="font-mono text-indigo-300">{event.referralCode?.code}</span>
                              </div>
                            </div>
                            <div className="text-sm text-white/60 ml-11 space-y-1">
                              <div>From: {event.referrer?.name || event.referrer?.email || "Anonymous User"}</div>
                              <div>Used: {new Date(event.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 ${
                            event.status === "APPROVED" 
                              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300 shadow-lg shadow-green-500/20" 
                              : event.status === "PENDING"
                              ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 text-yellow-300 shadow-lg shadow-yellow-500/20"
                              : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/50 text-red-300 shadow-lg shadow-red-500/20"
                          }`}>
                            {event.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {referralData?.referralEvents && referralData.referralEvents.length > 0 && (
              <div 
                ref={setSectionRef("activity")}
                className={`group relative transition-all duration-1000 delay-700 ${
                  visibleSections.has("activity")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 hover:border-purple-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/80 to-purple-500/80 flex items-center justify-center shadow-xl shadow-purple-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{translations.referralsRecentActivity}</h2>
                  </div>
                  <div className="space-y-4">
                    {referralData.referralEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="group/card bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-300 font-bold text-sm">
                                {(event.referredUser?.name || event.referredUser?.email || "A")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-semibold text-lg">
                                {event.referredUser?.name || event.referredUser?.email || "Anonymous User"}
                              </div>
                              <div className="text-sm text-white/60">
                                {new Date(event.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 ${
                            event.status === "APPROVED" 
                              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 text-green-300 shadow-lg shadow-green-500/20" 
                              : event.status === "PENDING"
                              ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 text-yellow-300 shadow-lg shadow-yellow-500/20"
                              : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/50 text-red-300 shadow-lg shadow-red-500/20"
                          }`}>
                            {event.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      </Container>
    </div>
  );
}