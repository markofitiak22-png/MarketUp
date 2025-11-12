"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export default function AdminHeader({ mobileMenuOpen, onMobileMenuToggle }: AdminHeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();
  const { translations } = useTranslations();

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return translations.adminHeaderDashboard;
      case "/admin/users":
        return translations.adminHeaderUsers;
      case "/admin/videos":
        return translations.adminHeaderVideoModeration;
      case "/admin/scheduler":
        return translations.adminHeaderPublicationScheduler;
      case "/admin/payments":
        return translations.adminHeaderPaymentManagement;
      case "/admin/tickets":
        return translations.adminHeaderTicketSystem;
      default:
        return translations.adminHeaderAdminPanel;
    }
  };


  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-72 z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/60 overflow-x-hidden">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4">
          {/* Mobile Menu Button - Only on mobile */}
          <button
            onClick={onMobileMenuToggle}
            className="block lg:hidden mobile-menu-toggle p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            style={{ display: 'block' }}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-white truncate">{getPageTitle()}</h1>
              <p className="text-xs sm:text-sm text-white/60 hidden sm:block truncate">{translations.adminHeaderManagePlatform}</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder={translations.adminHeaderSearchPlaceholder}
                className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-slate-800/40 border border-slate-700/60 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-1.5 sm:p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-lg shadow-lg z-50">
                  <div className="p-3 sm:p-4 border-b border-slate-700/60">
                    <h3 className="text-sm font-semibold text-white">{translations.adminHeaderNotifications}</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 sm:p-4 border-b border-slate-700/60 hover:bg-slate-800/60">
                      <p className="text-sm text-white">{translations.adminHeaderNewUserRegistered}</p>
                      <p className="text-xs text-white/60">2 {translations.adminHeaderMinutesAgo}</p>
                    </div>
                    <div className="p-3 sm:p-4 border-b border-slate-700/60 hover:bg-slate-800/60">
                      <p className="text-sm text-white">{translations.adminHeaderVideoProcessingCompleted}</p>
                      <p className="text-xs text-white/60">5 {translations.adminHeaderMinutesAgo}</p>
                    </div>
                    <div className="p-3 sm:p-4 hover:bg-slate-800/60">
                      <p className="text-sm text-white">{translations.adminHeaderSystemBackupCompleted}</p>
                      <p className="text-xs text-white/60">1 {translations.adminHeaderHourAgo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-xs sm:text-sm font-bold">A</span>
              </div>
              <div className="text-xs sm:text-sm hidden lg:block">
                <p className="font-medium text-white">{translations.adminHeaderAdminUser}</p>
                <p className="text-white/60">admin@marketup.com</p>
              </div>
            </div>
        </div>
      </div>
    </header>

    </>
  );
}
