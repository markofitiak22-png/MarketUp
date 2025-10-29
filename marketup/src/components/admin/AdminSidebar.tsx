"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

const getNavigation = (translations: any) => [
  {
    name: translations.adminSidebarDashboard,
    href: "/admin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarUsers,
    href: "/admin/users",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarVideoModeration,
    href: "/admin/videos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarPublicationScheduler,
    href: "/admin/scheduler",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarPaymentManagement,
    href: "/admin/payments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarTicketSystem,
    href: "/admin/tickets",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 0 0-2 2v3a2 2 0 1 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 1 1 0-4V7a2 2 0 0 0-2-2H5z"/>
      </svg>
    ),
  },
  {
    name: translations.adminSidebarReviews || "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  mobileMenuOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobileMenuOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { translations } = useTranslations();
  const navigation = getNavigation(translations);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[9998]"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        admin-sidebar
        ${mobileMenuOpen ? 'fixed' : 'hidden lg:block'} 
        inset-y-0 left-0 z-[9999] w-72 max-w-[85vw] flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:block lg:fixed lg:top-0 lg:bottom-0 lg:h-screen
      `}>
        <div className="flex grow flex-col overflow-y-auto glass-elevated h-full min-h-screen lg:min-h-full">
        {/* Header */}
        <div className="flex h-16 sm:h-20 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{translations.adminSidebarAdminPanel}</h2>
              <p className="text-xs sm:text-sm text-foreground-muted">{translations.adminSidebarManagePlatform}</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="mobile-close-button lg:hidden p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-4 sm:px-6 py-3 sm:py-4 pt-4 sm:pt-6">
          <ul role="list" className="flex flex-1 flex-col gap-1 sm:gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg"
                        : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                      isActive ? "text-white" : "text-foreground-muted group-hover:text-foreground"
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm sm:text-base">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 sm:p-6 mt-auto pb-6 sm:pb-8">
          <div className="glass-elevated rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{translations.adminHeaderAdminUser}</p>
                <p className="text-xs text-foreground-muted truncate">admin@marketup.com</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {translations.adminSidebarSignOut}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
