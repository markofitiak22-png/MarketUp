"use client";
import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
  phoneCode?: string;
  general?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  // const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Load remembered data on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedEmail && isRemembered) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError || undefined, password: passwordError || undefined });
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
        // Provide user-friendly error messages
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
        // Store remember me preference in localStorage
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }
        
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

  async function apple() {
    // Apple Sign In implementation
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
      // Simulate sending SMS code
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
      // Simulate phone verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/");
    } catch (e: any) {
      setErrors({ general: e.message || "Invalid verification code" });
    } finally {
      setLoading(false);
    }
  }

  // function continueAsGuest() {
  //   router.push("/");
  // }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-2/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-14 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-glow border border-accent/20 text-foreground text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
              <span>MarketUp</span>
              <div className="w-2 h-2 bg-gradient-to-r from-accent-2 to-purple-500 rounded-full animate-pulse" />
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] text-white mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}{" "}
              <span className="text-white">
                {mode === "signin" ? "to MarketUp" : "with MarketUp"}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light ">
              {mode === "signin" ? "Sign in to continue creating amazing videos" : "Join thousands of creators building with AI"}
            </p>
          </div>
        </section>

        {/* Auth Form Section */}
        <section className="pb-20 px-4">
          <div className="max-w-lg mx-auto">
            {/* Auth Form */}
            <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 relative overflow-hidden shadow-2xl transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-2/20 to-transparent rounded-tr-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-accent/5 to-accent-2/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  {/* Tab Navigation */}
                  <div className="relative mb-10 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10 shadow-inner">
                    <div className="relative flex">
                      <button
                        className={`flex-1 py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                          mode === "signin" 
                            ? "text-white" 
                            : "text-white/70 hover:text-white"
                        }`}
                        onClick={() => handleModeChange("signin")}
                      >
                        Sign In
                      </button>
                      <button
                        className={`flex-1 py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                          mode === "signup" 
                            ? "text-white" 
                            : "text-white/70 hover:text-white"
                        }`}
                        onClick={() => handleModeChange("signup")}
                      >
                        Sign Up
                      </button>
                    </div>
                    {/* Animated Background Slider */}
                    <div 
                      className={`absolute top-2 bottom-2 w-1/2 bg-gradient-to-r from-accent to-accent-2 rounded-xl shadow-lg transition-all duration-300 ${
                        mode === "signin" ? "left-2" : "left-1/2"
                      }`}
                    />
                  </div>

                  {/* Social Sign In Buttons */}
                  <div className="space-y-4 mb-8">
                    {/* Google Sign In */}
                    <button 
                      onClick={google} 
                      className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-base font-semibold text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform duration-300">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>

                    {/* Apple Sign In */}
                    <button 
                      onClick={apple} 
                      className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-black/20 backdrop-blur-sm text-white border border-white/20 rounded-2xl text-base font-semibold hover:bg-black/30 hover:border-white/30 transition-all duration-300 group"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-300">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-8">
                    <div className="flex-1 border-t border-white/20"></div>
                    <span className="px-4 text-sm text-white/70 font-medium">or</span>
                    <div className="flex-1 border-t border-white/20"></div>
                  </div>

                  {/* Authentication Method Selector */}
                  <div className="relative mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10 shadow-inner">
                    <div className="relative flex">
                      <button
                        className={`flex-1 py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                          authMethod === "email" 
                            ? "text-white" 
                            : "text-white/70 hover:text-white"
                        }`}
                        onClick={() => setAuthMethod("email")}
                      >
                        Email
                      </button>
                      <button
                        className={`flex-1 py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                          authMethod === "phone" 
                            ? "text-white" 
                            : "text-white/70 hover:text-white"
                        }`}
                        onClick={() => setAuthMethod("phone")}
                      >
                        Phone
                      </button>
                    </div>
                    {/* Animated Background Slider */}
                    <div 
                      className={`absolute top-2 bottom-2 w-1/2 bg-gradient-to-r from-accent to-accent-2 rounded-xl shadow-lg transition-all duration-300 ${
                        authMethod === "email" ? "left-2" : "left-1/2"
                      }`}
                    />
                  </div>

                  {/* Email/Password Form */}
                  {authMethod === "email" && (
                    <form onSubmit={(e) => { e.preventDefault(); submitEmailPassword(); }} className="space-y-6" noValidate>
                    {/* Email Field */}
                    <div className="space-y-3">
                      <label className="text-base font-semibold text-white">Email Address</label>
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        placeholder="you@company.com"
                        className={`w-full p-5 rounded-2xl border transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none text-base ${
                          errors.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-white/20 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                      <label className="text-base font-semibold text-white">
                        Password
                        {mode === "signup" && (
                          <span className="text-sm text-white/70 ml-2 font-normal">(min. 8 characters)</span>
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
                        className={`w-full p-5 rounded-2xl border transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none text-base ${
                          errors.password 
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-white/20 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                        }`}
                        required
                      />
                      {errors.password && (
                        <p className="text-sm text-red-400 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    {mode === "signin" && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 rounded border-white/20 text-accent focus:ring-accent focus:ring-2 opacity-0 absolute" 
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              rememberMe 
                                ? 'bg-accent border-accent' 
                                : 'border-white/20 group-hover:border-accent/50'
                            }`}>
                              {rememberMe && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-white/70 group-hover:text-white transition-colors">Remember me</span>
                        </label>
                        <a 
                          href="/password/reset" 
                          className="text-sm text-accent hover:text-accent-hover transition-colors"
                        >
                          Forgot password?
                        </a>
                      </div>
                    )}

                    {/* General Error Message */}
                    {errors.general && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {errors.general}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-5 font-bold rounded-2xl hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {loading ? "Please wait..." : (mode === "signin" ? "Sign In" : "Create Account")}
                      </button>
                    </div>
                  </form>
                  )}

                  {/* Phone Authentication Form */}
                  {authMethod === "phone" && (
                    <div className="space-y-6">
                      {!phoneCodeSent ? (
                        <>
                          {/* Phone Number Input */}
                          <div className="space-y-3">
                            <label className="text-base font-semibold text-white">Phone Number</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              onFocus={() => setPhoneFocused(true)}
                              onBlur={() => setPhoneFocused(false)}
                              placeholder="+1 (555) 123-4567"
                              className={`w-full p-5 rounded-2xl border transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none text-base ${
                                errors.phone 
                                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                  : 'border-white/20 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                              }`}
                              required
                            />
                            {errors.phone && (
                              <p className="text-sm text-red-400 font-medium">
                                {errors.phone}
                              </p>
                            )}
                          </div>

                          {/* Send Code Button */}
                          <button
                            onClick={sendPhoneCode}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-5 font-bold rounded-2xl hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          >
                            {loading ? "Sending..." : "Send Verification Code"}
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Verification Code Input */}
                          <div className="space-y-3">
                            <label className="text-base font-semibold text-white">Verification Code</label>
                            <input
                              type="text"
                              value={phoneCode}
                              onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="123456"
                              className={`w-full p-5 rounded-2xl border transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none text-center text-2xl tracking-widest ${
                                errors.phoneCode 
                                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                                  : 'border-white/20 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20'
                              }`}
                              maxLength={6}
                              required
                            />
                            {errors.phoneCode && (
                              <p className="text-sm text-red-400 font-medium">
                                {errors.phoneCode}
                              </p>
                            )}
                            <p className="text-sm text-white/70 text-center font-medium">
                              We sent a 6-digit code to {phone}
                            </p>
                          </div>

                          {/* Verify Code Button */}
                          <div className="flex gap-4">
                            <button
                              onClick={verifyPhoneCode}
                              disabled={loading}
                              className="flex-1 bg-gradient-to-r from-accent to-accent-2 text-white px-8 py-5 font-bold rounded-2xl hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                              {loading ? "Verifying..." : "Verify Code"}
                            </button>
                            <button
                              onClick={() => {
                                setPhoneCodeSent(false);
                                setPhoneCode("");
                                setErrors({});
                              }}
                              className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-5 font-semibold rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                            >
                              Change Number
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* General Error Message */}
                  {errors.general && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {errors.general}
                    </div>
                  )}

                  {/* Terms and Privacy */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/70">
                      By continuing, you agree to our{" "}
                      <a href="/terms" className="text-accent hover:text-accent-hover transition-colors">Terms of Service</a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-accent hover:text-accent-hover transition-colors">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}


