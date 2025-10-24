"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";
import LanguageButton from "@/components/LanguageButton";
import { useTranslations } from "@/hooks/useTranslations";

const links = [
  { href: "/", labelKey: "home" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/about", labelKey: "about", hideOnMd: true },
  { href: "/contact", labelKey: "contact", hideOnMd: true },
  { href: "/referrals", labelKey: "referrals", hideOnMd: true },
];

const authLinks = [
  { href: "/", labelKey: "home" },
  { href: "/studio", labelKey: "studio" },
  { href: "/pricing", labelKey: "pricing" },
  { href: "/about", labelKey: "about", hideOnMd: true },
  { href: "/contact", labelKey: "contact", hideOnMd: true },
  { href: "/referrals", labelKey: "referrals", hideOnMd: true },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { translations } = useTranslations();
  
  const isAuthenticated = status === "authenticated";
  const currentLinks = isAuthenticated ? authLinks : links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-2xl border-b border-[var(--border)] shadow-lg shadow-black/10"
          : "bg-background/70 backdrop-blur-xl border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6" style={{ minHeight: 72 }}>
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
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {currentLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative px-3 py-2 rounded-lg outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                  link.hideOnMd ? 'hidden xl:block' : ''
                } ${
                  isActive
                    ? "text-foreground bg-accent/10"
                    : "text-foreground-muted hover:text-foreground hover:bg-accent/5"
                }`}
              >
                {translations[link.labelKey as keyof typeof translations]}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-0.5 rounded-full bg-[var(--accent)] transition-all ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </a>
            );
          })}
          <div className="flex items-center gap-2 pl-3 border-l border-[var(--border)]">
            {isAuthenticated ? (
              <>
                <a href="/onboarding" className="btn-primary btn-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200">{translations.getStarted}</a>
                <LanguageButton />
                <UserMenu />
              </>
            ) : (
              <>
                <a href="/auth" className="btn-secondary btn-sm">{translations.signIn || "Sign In"}</a>
                <a href="/auth" className="btn-primary btn-sm shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200">{translations.signUp || "Sign Up"}</a>
                <LanguageButton />
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mobile-menu fixed top-0 right-0 z-[9999] h-full w-80 max-w-[85vw] bg-background border-l border-[var(--border)] shadow-2xl transform transition-transform duration-300 ease-out translate-x-0" style={{ display: 'block', visibility: 'visible', opacity: 1, position: 'fixed', top: 0, right: 0, width: '320px', height: '100vh' }}>
          <div className="flex flex-col h-full overflow-hidden mobile-menu-content">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-background flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-accent to-accent-2">
                  <Image 
                    src="/favicon-32x32.png" 
                    alt="MarketUp Logo" 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-gradient bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">
                  MarketUp
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 p-6 overflow-y-auto bg-background">
              <div className="space-y-2">
                {currentLinks.map((link) => {
                  const isActive =
                    link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "text-foreground bg-accent/15 border border-accent/20 shadow-lg shadow-accent/10"
                          : "text-foreground-muted hover:text-foreground hover:bg-accent/5 hover:shadow-md"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isActive 
                          ? "bg-accent/20 text-accent" 
                          : "bg-foreground-muted/10 text-foreground-muted group-hover:bg-accent/10 group-hover:text-accent"
                      }`}>
                        {link.href === "/" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        )}
                        {link.href === "/studio" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                        {link.href === "/pricing" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        )}
                        {link.href === "/about" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {link.href === "/contact" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {link.href === "/referrals" && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        )}
                      </div>
                      <span>{translations[link.labelKey as keyof typeof translations]}</span>
                    </a>
                  );
                })}
              </div>

              {/* Language Section */}
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
                    {translations.language || "Language"}
                  </h3>
                  <div className="flex justify-center">
                    <LanguageButton />
                  </div>
                </div>
              </div>

              {/* Account Section */}
              {isAuthenticated ? (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
                      {translations.account}
                    </h3>
                    <UserMenu />
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="space-y-3">
                    <a
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary w-full text-center py-3 px-6"
                    >
                      {translations.signIn || "Sign In"}
                    </a>
                    <a
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-primary w-full text-center py-3 px-6 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200"
                    >
                      {translations.signUp || "Sign Up"}
                    </a>
                  </div>
                </div>
              )}

              {/* Mobile CTA */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-[var(--border)] flex-shrink-0">
                  <a
                    href="/onboarding"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full text-center py-4 px-6 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200 text-lg font-semibold"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {translations.getStarted}
                    </span>
                  </a>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

    </header>
  );
}


