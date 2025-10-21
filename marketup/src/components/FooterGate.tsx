"use client";
import { usePathname } from "next/navigation";

export default function FooterGate() {
  const pathname = usePathname();
  if (pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/password/reset" || pathname?.startsWith("/password/") || pathname?.startsWith("/admin") || pathname === "/onboarding") return null;
  return (
    <footer className="w-full border-t border-[var(--border)] mt-20 bg-gradient-to-t from-background via-background to-transparent">
      <div className="container py-12">
        <div className="text-center">
          <p className="text-sm text-foreground-muted mb-2">
            ©️ 2026 MarketUp. All rights reserved.
          </p>
          <p className="text-sm text-foreground-muted mb-4">
            Contact: <a href="mailto:support@marketup.com" className="hover:text-foreground transition-colors">support@marketup.com</a>
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-foreground-muted">Follow us:</span>
            <a href="https://instagram.com/marketup" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Instagram
            </a>
            <span className="text-foreground-muted">|</span>
            <a href="https://facebook.com/marketup" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              Facebook
            </a>
            <span className="text-foreground-muted">|</span>
            <a href="https://tiktok.com/@marketup" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


