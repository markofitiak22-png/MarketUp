"use client";
import { useTransition } from "react";

type Tier = "BASIC" | "STANDARD" | "PREMIUM";

export default function UpgradeButton({ tier, className, children }: { tier: Tier; className?: string; children?: React.ReactNode }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier }),
      });
      window.location.reload();
    });
  }

  return (
    <button onClick={onClick} disabled={pending} className={className}>
      {children}
    </button>
  );
}


