"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export default function AdminHeader({ mobileMenuOpen, onMobileMenuToggle }: AdminHeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/users":
        return "Users";
      case "/admin/videos":
        return "Video Moderation";
      case "/admin/scheduler":
        return "Publication Scheduler";
      case "/admin/payments":
        return "Payment Management";
      case "/admin/tickets":
        return "Ticket System";
      default:
        return "Admin Panel";
    }
  };


  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-72 z-[100] bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4">
          {/* Mobile Menu Button - Only on mobile */}
          <button
            onClick={onMobileMenuToggle}
            className="block lg:hidden mobile-menu-toggle p-1.5 sm:p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
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
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground truncate">{getPageTitle()}</h1>
              <p className="text-xs sm:text-sm text-foreground-muted hidden sm:block">Manage your platform and analytics</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Search - Hidden on mobile */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-48 xl:w-64 pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-1.5 sm:p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-error rounded-full"></span>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 sm:p-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 sm:p-4 border-b border-border hover:bg-surface-elevated">
                      <p className="text-sm text-foreground">New user registered</p>
                      <p className="text-xs text-foreground-muted">2 minutes ago</p>
                    </div>
                    <div className="p-3 sm:p-4 border-b border-border hover:bg-surface-elevated">
                      <p className="text-sm text-foreground">Video processing completed</p>
                      <p className="text-xs text-foreground-muted">5 minutes ago</p>
                    </div>
                    <div className="p-3 sm:p-4 hover:bg-surface-elevated">
                      <p className="text-sm text-foreground">System backup completed</p>
                      <p className="text-xs text-foreground-muted">1 hour ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">A</span>
              </div>
              <div className="text-xs sm:text-sm hidden lg:block">
                <p className="font-medium text-foreground">Admin User</p>
                <p className="text-foreground-muted">admin@marketup.com</p>
              </div>
            </div>
        </div>
      </div>
    </header>

    </>
  );
}
