"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [locale, setLocale] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setLocale(data.locale || "");
      }
      const subRes = await fetch("/api/subscriptions");
      if (subRes.ok) {
        const data = await subRes.json();
        setPlan(data.subscription?.tier || "None");
      }
    })();
  }, []);

  async function save() {
    setMsg(null);
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, locale }) });
    setMsg(res.ok ? "Saved" : "Error");
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 grid gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm opacity-80">Plan: {plan || "None"}</p>
      <input className="border rounded p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="border rounded p-2" placeholder="Locale (en, uk, ar)" value={locale} onChange={(e) => setLocale(e.target.value)} />
      <button onClick={save} className="rounded bg-foreground text-background px-4 py-2">Save</button>
      {msg ? <p className="text-sm opacity-80">{msg}</p> : null}
    </div>
  );
}


