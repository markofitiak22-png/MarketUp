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
          ? "bg-[#0b0b0b]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-sm"
          : "bg-[#0b0b0b]/50 backdrop-blur-lg border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12" style={{ minHeight: 72 }}>
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight">
          <div className="w-8 h-8 rounded-lg overflow-hidden logo-blue-glow">
            <Image 
              src="/favicon-32x32.png" 
              alt="MarketUp Logo" 
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gradient bg-gradient-to-r from-[#e6e7ea] to-[#a1a1aa] bg-clip-text text-transparent">
            MarketUp
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm">
          {currentLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative px-3 py-2 rounded-xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  link.hideOnMd ? 'hidden xl:block' : ''
                } ${
                  isActive
                    ? "text-indigo-400 bg-indigo-900/20 font-semibold"
                    : "text-[#a1a1aa] hover:text-[#e6e7ea] hover:bg-[#1a1b1e]"
                }`}
              >
                {translations[link.labelKey as keyof typeof translations]}
              </a>
            );
          })}
          <div className="flex items-center gap-2 pl-3 ml-3 border-l border-[rgba(255,255,255,0.08)]">
            {isAuthenticated ? (
              <>
                <a 
                  href="/studio" 
                  className="flex items-center gap-2 px-3 py-2 bg-[#121315] text-[#e6e7ea] text-sm font-semibold rounded-xl hover:bg-[#1a1b1e] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {translations.getStarted}
                </a>
                <LanguageButton />
                <UserMenu />
              </>
            ) : (
              <>
                <a 
                  href="/auth" 
                  className="px-3 py-2 text-[#a1a1aa] text-sm font-semibold rounded-xl hover:bg-[#1a1b1e] transition-all duration-200"
                >
                  {translations.signIn || "Sign In"}
                </a>
                <a 
                  href="/auth" 
                  className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200"
                >
                  {translations.signUp || "Sign Up"}
                </a>
                <LanguageButton />
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          {!isAuthenticated && (
            <a 
              href="/auth" 
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-lg"
            >
              {translations.signUp || "Sign Up"}
            </a>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu p-2 rounded-xl hover:bg-[#1a1b1e] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
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
        <div className="lg:hidden mobile-menu fixed top-0 right-0 z-[9999] h-full w-80 max-w-[85vw] bg-[#0b0b0b] border-l border-[rgba(255,255,255,0.08)] shadow-2xl transform transition-transform duration-300 ease-out translate-x-0" style={{ display: 'block', visibility: 'visible', opacity: 1, position: 'fixed', top: 0, right: 0, width: '320px', height: '100vh' }}>
          <div className="flex flex-col h-full overflow-hidden mobile-menu-content">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.08)] bg-[#0b0b0b] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden logo-blue-glow">
                  <Image 
                    src="/favicon-32x32.png" 
                    alt="MarketUp Logo" 
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-gradient bg-gradient-to-r from-[#e6e7ea] to-[#a1a1aa] bg-clip-text text-transparent">
                  MarketUp
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-[#1a1b1e] transition-colors"
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6 text-[#e6e7ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 p-6 overflow-y-auto overscroll-contain bg-[#0b0b0b]">
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
                      className={`group flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "text-indigo-400 bg-indigo-900/20 border border-indigo-800"
                          : "text-[#a1a1aa] hover:text-[#e6e7ea] hover:bg-[#1a1b1e]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isActive 
                          ? "bg-indigo-900/30 text-indigo-400" 
                          : "bg-[#1a1b1e] text-[#a1a1aa] group-hover:bg-indigo-900/20 group-hover:text-indigo-400"
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
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-3">
                    {translations.language || "Language"}
                  </h3>
                  <div className="flex justify-center">
                    <LanguageButton />
                  </div>
                </div>
              </div>

              {/* Account Section */}
              {isAuthenticated ? (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider mb-3">
                      {translations.account}
                    </h3>
                    <UserMenu />
                  </div>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                  <div className="space-y-3">
                    <a
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 px-6 text-[#a1a1aa] font-semibold rounded-xl hover:bg-[#1a1b1e] transition-all duration-200 border border-[rgba(255,255,255,0.08)]"
                    >
                      {translations.signIn || "Sign In"}
                    </a>
                    <a
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                    >
                      {translations.signUp || "Sign Up"}
                    </a>
                  </div>
                </div>
              )}

              {/* Mobile CTA */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)] flex-shrink-0">
                  <a
                    href="/studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[#121315] text-[#e6e7ea] text-lg font-semibold rounded-xl hover:bg-[#1a1b1e] transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {translations.getStarted}
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


