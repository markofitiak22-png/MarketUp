"use client";
import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  phoneCode?: string;
  general?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedEmail && isRemembered) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

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

  const validateName = (name: string) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    return null;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phone) return "Phone number is required";
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
    if (phone.replace(/\D/g, '').length < 10) return "Phone number must be at least 10 digits";
    return null;
  };

  const validatePhoneCode = (code: string) => {
    if (!code) return "Verification code is required";
    if (code.length !== 6) return "Code must be 6 digits";
    return null;
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name) {
        const nameError = validateName(name);
        setErrors(prev => ({ ...prev, name: nameError || undefined }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phone) {
        const phoneError = validatePhone(phone);
        setErrors(prev => ({ ...prev, phone: phoneError || undefined }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [phone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneCode) {
        const phoneCodeError = validatePhoneCode(phoneCode);
        setErrors(prev => ({ ...prev, phoneCode: phoneCodeError || undefined }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [phoneCode]);

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
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = mode === "signup" ? validateName(name) : null;
    
    if (emailError || passwordError || nameError) {
      setErrors({ 
        email: emailError || undefined, 
        password: passwordError || undefined,
        name: nameError || undefined
      });
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, referralCode }),
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
        let errorMessage = "An error occurred. Please try again.";
        if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (result.error === "CallbackRouteError") {
          errorMessage = "Authentication failed. Please try again.";
        } else if (result.error === "Configuration") {
          errorMessage = "Authentication service is temporarily unavailable. Please try again later.";
        }
        setErrors({ general: errorMessage });
      } else {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }
        
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

  async function apple() {
    console.log("Apple Sign In - Coming soon");
  }

  async function sendPhoneCode() {
    setLoading(true);
    setErrors({});
    
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setErrors({ phone: phoneError });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPhoneCodeSent(true);
    } catch (e: any) {
      setErrors({ general: e.message || "Failed to send code" });
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhoneCode() {
    setLoading(true);
    setErrors({});
    
    const phoneCodeError = validatePhoneCode(phoneCode);
    if (phoneCodeError) {
      setErrors({ phoneCode: phoneCodeError });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/");
    } catch (e: any) {
      setErrors({ general: e.message || "Invalid verification code" });
    } finally {
      setLoading(false);
    }
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
                  src="/favicon-32x32.png" 
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
              {mode === "signin" ? "Welcome Back" : "Start Your Journey"}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {mode === "signin" 
                ? "Continue creating amazing AI-powered videos with your personalized avatar."
                : "Join thousands of creators building engaging content with AI technology."}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">✨ AI-Powered</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">🚀 Fast Creation</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-sm font-medium">🎨 Customizable</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-white/70">
            © 2026 MarketUp. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden group flex items-center gap-3 text-[1.25rem] font-bold tracking-tight mb-8">
            <div className="w-8 h-8 rounded-lg overflow-hidden logo-blue-glow">
              <Image 
                src="/favicon-32x32.png" 
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

          {/* Mode Toggle */}
          <div className="mb-8">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleModeChange("signin")}
                className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "signin"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-all duration-300 ${mode === "signin" ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Sign In</span>
                {mode === "signin" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => handleModeChange("signup")}
                className={`relative flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  mode === "signup"
                    ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-all duration-300 ${mode === "signup" ? "text-purple-600 dark:text-purple-400" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Sign Up</span>
                {mode === "signup" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={google}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={apple}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white rounded-xl font-medium hover:bg-slate-900 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
            <span className="px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">or</span>
            <div className="flex-1 border-t border-slate-300 dark:border-slate-700"></div>
          </div>

          {/* Auth Method Toggle */}
          <div className="mb-6">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setAuthMethod("email")}
                className={`relative flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  authMethod === "email"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-all duration-300 ${authMethod === "email" ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
                {authMethod === "email" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
              
              <button
                onClick={() => setAuthMethod("phone")}
                className={`relative flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  authMethod === "phone"
                    ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-all duration-300 ${authMethod === "phone" ? "text-purple-600 dark:text-purple-400" : ""}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone</span>
                {authMethod === "phone" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Referral Code Banner */}
          {referralCode && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎁</span>
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-semibold text-sm">Referral Code Applied!</div>
                  <div className="text-slate-600 dark:text-slate-400 text-xs">You'll help your friend earn rewards</div>
                </div>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          {authMethod === "email" && (
            <form onSubmit={(e) => { e.preventDefault(); submitEmailPassword(); }} className="space-y-5" noValidate>
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                  {mode === "signup" && (
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">(min. 8 characters)</span>
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
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                  required
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === "signin" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-2" 
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                  <a 
                    href="/password/reset" 
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {errors.general && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Please wait..." : (mode === "signin" ? "Sign In" : "Create Account")}
              </button>
            </form>
          )}

          {/* Phone Authentication Form */}
          {authMethod === "phone" && (
            <div className="space-y-5">
              {!phoneCodeSent ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setPhoneFocused(true)}
                      onBlur={() => setPhoneFocused(false)}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={sendPhoneCode}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-center text-2xl tracking-widest font-mono ${
                        errors.phoneCode 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                      maxLength={6}
                      required
                    />
                    {errors.phoneCode && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                        {errors.phoneCode}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 text-center">
                      We sent a 6-digit code to {phone}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={verifyPhoneCode}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Verifying..." : "Verify Code"}
                    </button>
                    <button
                      onClick={() => {
                        setPhoneCodeSent(false);
                        setPhoneCode("");
                        setErrors({});
                      }}
                      className="px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200"
                    >
                      Change
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Terms and Privacy */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
