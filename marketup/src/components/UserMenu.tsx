"use client";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [isInsideMobileMenu, setIsInsideMobileMenu] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { translations } = useTranslations();
  
  // Check if UserMenu is inside mobile menu
  useEffect(() => {
    if (ref.current) {
      const checkMobileMenu = () => {
        setIsInsideMobileMenu(ref.current?.closest('.mobile-menu-content') !== null);
      };
      checkMobileMenu();
      // Recheck on resize/scroll
      window.addEventListener('resize', checkMobileMenu);
      return () => window.removeEventListener('resize', checkMobileMenu);
    }
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (open && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setButtonRect(rect);
        }
      };
      
      updatePosition();
      
      // Update position on window resize or orientation change
      window.addEventListener('resize', updatePosition);
      window.addEventListener('orientationchange', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('orientationchange', updatePosition);
      };
    }
  }, [open]);

  // Calculate dropdown position - opens directly below the button, shifted left
  const getDropdownPosition = () => {
    // If inside mobile menu, use absolute positioning (part of scrollable content)
    if (isInsideMobileMenu) {
      return {
        position: 'absolute' as const,
        top: '100%',
        left: '0',
        marginTop: '8px',
        width: '100%',
        zIndex: 10
      };
    }

    // Desktop: fixed positioning
    if (!buttonRect) {
      return { 
        position: 'fixed' as const,
        top: '80px', 
        left: '16px',
        zIndex: 9999
      };
    }

    const dropdownWidth = 224; // w-56 = 14rem = 224px
    const viewportWidth = window.innerWidth;
    const padding = 16; // Minimum padding from edges

    // Position directly below the button
    let top = buttonRect.bottom + 8;
    let left = padding;
    
    if (viewportWidth >= 640) {
      // Desktop: position to the left of button
      left = Math.max(padding, buttonRect.left - (dropdownWidth - buttonRect.width) / 2);
    }

    // Ensure dropdown stays within viewport
    if (left + dropdownWidth > viewportWidth - padding) {
      left = viewportWidth - dropdownWidth - padding;
    }
    
    return { 
      position: 'fixed' as const,
      top: `${top}px`, 
      left: `${left}px`,
      zIndex: 9999
    };
  };

  // Check if inside mobile menu
  const isInMobileMenu = isInsideMobileMenu;
  
  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isInMobileMenu
            ? "bg-[#121315] border border-[rgba(255,255,255,0.08)] text-[#e6e7ea] hover:bg-[#1a1b1e]"
            : "border border-[rgba(255,255,255,0.08)] bg-[#121315] hover:bg-[#1a1b1e] text-[#e6e7ea]"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <svg 
          className="w-4 h-4 text-[#e6e7ea]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline text-[#e6e7ea]">{translations.account}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 text-[#a1a1aa] ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="w-56 rounded-xl bg-[#0b0b0b] p-2 shadow-xl border border-[rgba(255,255,255,0.08)]"
          style={{ 
            ...getDropdownPosition()
          }}
        >
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1">
            {translations.account}
          </div>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/dashboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {translations.dashboard}
          </a>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/dashboard/profile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {translations.profile}
          </a>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/dashboard/videos"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {translations.myVideos}
          </a>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/dashboard/subscription"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {translations.subscription}
          </a>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/dashboard/settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {translations.settings}
          </a>
          <a 
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-[#a1a1aa] hover:bg-indigo-900/20 hover:text-indigo-400 transition-all duration-200" 
            href="/admin"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {translations.adminPanel}
          </a>
          <div className="my-2 h-px bg-[rgba(255,255,255,0.08)]" />
          <button
            className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200"
            onClick={async () => {
              // Clear remember me on server
              try {
                await fetch('/api/auth/logout', { 
                  method: 'POST',
                  credentials: "include"
                });
              } catch (error) {
                console.error('Failed to clear remember me:', error);
              }
              // Clear localStorage
              localStorage.removeItem('rememberMe');
              localStorage.removeItem('rememberedEmail');
              // Sign out
              signOut({ callbackUrl: "/auth" });
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {translations.signOut}
          </button>
        </div>
      ) : null}
    </div>
  );
}
