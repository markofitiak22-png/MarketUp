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

            {/* Simple Auth Form */}
            <div className={`relative rounded-2xl p-8 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="relative z-10">
                {/* Simple Tab Navigation */}
                <div className="flex mb-8 bg-surface-elevated rounded-xl p-1 border border-border">
                  <button
                    className={`flex-1 py-3 px-6 text-sm font-bold rounded-lg transition-all duration-200 ${
                      mode === "signin" 
                        ? "bg-accent text-white" 
                        : "text-foreground-muted hover:text-foreground hover:bg-surface"
                    }`}
                    onClick={() => handleModeChange("signin")}
                  >
                    Sign In
                  </button>
                  <button
                    className={`flex-1 py-3 px-6 text-sm font-bold rounded-lg transition-all duration-200 ${
                      mode === "signup" 
                        ? "bg-accent text-white" 
                        : "text-foreground-muted hover:text-foreground hover:bg-surface"
                    }`}
                    onClick={() => handleModeChange("signup")}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Simple Google Sign In Button */}
                <button 
                  onClick={google} 
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-surface-elevated border border-border rounded-xl text-sm font-bold text-foreground hover:bg-surface transition-all duration-200 mb-6"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Simple Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="px-4 text-sm text-foreground-muted">or</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                {/* Simple Email/Password Form */}
                <form onSubmit={(e) => { e.preventDefault(); submitEmailPassword(); }} className="space-y-4">
                  {/* Simple Email Field */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-background text-foreground placeholder-foreground-muted focus:outline-none ${
                        errors.email 
                          ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
                          : 'border-border hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-error mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Simple Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Password
                      {mode === "signup" && (
                        <span className="text-xs text-foreground-muted ml-2">(min. 8 characters)</span>
                      )}
                    </label>
                    <input
                      ref={passwordRef}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-background text-foreground placeholder-foreground-muted focus:outline-none ${
                        errors.password 
                          ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20' 
                          : 'border-border hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-error mt-2">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Simple Remember Me & Forgot Password */}
                  {mode === "signin" && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-2" 
                        />
                        <span className="text-sm text-foreground-muted">Remember me</span>
                      </label>
                      <a 
                        href="/password/reset" 
                        className="text-sm text-accent hover:text-accent-hover transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Simple General Error Message */}
                  {errors.general && (
                    <div className="bg-error/10 border border-error/30 rounded-xl p-3">
                      <p className="text-sm text-error">{errors.general}</p>
                    </div>
                  )}

                  {/* Simple Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 text-sm font-bold rounded-xl bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      mode === "signin" ? "Sign In" : "Create Account"
                    )}
                  </button>
              </form>

                {/* Simple Terms and Privacy */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-foreground-muted">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-accent hover:text-accent-hover transition-colors">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-accent hover:text-accent-hover transition-colors">Privacy Policy</a>
                  </p>
                </div>

              </div>
            </div>
        </div>
      </div>
    </div>
  );
}


