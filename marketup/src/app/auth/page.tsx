"use client";
import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" },
  { code: "ar", label: "العربية" },
];

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Real-time validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (mode === "signup" && password.length < 8) return "Password must be at least 8 characters for security";
    return null;
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        const emailError = validateEmail(email);
        setErrors(prev => ({ ...prev, email: emailError || undefined }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (password) {
        const passwordError = validatePassword(password);
        setErrors(prev => ({ ...prev, password: passwordError || undefined }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [password, mode]);

  const handleModeChange = (newMode: "signin" | "signup") => {
    if (newMode !== mode) {
      setIsAnimating(true);
      setErrors({});
      setTimeout(() => {
        setMode(newMode);
        setIsAnimating(false);
      }, 150);
    }
  };

  async function submitEmailPassword() {
    setLoading(true);
    setErrors({});
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Registration failed");
      }
      
      const result = await signIn("credentials", { 
        email, 
        password, 
        redirect: false,
        callbackUrl: "/"
      });
      
      if (result?.error) {
        setErrors({ general: result.error });
      } else {
        // Success animation before redirect
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (e: any) {
      setErrors({ general: e.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    await signIn("google", { callbackUrl: "/" });
  }

  function continueAsGuest() {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        {/* Auth Form */}
        <div className="w-full max-w-md px-4 sm:px-6">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-xl mb-4 shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gradient mb-2">Welcome to MarketUp</h1>
              <p className="text-foreground-muted">
                {mode === "signin" ? "Sign in to your account" : "Create your account"}
              </p>
            </div>

            {/* Enhanced Main Auth Card */}
            <div className={`relative overflow-hidden rounded-3xl p-10 animate-slide-up transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`} style={{
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
                {/* Enhanced Tab Navigation */}
                <div className="flex mb-10 bg-black/20 rounded-2xl p-1.5 shadow-2xl border border-white/10">
                  <button
                    className={`flex-1 py-4 px-6 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
                      mode === "signin" 
                        ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg transform scale-105" 
                        : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                    }`}
                    onClick={() => handleModeChange("signin")}
                  >
                    <span className="relative z-10">Sign In</span>
                    {mode === "signin" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                  <button
                    className={`flex-1 py-4 px-6 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
                      mode === "signup" 
                        ? "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg transform scale-105" 
                        : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                    }`}
                    onClick={() => handleModeChange("signup")}
                  >
                    <span className="relative z-10">Sign Up</span>
                    {mode === "signup" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    )}
                  </button>
                </div>

                {/* Enhanced Google Sign In Button */}
                <button 
                  onClick={google} 
                  className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white/5 border border-white/20 rounded-2xl text-sm font-bold text-foreground hover:bg-white/10 transition-all duration-300 mb-8 group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <svg width="20" height="20" viewBox="0 0 24 24" className="relative z-10">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="relative z-10">Continue with Google</span>
                </button>

                {/* Enhanced Divider */}
                <div className="flex items-center my-8">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-sm text-foreground-muted font-medium">or</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                {/* Enhanced Email/Password Form */}
                <form onSubmit={(e) => { e.preventDefault(); submitEmailPassword(); }} className="space-y-6">
                  {/* Enhanced Email Field */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        placeholder="Enter your email"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 bg-white/5 text-foreground placeholder-foreground-muted focus:outline-none backdrop-blur-sm ${
                          errors.email 
                            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
                            : emailFocused 
                              ? 'border-accent focus:border-accent focus:ring-2 focus:ring-accent/20' 
                              : 'border-white/20 hover:border-white/30'
                        }`}
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-error mt-2 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Password
                      {mode === "signup" && (
                        <span className="text-xs text-foreground-muted ml-2">(min. 8 characters)</span>
                      )}
                    </label>
                    <div className="relative group">
                      <input
                        ref={passwordRef}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        placeholder="Enter your password"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 bg-white/5 text-foreground placeholder-foreground-muted focus:outline-none backdrop-blur-sm ${
                          errors.password 
                            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
                            : passwordFocused 
                              ? 'border-accent focus:border-accent focus:ring-2 focus:ring-accent/20' 
                              : 'border-white/20 hover:border-white/30'
                        }`}
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
                    {errors.password && (
                      <p className="text-sm text-error mt-2 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Remember Me & Forgot Password */}
                  {mode === "signin" && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-5 h-5 rounded border-white/20 text-accent focus:ring-accent focus:ring-2 group-hover:scale-110 transition-transform" 
                        />
                        <span className="text-sm text-foreground-muted group-hover:text-foreground transition-colors">Remember me</span>
                      </label>
                      <a 
                        href="/password/reset" 
                        className="text-sm text-accent hover:text-accent-hover font-bold transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Enhanced General Error Message */}
                  {errors.general && (
                    <div className="bg-error/10 border border-error/30 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-error flex-shrink-0">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        <p className="text-sm text-error font-bold">{errors.general}</p>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
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
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      <span className="relative z-10">
                        {mode === "signin" ? "Sign In" : "Create Account"}
                      </span>
                    )}
                  </button>
              </form>

                {/* Enhanced Terms and Privacy */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-accent hover:text-accent-hover font-bold transition-colors">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-accent hover:text-accent-hover font-bold transition-colors">Privacy Policy</a>
                  </p>
                </div>

              </div>
            </div>
        </div>
      </div>
    </div>
  );
}


