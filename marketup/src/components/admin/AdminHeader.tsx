"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
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
    <header className="fixed top-0 right-0 left-64 z-40 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
          <p className="text-sm text-foreground-muted">Welcome back, Admin</p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-surface-elevated">
                    <p className="text-sm text-foreground">New user registered</p>
                    <p className="text-xs text-foreground-muted">2 minutes ago</p>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-surface-elevated">
                    <p className="text-sm text-foreground">Video processing completed</p>
                    <p className="text-xs text-foreground-muted">5 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-surface-elevated">
                    <p className="text-sm text-foreground">System backup completed</p>
                    <p className="text-xs text-foreground-muted">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Admin User</p>
              <p className="text-foreground-muted">admin@marketup.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
