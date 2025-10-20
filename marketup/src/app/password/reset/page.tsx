"use client";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestLink() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/password/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (res.ok) {
      setMsg("If the email exists, a reset link was sent. Dev token shown below.");
      if (data.devToken) setToken(data.devToken);
      setStage("reset");
    } else setMsg(data.error || "error");
    setLoading(false);
  }

  async function doReset() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/password/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    const data = await res.json();
    setMsg(res.ok ? "Password reset. You can sign in now." : data.error || "error");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-accent-2 rounded-2xl mb-6 shadow-2xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-3">Reset Password</h1>
            <p className="text-foreground-muted text-lg">
              {stage === "request" ? "Enter your email to receive a reset link" : "Enter the token and your new password"}
            </p>
          </div>

          {/* Enhanced Reset Form */}
          <div className="relative overflow-hidden rounded-3xl p-10 animate-slide-up" style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-transparent" />
            
            {/* Floating particles effect */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-accent/30 rounded-full animate-float" style={{animationDelay: '0s'}} />
            <div className="absolute top-8 right-8 w-1 h-1 bg-accent-2/40 rounded-full animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}} />
            
            <div className="relative z-10">
              {stage === "request" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border transition-all duration-300 bg-white/5 text-foreground placeholder-foreground-muted focus:outline-none backdrop-blur-sm border-white/20 hover:border-white/30 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={requestLink}
                    disabled={loading}
                    className="w-full py-4 px-6 text-sm font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {loading ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">Send Reset Link</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the token from your email"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border transition-all duration-300 bg-white/5 text-foreground placeholder-foreground-muted focus:outline-none backdrop-blur-sm border-white/20 hover:border-white/30 focus:border-accent focus:ring-2 focus:ring-accent/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      New Password
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border transition-all duration-300 bg-white/5 text-foreground placeholder-foreground-muted focus:outline-none backdrop-blur-sm border-white/20 hover:border-white/30 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <circle cx="12" cy="16" r="1"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={doReset}
                    disabled={loading}
                    className="w-full py-4 px-6 text-sm font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {loading ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Resetting...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">Reset Password</span>
                    )}
                  </button>
                </div>
              )}

              {/* Message Display */}
              {msg && (
                <div className="mt-6 p-4 rounded-2xl backdrop-blur-sm" style={{
                  background: msg.includes('error') || msg.includes('error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  border: msg.includes('error') || msg.includes('error') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <p className="text-sm font-bold" style={{
                    color: msg.includes('error') || msg.includes('error') ? 'var(--error)' : 'var(--success)'
                  }}>
                    {msg}
                  </p>
                </div>
              )}

              {/* Back to Sign In */}
              <div className="mt-8 text-center">
                <a 
                  href="/auth" 
                  className="text-sm text-accent hover:text-accent-hover font-bold transition-colors"
                >
                  ← Back to Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


