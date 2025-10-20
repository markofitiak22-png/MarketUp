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
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while clearing sessions' });
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="bg-surface-elevated rounded-xl p-6 border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Remember Me Settings</h3>
      
      <div className="space-y-4">
        <div className="text-sm text-foreground-muted">
          <p className="mb-2">
            Remember Me allows you to stay signed in for up to 30 days on trusted devices.
          </p>
          <p>
            If you're using a shared or public computer, we recommend not using this feature.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <h4 className="font-medium text-foreground">Clear Remember Me Sessions</h4>
            <p className="text-sm text-foreground-muted">
              This will sign you out of all devices where you've chosen to be remembered.
            </p>
          </div>
          <button
            onClick={clearRememberMe}
            disabled={loading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Clearing...' : 'Clear All Sessions'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
