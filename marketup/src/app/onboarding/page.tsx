"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

type OnboardingStep = "country" | "language" | "background";

interface OnboardingData {
  country: string;
  language: string;
  backgroundImageUrl: string | null;
  videoImageUrl: string | null;
}

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { translations } = useTranslations();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("country");
  const [data, setData] = useState<OnboardingData>({
    country: "",
    language: "",
    backgroundImageUrl: null,
    videoImageUrl: null,
  });
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (session === null) {
      router.push("/auth");
    }
  }, [session, router]);

  // Fetch user subscription
  useEffect(() => {
    if (session) {
      fetch("/api/dashboard/overview", { credentials: "include" })
        .then((res) => res.json())
        .then((response) => {
          if (response.success && response.data.subscription) {
            setSubscriptionTier(response.data.subscription.tier);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleCountrySelect = (countryCode: string) => {
    setData((prev) => ({ ...prev, country: countryCode }));
  };

  const handleLanguageSelect = (languageCode: string) => {
    setData((prev) => ({ ...prev, language: languageCode }));
  };

  const handleBackgroundUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "background");

      const response = await fetch("/api/onboarding/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.requiresUpgrade) {
          alert("Custom background upload is only available for Pro and Premium plans. Please upgrade your plan.");
        } else {
          throw new Error(errorData.error || "Upload failed");
        }
        return;
      }

      const result = await response.json();
      setData((prev) => ({ ...prev, backgroundImageUrl: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload background image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "video-image");

      const response = await fetch("/api/onboarding/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setData((prev) => ({ ...prev, videoImageUrl: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === "country" && data.country) {
      setCurrentStep("language");
    } else if (currentStep === "language" && data.language) {
      setCurrentStep("background");
    } else if (currentStep === "background") {
      // Save onboarding data and redirect to studio
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep === "language") {
      setCurrentStep("country");
    } else if (currentStep === "background") {
      setCurrentStep("language");
    }
  };

  const handleSkip = () => {
    if (currentStep === "background") {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data to user profile
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      // Redirect to studio
      router.push("/studio");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Still redirect even if save fails
      router.push("/studio");
    }
  };

  const canUploadCustomBackground = subscriptionTier !== null && subscriptionTier !== "BASIC";

  // Show loading or redirect if not authenticated
  if (session === null) {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                <span>
                  Step{" "}
                  {currentStep === "country"
                    ? 1
                    : currentStep === "language"
                    ? 2
                    : 3}{" "}
                  of 3
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>

            {/* Step 1: Country Selection */}
            {currentStep === "country" && (
              <div className="space-y-8">
                <div className="text-center px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
                    <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                      Select Your Country
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                    Choose your country to personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center ${
                        data.country === country.code
                          ? "border-indigo-500/60 bg-slate-800/80 shadow-xl shadow-indigo-500/20 scale-[1.02]"
                          : "border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40 hover:bg-slate-800/60 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl mb-2">
                        {country.flag}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {country.name}
                      </div>
                      {data.country === country.code && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNext}
                    disabled={!data.country}
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    Continue
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Language Selection */}
            {currentStep === "language" && (
              <div className="space-y-8">
                <div className="text-center px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
                    <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                      Select Your Language
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                    Choose your preferred language
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center ${
                        data.language === language.code
                          ? "border-indigo-500/60 bg-slate-800/80 shadow-xl shadow-indigo-500/20 scale-[1.02]"
                          : "border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40 hover:bg-slate-800/60 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl mb-2">
                        {language.flag}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {language.name}
                      </div>
                      {data.language === language.code && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleBack}
                    className="px-8 py-4 text-lg font-semibold bg-[#1a1a1a] hover:bg-[#222222] text-white rounded-full transition-all duration-300 border border-[#3a3a3a] flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!data.language}
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    Continue
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Background Selection */}
            {currentStep === "background" && (
              <div className="space-y-8">
                <div className="text-center px-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
                    <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                      Choose a Background
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                    Upload custom background images or skip this step
                  </p>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 space-y-6">
                  {/* Custom Background Upload */}
                  {canUploadCustomBackground ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Upload Custom Background
                      </h3>
                      <div className="border-2 border-dashed border-slate-700/60 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          id="background-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleBackgroundUpload(file);
                            }
                          }}
                          disabled={uploading}
                        />
                        <label
                          htmlFor="background-upload"
                          className={`cursor-pointer inline-flex flex-col items-center gap-3 ${
                            uploading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <svg
                            className="w-12 h-12 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="text-white font-medium">
                            {uploading
                              ? "Uploading..."
                              : "Click to upload background image"}
                          </span>
                        </label>
                        {data.backgroundImageUrl && (
                          <div className="mt-4">
                            <img
                              src={data.backgroundImageUrl}
                              alt="Uploaded background"
                              className="max-w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-amber-300 text-sm">
                        Custom background upload is available for Pro and Premium
                        plans. Upgrade to unlock this feature.
                      </p>
                    </div>
                  )}

                  {/* Video Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Upload Image for Video (Optional)
                    </h3>
                    <p className="text-sm text-white/60">
                      Add an image that will appear inside the video for
                      visual/marketing purposes
                    </p>
                    <div className="border-2 border-dashed border-slate-700/60 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="video-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleVideoImageUpload(file);
                          }
                        }}
                        disabled={uploading}
                      />
                      <label
                        htmlFor="video-image-upload"
                        className={`cursor-pointer inline-flex flex-col items-center gap-3 ${
                          uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <svg
                          className="w-12 h-12 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-white font-medium">
                          {uploading
                            ? "Uploading..."
                            : "Click to upload image for video"}
                        </span>
                      </label>
                      {data.videoImageUrl && (
                        <div className="mt-4">
                          <img
                            src={data.videoImageUrl}
                            alt="Uploaded video image"
                            className="max-w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleBack}
                    className="px-8 py-4 text-lg font-semibold bg-[#1a1a1a] hover:bg-[#222222] text-white rounded-full transition-all duration-300 border border-[#3a3a3a] flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-8 py-4 text-lg font-semibold bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-full transition-all duration-300 border border-slate-700/60 flex items-center gap-3"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center gap-3"
                  >
                    Continue
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

