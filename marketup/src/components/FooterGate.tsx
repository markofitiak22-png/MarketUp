"use client";
import { usePathname } from "next/navigation";

export default function FooterGate() {
  const pathname = usePathname();
  if (pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/password/reset" || pathname?.startsWith("/password/") || pathname?.startsWith("/admin")) return null;
  return (
    <footer className="w-full border-t border-black/[.08] dark:border-white/[.145] mt-16">
      <div className="max-w-6xl mx-auto px-6 py-6 text-sm flex items-center justify-between">
        <p>© {new Date().getFullYear()} MarketUp</p>
        <div className="flex gap-4">
          <a className="hover:underline" href="/privacy">Privacy</a>
          <a className="hover:underline" href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}


