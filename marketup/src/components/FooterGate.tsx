"use client";
import { usePathname } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import Image from "next/image";
import Link from "next/link";

export default function FooterGate() {
  const pathname = usePathname();
  const { translations } = useTranslations();
  if (pathname === "/auth" || pathname?.startsWith("/auth/") || pathname === "/password/reset" || pathname?.startsWith("/password/") || pathname?.startsWith("/admin") || pathname === "/onboarding") return null;
  return (
    <footer className="w-full bg-[#0b0b0b]">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="py-16 sm:py-20">
          {/* CTA Section */}
          <div className="bg-[#121315]/50 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] shadow-lg mb-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#e6e7ea] mb-3">
                  {translations.footerTitle}
                </h3>
                <p className="text-base sm:text-lg text-[#a1a1aa]">
                  {translations.footerSubtitle}
                </p>
              </div>
              <Link 
                href="/pricing" 
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {translations.footerGetStarted}
              </Link>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 mb-4">
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
              </Link>
              <p className="text-sm text-[#a1a1aa] mb-6">
                {translations.footerSubtitle}
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/marketup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121315] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all duration-200"
                  aria-label={translations.footerInstagram}
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://facebook.com/marketup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121315] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-200"
                  aria-label={translations.footerFacebook}
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://tiktok.com/@marketup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121315] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] hover:bg-white hover:border-white hover:text-black transition-all duration-200"
                  aria-label={translations.footerTikTok}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-sm font-semibold text-[#e6e7ea] mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/pricing" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.pricing}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.about}
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.studio}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#e6e7ea] mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.contact}
                  </Link>
                </li>
                <li>
                  <Link href="/referrals" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.referrals}
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@marketup.com" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#e6e7ea] mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.footerPrivacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.footerTerms}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-[#a1a1aa] hover:text-indigo-400 transition-colors">
                    {translations.footerCookies}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#a1a1aa] text-center sm:text-left">
                {translations.footerCopyright}
              </p>
              <p className="text-xs sm:text-sm text-[#a1a1aa]">
                {translations.footerContact}{" "}
                <a href="mailto:support@marketup.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  support@marketup.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
