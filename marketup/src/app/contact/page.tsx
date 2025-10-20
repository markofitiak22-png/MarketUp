"use client";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useState } from "react";

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
    <Container>
      {/* Hero */}
      <Section size="lg">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mx-auto glass rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-sm mb-4">
            <span className="text-gradient font-medium">Contact</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">We’d love to hear from you</h1>
          <p className="text-foreground-muted mt-3">Questions, partnerships, or press — send us a message and we’ll reply shortly.</p>
        </div>
      </Section>

      {/* Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <Card variant="elevated" className="p-6 lg:col-span-2">
            {status === "success" ? (
              <div className="grid gap-2 text-center">
                <h2 className="text-xl font-semibold">Thanks! Your message has been sent.</h2>
                <p className="text-foreground-muted">We usually respond within 24 hours.</p>
                <div className="pt-2">
                  <Button onClick={() => setStatus(null)} variant="outline">Send another</Button>
                </div>
              </div>
            ) : (
              <form className="grid gap-4" onSubmit={submit} noValidate>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="name">Name</label>
                  <input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="message">Message</label>
                  <textarea id="message" rows={6} placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} required />
                  <p className="text-xs text-foreground-muted">No bots, no spam. We’ll only use your email to reply.</p>
                </div>
                {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
                {status === "error" ? <p className="text-sm text-[var(--error)]">Something went wrong. Please try again.</p> : null}
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" variant="primary" className="btn-lg" disabled={loading}>
                    {loading ? "Sending…" : "Send message"}
                  </Button>
                  <Button type="button" variant="outline" className="btn-lg" onClick={() => { setName(""); setEmail(""); setMessage(""); }}>Clear</Button>
                </div>
              </form>
            )}
          </Card>

          {/* Sidebar */}
          <div className="grid gap-6">
            <Card className="p-5">
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-foreground-muted">Prefer email? Reach us directly.</p>
              <a href="mailto:support@marketup.app" className="mt-3 inline-block btn-outline">support@marketup.app</a>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-1">Office hours</h3>
              <p className="text-sm text-foreground-muted">Mon–Fri, 9:00–18:00 UTC</p>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-1">FAQ</h3>
              <p className="text-sm text-foreground-muted">Common questions about pricing, usage, and privacy.</p>
              <a href="/pricing" className="mt-3 inline-block btn-ghost">See pricing</a>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}


