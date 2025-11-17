"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestCode() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/password/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (res.ok) {
      setMsg("If the email exists, a reset code was sent to your email address.");
      setStage("reset");
    } else setMsg(data.error || "error");
    setLoading(false);
  }

  async function doReset() {
    if (!code) {
      setMsg("Please enter the reset code.");
      return;
    }
    
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/password/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, password }) });
    const data = await res.json();
    setMsg(res.ok ? "Password reset successfully! You can now sign in with your new password." : data.error || "error");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link href="/" className="group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight mb-8">
              <div className="w-8 h-8 rounded-lg overflow-hidden logo-blue-glow">
                <Image 
                  src="/logo.jpeg" 
                  alt="MarketUp Logo" 
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gradient bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                MarketUp
              </span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Reset Your Password
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {stage === "request" 
                ? "Enter your email address and we'll send you a code to reset your password."
                : "Enter the verification code from your email and create a new secure password."}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">🔒 Secure</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">⚡ Quick</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">✉️ Email Verified</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-white/70">
            © 2025 MarketUp. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight mb-8">
            <div className="w-8 h-8 rounded-lg overflow-hidden logo-blue-glow">
              <Image 
                src="/logo.jpeg" 
                alt="MarketUp Logo" 
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gradient bg-gradient-to-r from-slate-900 to-slate-700 dark:from-foreground dark:to-foreground-muted bg-clip-text text-transparent">
              MarketUp
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Reset Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {stage === "request" 
                ? "Enter your email to receive a reset code" 
                : "Enter the code and your new password"}
            </p>
          </div>

          {/* Reset Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
            {stage === "request" ? (
              <form onSubmit={(e) => { e.preventDefault(); requestCode(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    required
                  />
                </div>

                {msg && (
                  <div className={`p-4 rounded-xl text-sm ${
                    msg.includes('error') || msg.includes('Error')
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                  }`}>
                    {msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); doReset(); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-center text-2xl tracking-widest font-mono transition-all duration-200"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Check your email for the 6-digit code
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    required
                  />
                </div>

                {msg && (
                  <div className={`p-4 rounded-xl text-sm ${
                    msg.includes('error') || msg.includes('Error') || msg.includes('invalid')
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                  }`}>
                    {msg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <Link 
                  href="/auth" 
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Sign In
                </Link>
                {stage === "reset" && (
                  <button
                    onClick={() => {
                      setStage("request");
                      setCode("");
                      setPassword("");
                      setMsg(null);
                    }}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
                  >
                    Request new code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
