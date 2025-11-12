"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/hooks/useTranslations";

export default function RememberMeSettings() {
  const { data: session } = useSession();
  const { translations } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const clearRememberMe = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/auth/remember-me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: translations.rememberMeSessionsClearedSuccessfully });
        // Also clear localStorage
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      } else {
        setMessage({ type: 'error', text: translations.rememberMeFailedToClearSessions });
      }
    } catch {
      setMessage({ type: 'error', text: translations.rememberMeErrorOccurred });
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">{translations.rememberMeSettings}</h3>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/40 border border-slate-700/60">
          <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed">
            {translations.rememberMeDescription}
          </p>
        </div>

        <div className="flex flex-col p-3 sm:p-4 rounded-lg sm:rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-red-500/40 hover:bg-slate-800/60 transition-all duration-300 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">{translations.rememberMeClearSessions}</h4>
              <p className="text-[10px] sm:text-xs text-white/60">
                {translations.rememberMeClearSessionsDescription}
              </p>
            </div>
          </div>
          <button
            onClick={clearRememberMe}
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                <span>{translations.rememberMeClearing}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>{translations.rememberMeClearAllSessions}</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-400 border-green-500/30' 
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-medium text-[10px] sm:text-xs">{message.text}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
