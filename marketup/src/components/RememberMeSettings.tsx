"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function RememberMeSettings() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const clearRememberMe = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/auth/remember-me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Remember me sessions cleared successfully' });
        // Also clear localStorage
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      } else {
        setMessage({ type: 'error', text: 'Failed to clear remember me sessions' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while clearing sessions' });
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="glass-elevated rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">Remember Me Settings</h3>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="p-3 sm:p-4 rounded-xl bg-surface-elevated">
          <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
            Remember Me allows you to stay signed in for up to 30 days on trusted devices.
            If you&apos;re using a shared or public computer, we recommend not using this feature.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-surface-elevated border border-border gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-foreground">Clear Remember Me Sessions</h4>
              <p className="text-xs sm:text-sm text-foreground-muted">
                This will sign you out of all devices where you&apos;ve chosen to be remembered.
              </p>
            </div>
          </div>
          <button
            onClick={clearRememberMe}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-xs sm:text-sm whitespace-nowrap"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                <span>Clearing...</span>
              </div>
            ) : (
              'Clear All Sessions'
            )}
          </button>
        </div>

        {message && (
          <div className={`p-3 sm:p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
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
              <span className="font-medium text-xs sm:text-sm">{message.text}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
