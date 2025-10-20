"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const countries = ["Sweden", "Turkey", "Ukraine", "USA", "UAE"];
const languages = ["en", "sv", "tr", "uk", "ar"];

export default function OnboardingPage() {
  const [country, setCountry] = useState("");
  const [locale, setLocale] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setCountry(data.country || "");
        setLocale(data.locale || "");
      }
    })();
  }, []);

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ country, locale }) });
      if (!res.ok) throw new Error("Failed to save");
      router.push("/");
    } catch {
      setError("Could not save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Section size="lg">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mx-auto glass rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-sm mb-4">
            <span className="text-gradient font-medium">Get started</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Welcome to MarketUp</h1>
          <p className="text-foreground-muted mt-3">Select your country and language. You can change these later in Settings.</p>
        </div>
      </Section>

      <Section>
        <div className="max-w-lg mx-auto">
          <Card variant="elevated" className="p-6">
            <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); if (!loading && country && locale) save(); }}>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="country">Country</label>
                <div className="relative">
                  <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="pr-10">
                    <option value="" disabled>Choose a country…</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                    {/* Chevron */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="language">Language</label>
                <div className="relative">
                  <select id="language" value={locale} onChange={(e) => setLocale(e.target.value)} className="pr-10">
                    <option value="" disabled>Choose a language…</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>

              {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}

              <div className="flex items-center justify-between pt-2">
                <a href="/" className="btn-ghost">Skip for now</a>
                <Button type="submit" variant="primary" className="btn-lg" disabled={loading || !country || !locale}>
                  {loading ? "Saving…" : "Continue"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Section>
    </Container>
  );
}


