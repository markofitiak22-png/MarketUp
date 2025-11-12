"use client";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface ProfileClientProps {
  initialData: {
    name: string | null;
    email: string | null;
    locale: string | null;
    country: string | null;
  };
  userStats: {
    videoCount: number;
    approvedReferrals: number;
    totalReferrals: number;
    profileCompletion: number;
    memberSince: Date | null | undefined;
  };
}

export default function ProfileClient({ initialData, userStats }: ProfileClientProps) {
  const { translations } = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    bio: "",
    company: "",
    website: "",
    country: initialData.country || "",
    locale: initialData.locale || "",
  });

  // Debug log to see what data we received
  console.log("ProfileClient - Initial data:", initialData);
  console.log("ProfileClient - Form data:", formData);

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSend = {
        name: formData.name,
        country: formData.country,
        locale: formData.locale,
      };
      
      console.log("ProfileClient - Sending data:", dataToSend);
      
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile updated successfully:", result);
        setIsEditing(false);
        // Show success message or toast
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", response.status, errorData);
        alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
      {/* Shared background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top left blob */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Top right blob */}
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Middle left blob */}
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Middle right blob */}
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Bottom left blob */}
        <div className="absolute top-[80%] left-[15%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Bottom right blob */}
        <div className="absolute top-[90%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Additional connecting blobs */}
        <div className="absolute top-[35%] left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[45%] right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[70%] left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[75%] right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header Section with Badge */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
            <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="hidden sm:block w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-xs sm:text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>Profile</span>
            </div>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-indigo-500" />
            <div className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="text-center mb-4 sm:mb-8">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {formData.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-[#0b0b0b] flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              {formData.name || translations.profileAnonymousUser}
            </h1>
            <p className="text-sm sm:text-base text-white/60 mb-3 sm:mb-4">{formData.email}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-lg">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-white/80">{formData.country || translations.profileNotSet}</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/60 rounded-lg">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-white/80">{formData.locale || translations.profileNotSet}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Profile Completion - Large Card */}
          <div className="sm:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.profileProfileCompletion}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {userStats.profileCompletion}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <div className="w-full bg-slate-800/40 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${userStats.profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10 text-center">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
                  isEditing 
                    ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/40" 
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border border-indigo-500/30 hover:border-indigo-500/50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isEditing ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {translations.profileCancel}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {translations.profileEditProfile}
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.profilePersonalInformation}</h2>
                </div>
            
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileFullName}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                        placeholder={translations.profileEnterFullName}
                      />
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileEmailAddress}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white/60 placeholder-white/40 focus:outline-none opacity-50 cursor-not-allowed text-sm"
                        placeholder={translations.profileEnterEmail}
                      />
                      <p className="text-[10px] sm:text-xs text-white/50">{translations.profileEmailCannotBeChanged}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-white/80">
                      {translations.profileBio}
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 resize-none text-sm"
                      placeholder={translations.profileTellAboutYourself}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileCountry}
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                      >
                        <option value="">{translations.profileSelectCountry}</option>
                        <option value="US">United States</option>
                        <option value="SE">Sweden</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="TR">Turkey</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="JP">Japan</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileLanguage}
                      </label>
                      <select
                        value={formData.locale}
                        onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                      >
                        <option value="">{translations.profileSelectLanguage}</option>
                        <option value="en">English</option>
                        <option value="sv">Swedish</option>
                        <option value="ar">Arabic</option>
                        <option value="tr">Turkish</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileCompany}
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                        placeholder={translations.profileCompanyName}
                      />
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-white/80">
                        {translations.profileWebsite}
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                        placeholder={translations.profileWebsiteUrl}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700/60">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>{translations.profileSaving}</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {translations.profileSaveChanges}
                            </>
                          )}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-slate-600/60 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto transition-all duration-300"
                      >
                        {translations.profileCancel}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - Stats & Settings */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4">{translations.profileProfileStats}</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-800/40 border border-slate-700/60">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userStats.videoCount}</div>
                    <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-1">{translations.profileVideos}</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-lg bg-slate-800/40 border border-slate-700/60">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{userStats.approvedReferrals}</div>
                    <div className="text-[10px] sm:text-xs text-white/60 font-medium mt-1">Referrals</div>
                  </div>
                </div>
                
                {/* Member since */}
                {userStats.memberSince && (
                  <div className="pt-3 sm:pt-4 border-t border-slate-700/60 mt-3 sm:mt-4">
                    <div className="text-center">
                      <div className="text-[10px] sm:text-xs text-white/60 mb-1">Member since</div>
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-white">
                        {new Date(userStats.memberSince).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4">{translations.profileAccountSettings}</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-semibold text-white text-xs sm:text-sm truncate">{translations.profileChangePassword}</div>
                        <div className="text-[10px] sm:text-xs text-white/60 truncate">{translations.profileUpdatePassword}</div>
                      </div>
                    </div>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 hover:border-green-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-semibold text-white text-xs sm:text-sm truncate">{translations.profileTwoFactorAuth}</div>
                        <div className="text-[10px] sm:text-xs text-white/60 truncate">{translations.profileAddExtraSecurity}</div>
                      </div>
                    </div>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-green-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-semibold text-red-400 text-xs sm:text-sm group-hover:text-red-300 truncate">{translations.profileDeleteAccount}</div>
                        <div className="text-[10px] sm:text-xs text-white/60 truncate">{translations.profilePermanentlyDeleteAccount}</div>
                      </div>
                    </div>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
