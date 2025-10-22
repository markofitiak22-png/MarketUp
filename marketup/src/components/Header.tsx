"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-2xl border-b border-[var(--border)] shadow-lg shadow-black/10"
          : "bg-background/70 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between" style={{ minHeight: 72 }}>
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="/favicon-32x32.png" 
              alt="MarketUp Logo" 
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gradient bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">
            MarketUp
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative px-3 py-2 rounded-lg outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                  isActive
                    ? "text-foreground bg-accent/10"
                    : "text-foreground-muted hover:text-foreground hover:bg-accent/5"
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
          <div className="flex items-center gap-4 pl-4 border-l border-[var(--border)]">
            <a href="/pricing" className="btn-outline btn-sm hover:bg-accent/10 transition-all duration-200">Pricing</a>
            <a href="/onboarding" className="btn-primary btn-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200">Get started</a>
            <UserMenu />
          </div>
        </nav>

        {/* Mobile menu removed by request */}
      </div>

    </header>
  );
}


