"use client";
import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ReferralsPage() {
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
    if (!ownerId.trim()) { setError("Provide your user id."); return; }
    setCreating(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_code", ownerId }),
      });
      const data = await res.json();
      if (res.ok) setCode(data.code);
      else setError(data.error || "Unable to create code");
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  }

  async function redeem() {
    setStatus(null);
    setError(null);
    if (!redeemCode.trim()) { setError("Enter a code to redeem."); return; }
    setRedeeming(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem", code: redeemCode.trim() }),
      });
      const data = await res.json();
      setStatus(res.ok ? "ok" : "error");
      if (!res.ok) setError(data.error || "Invalid code");
    } catch {
      setStatus("error");
      setError("Network error");
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
    <Container>
      {/* Hero */}
      <Section size="lg">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mx-auto glass rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-sm mb-4">
            <span className="text-gradient font-medium">Referrals</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Invite and earn</h1>
          <p className="text-foreground-muted mt-3">Share your link — when someone subscribes, you both benefit.</p>
        </div>
      </Section>

      {/* Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create code */}
          <Card variant="elevated" className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Create your referral code</h2>
            <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="owner">Your user id</label>
                <input id="owner" placeholder="e.g., usr_123" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
              </div>
              <Button onClick={createCode} disabled={creating} variant="primary" className="btn-lg">
                {creating ? "Generating…" : "Generate"}
              </Button>
            </div>
            {code ? (
              <div className="mt-5 grid gap-2">
                <div className="text-sm text-foreground-muted">Your code</div>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-2 rounded-md border border-[var(--border)] bg-white/5 select-all">{code}</code>
                  <Button onClick={copyLink} variant="outline">Copy link</Button>
                </div>
                <p className="text-xs text-foreground-muted">Share this link: {origin ? `${origin}/?ref=${code}` : `/?ref=${code}`}</p>
              </div>
            ) : null}
            {error ? <p className="mt-3 text-sm text-[var(--error)]">{error}</p> : null}
          </Card>

          {/* Redeem */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Redeem a code</h2>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="redeem">Code</label>
              <input id="redeem" placeholder="Enter referral code" value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} />
              <Button onClick={redeem} disabled={redeeming} className="mt-2">{redeeming ? "Redeeming…" : "Redeem"}</Button>
              {status === "ok" ? <p className="text-sm text-[var(--success)]">Success — welcome!</p> : null}
              {status === "error" || error ? <p className="text-sm text-[var(--error)]">{error || "Invalid code"}</p> : null}
            </div>
          </Card>
        </div>
      </Section>

      {/* How it works */}
      <Section size="sm">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "Generate", d: "Create your personal code in one click." },
            { t: "Share", d: "Send your link to friends or clients." },
            { t: "Earn", d: "Get rewards when they subscribe." },
          ].map((s, i) => (
            <Card key={i} className="p-5">
              <div className="text-sm text-foreground-muted">{s.t}</div>
              <div className="font-medium">{s.d}</div>
            </Card>
          ))}
        </div>
      </Section>
    </Container>
  );
}


