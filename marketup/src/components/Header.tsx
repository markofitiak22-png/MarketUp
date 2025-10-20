"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/studio", label: "Studio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/referrals", label: "Referrals" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-[var(--border)] shadow-sm"
          : "bg-background/60 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between" style={{ minHeight: 64 }}>
        {/* Brand */}
        <a href="/" className="text-[1.125rem] font-semibold tracking-tight">
          MarketUp
        </a>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative px-1 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                  isActive
                    ? "text-foreground"
                    : "text-foreground-muted hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-[var(--accent)] transition-all ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </a>
            );
          })}
          <div className="flex items-center gap-3 pl-2">
            <a href="/pricing" className="btn-outline btn-sm">Pricing</a>
            <a href="/onboarding" className="btn-primary btn-sm">Get started</a>
            <UserMenu />
          </div>
        </nav>

        {/* Mobile menu removed by request */}
      </div>

    </header>
  );
}


