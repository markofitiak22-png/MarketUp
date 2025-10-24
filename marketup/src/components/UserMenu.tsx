"use client";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { translations } = useTranslations();

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
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {translations.account}
      </button>
      {open ? (
        <div
          role="menu"
          className="fixed w-56 rounded-xl glass p-2 shadow-xl"
          style={{ 
            zIndex: 9999,
            top: buttonRect ? `${buttonRect.bottom + 8}px` : '80px',
            right: buttonRect ? `${window.innerWidth - buttonRect.right}px` : '16px'
          }}
        >
          <div className="px-2 py-1.5 text-xs uppercase tracking-wide text-[var(--muted)]">{translations.account}</div>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/dashboard">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {translations.dashboard}
            </span>
          </a>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/dashboard/profile">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {translations.profile}
            </span>
          </a>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/dashboard/videos">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {translations.myVideos}
            </span>
          </a>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/dashboard/subscription">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {translations.subscription}
            </span>
          </a>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/dashboard/settings">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {translations.settings}
            </span>
          </a>
          <a className="block px-3 py-2 text-sm rounded hover:bg-white/5" href="/admin">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {translations.adminPanel}
            </span>
          </a>
          <div className="my-2 h-px bg-[var(--border)]" />
          <button
            className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/5 text-red-400"
            onClick={async () => {
              // Clear remember me on server
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
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
            {translations.signOut}
          </button>
        </div>
      ) : null}
    </div>
  );
}


