"use client";
import { useMemo, useState, useEffect } from "react";
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
  const origin = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

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
        const response = await fetch('/api/referrals');
        
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
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        // Refresh data
        const refreshResponse = await fetch('/api/referrals');
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
        body: JSON.stringify({ code: redeemCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setRedeemCode("");
        // Refresh data
        const refreshResponse = await fetch('/api/referrals');
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reward Ladder */}
      <RewardLadder />

      <Container>
        <Section className="py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                {translations.referralsTitle}
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {translations.referralsDescription}
              </p>
            </div>

            {/* Stats */}
            {referralData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {referralData.stats.totalReferrals}
                  </div>
                  <div className="text-white/70">{translations.referralsTotalReferrals}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {referralData.stats.totalRewards}
                  </div>
                  <div className="text-white/70">{translations.referralsTotalRewards}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {referralData.stats.pendingReferrals}
                  </div>
                  <div className="text-white/70">{translations.referralsPending}</div>
                </div>
              </div>
            )}

            {/* Create Referral Code */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{translations.referralsCreateReferralCode}</h2>
              <p className="text-white/70 mb-6">
                {translations.referralsGenerateUnique}
              </p>
              <Button
                onClick={createCode}
                disabled={creating}
                className="bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
              >
                {creating ? translations.referralsCreating : translations.referralsCreateReferralCode}
              </Button>
            </div>

            {/* My Referral Codes */}
            {referralData?.referralCodes && referralData.referralCodes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">{translations.referralsMyReferralCodes}</h2>
                <div className="space-y-4">
                  {referralData.referralCodes.map((codeData) => (
                    <div key={codeData.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-mono text-white">{codeData.code}</div>
                        <div className="text-sm text-white/60">
                          Created: {new Date(codeData.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        onClick={() => copyLink(codeData.code)}
                        className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Copy Link
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Use Referral Code */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{translations.referralsUseReferralCode}</h2>
              <p className="text-white/70 mb-6">
                {translations.referralsHaveReferralCode}
              </p>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="Enter referral code"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Button
                  onClick={redeem}
                  disabled={redeeming || !redeemCode.trim()}
                  className="bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redeeming ? "Using..." : "Use Code"}
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {status && (
              <div className={`p-4 rounded-xl mb-6 ${
                status === "ok" 
                  ? "bg-green-500/20 border border-green-400/50 text-green-300" 
                  : "bg-red-500/20 border border-red-400/50 text-red-300"
              }`}>
                {status === "ok" ? "Success!" : error}
              </div>
            )}

            {/* Used Referral Codes */}
            {referralData?.referredEvents && referralData.referredEvents.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Used Referral Codes</h2>
                <div className="space-y-4">
                  {referralData.referredEvents.map((event) => (
                    <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">
                            Code: {event.referralCode?.code}
                          </div>
                          <div className="text-sm text-white/60">
                            From: {event.referrer?.name || event.referrer?.email || "Anonymous User"}
                          </div>
                          <div className="text-sm text-white/60">
                            Used: {new Date(event.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === "APPROVED" 
                            ? "bg-green-500/20 text-green-300" 
                            : event.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}>
                          {event.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {referralData?.referralEvents && referralData.referralEvents.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{translations.referralsRecentActivity}</h2>
                <div className="space-y-4">
                  {referralData.referralEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">
                            {event.referredUser?.name || event.referredUser?.email || "Anonymous User"}
                          </div>
                          <div className="text-sm text-white/60">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === "APPROVED" 
                            ? "bg-green-500/20 text-green-300" 
                            : event.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}>
                          {event.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      </Container>
    </div>
  );
}