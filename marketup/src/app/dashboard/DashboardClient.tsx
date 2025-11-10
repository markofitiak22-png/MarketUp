"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import LanguageButton from "@/components/LanguageButton";

const getNavigation = (translations: any) => [
  { 
    name: translations.dashboardSidebarOverview, 
    href: "/dashboard", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    name: translations.dashboardSidebarProfile, 
    href: "/dashboard/profile", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  { 
    name: translations.dashboardSidebarVideos, 
    href: "/dashboard/videos", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    name: translations.dashboardSidebarSubscription, 
    href: "/dashboard/subscription", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    name: translations.dashboardSidebarBilling, 
    href: "/dashboard/billing", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    name: translations.dashboardSidebarSettings, 
    href: "/dashboard/settings", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

interface DashboardClientProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function DashboardClient({ children, userEmail }: DashboardClientProps) {
  const pathname = usePathname();
  const { translations } = useTranslations();
  const navigation = getNavigation(translations);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileWidth = window.innerWidth < 1024;
      setIsMobile(isMobileWidth);
      // Close menu if switching to desktop
      if (!isMobileWidth && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    // Check immediately
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileMenuOpen]);

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

    // Close menu on resize to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen && isMobile) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('resize', handleResize);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      if (mobileMenuOpen && !isMobile) {
        setMobileMenuOpen(false);
      }
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen, isMobile]);

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      {/* Dashboard Header */}
      <header
        className={`sticky top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-[#0b0b0b]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)] shadow-sm"
            : "bg-[#0b0b0b]/50 backdrop-blur-lg border-b border-transparent"
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-center gap-10 px-4 sm:px-6 lg:px-8 xl:px-12" style={{ minHeight: 80 }}>
          {/* Back button */}
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#121315] border border-[rgba(255,255,255,0.08)] hover:bg-[#1a1b1e] hover:border-indigo-500/30 transition-all group"
            aria-label="Go to home"
          >
            <svg 
              className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight mr-6">
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

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex flex-1 items-center gap-16 overflow-x-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl outline-none transition-all duration-200 whitespace-nowrap text-sm ${
                    isActive
                      ? "text-indigo-400 bg-indigo-900/20 font-semibold"
                      : "text-[#a1a1aa] hover:text-[#e6e7ea] hover:bg-[#1a1b1e]"
                  }`}
                >
                  <div className={`w-5 h-5 flex items-center justify-center ${
                    isActive ? "text-indigo-400" : "text-[#a1a1aa] group-hover:text-[#e6e7ea]"
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Language button and Mobile menu button */}
          <div className="flex items-center gap-3">
            {/* Language button - Desktop only */}
            <div className="hidden lg:flex">
              <LanguageButton />
            </div>
            
            {/* Mobile menu button - Mobile only */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden mobile-menu p-2 rounded-xl hover:bg-[#1a1b1e] transition-colors"
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-[#e6e7ea] transition-all duration-300 ease-in-out mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && isMobile && (
        <div className="lg:hidden fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && isMobile && (
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
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
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
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </Link>
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
            </nav>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
