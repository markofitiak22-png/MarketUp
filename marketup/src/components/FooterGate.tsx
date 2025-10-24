"use client";
import { usePathname } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function FooterGate() {
  const pathname = usePathname();
  const { translations } = useTranslations();
  if (pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/password/reset" || pathname?.startsWith("/password/") || pathname?.startsWith("/admin") || pathname === "/onboarding") return null;
  return (
    <footer className="w-full relative overflow-hidden">
      {/* Simple animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      
      <div className="relative z-10">
        <div className="container">
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 mt-16 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                  {translations.footerTitle}
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted mb-4">
                  {translations.footerSubtitle}
                </p>
                <a href="/pricing" className="btn-primary px-6 py-3 text-sm sm:text-base font-semibold hover:scale-105 transition-all duration-300">
                  {translations.footerGetStarted}
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <span className="text-sm text-foreground-muted">{translations.footerFollowUs}</span>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <a href="https://instagram.com/marketup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-300">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{translations.footerInstagram}</span>
                  </a>
                  
                  <a href="https://facebook.com/marketup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{translations.footerFacebook}</span>
                  </a>
                  
                  <a href="https://tiktok.com/@marketup" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-black/10 to-gray-800/10 hover:from-black/20 hover:to-gray-800/20 transition-all duration-300">
                    <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{translations.footerTikTok}</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border mt-6 sm:mt-8 pt-4 sm:pt-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="text-center lg:text-left">
                  <p className="text-xs sm:text-sm text-foreground-muted mb-1">
                    {translations.footerCopyright}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground-muted">
                    {translations.footerContact} <a href="mailto:support@marketup.com" className="text-accent hover:text-accent-2 transition-colors">support@marketup.com</a>
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                  <a href="/privacy" className="text-xs sm:text-sm text-foreground-muted hover:text-foreground hover:bg-accent/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 hover:scale-105">
                    {translations.footerPrivacy}
                  </a>
                  <a href="/terms" className="text-xs sm:text-sm text-foreground-muted hover:text-foreground hover:bg-accent/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 hover:scale-105">
                    {translations.footerTerms}
                  </a>
                  <a href="/cookies" className="text-xs sm:text-sm text-foreground-muted hover:text-foreground hover:bg-accent/10 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 hover:scale-105">
                    {translations.footerCookies}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


