"use client";
import { useState } from "react";

interface ProfileClientProps {
  initialData: {
    name: string | null;
    email: string | null;
    locale: string | null;
    country: string | null;
  };
}

export default function ProfileClient({ initialData }: ProfileClientProps) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Hero Profile Header */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Avatar Section */}
              <div className="relative">
                <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-accent via-accent-2 to-purple-500 flex items-center justify-center shadow-2xl">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {formData.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full border-2 sm:border-4 border-background flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                  {formData.name || "Anonymous User"}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-foreground-muted mb-3 sm:mb-4">{formData.email}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-foreground-muted">
                  <span className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-accent/10 flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    {formData.country || "Not set"}
                  </span>
                  <span className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-accent-2/10 flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-accent-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    </div>
                    {formData.locale || "Not set"}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 overflow-hidden w-full sm:w-auto ${
                    isEditing 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:scale-105" 
                      : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:scale-105"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    {isEditing ? (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </>
                    )}
                  </span>
                  {!isEditing && (
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Personal Information</h2>
                </div>
            
                <form className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none opacity-50 cursor-not-allowed text-sm sm:text-base lg:text-lg"
                        placeholder="Enter your email"
                      />
                      <p className="text-xs sm:text-sm text-foreground-muted">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-base sm:text-lg font-bold text-foreground">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 resize-none text-sm sm:text-base lg:text-lg"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                      >
                        <option value="">Select your country</option>
                        <option value="US">🇺🇸 United States</option>
                        <option value="SE">🇸🇪 Sweden</option>
                        <option value="AE">🇦🇪 United Arab Emirates</option>
                        <option value="TR">🇹🇷 Turkey</option>
                        <option value="GB">🇬🇧 United Kingdom</option>
                        <option value="DE">🇩🇪 Germany</option>
                        <option value="FR">🇫🇷 France</option>
                        <option value="CA">🇨🇦 Canada</option>
                        <option value="AU">🇦🇺 Australia</option>
                        <option value="JP">🇯🇵 Japan</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Language
                      </label>
                      <select
                        value={formData.locale}
                        onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                      >
                        <option value="">Select your language</option>
                        <option value="en">🇺🇸 English</option>
                        <option value="sv">🇸🇪 Swedish</option>
                        <option value="ar">🇦🇪 Arabic</option>
                        <option value="tr">🇹🇷 Turkish</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-base sm:text-lg font-bold text-foreground">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base lg:text-lg"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative btn-primary btn-lg px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                          {saving ? (
                            <>
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save Changes
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={saving}
                        className="btn-outline btn-lg px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Profile Stats</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base lg:text-lg text-foreground-muted">Profile Completion</span>
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">75%</span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-2 sm:h-3">
                      <div className="bg-gradient-to-r from-accent to-accent-2 h-2 sm:h-3 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4">
                    <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent/5 to-accent-2/5">
                      <div className="text-2xl sm:text-3xl font-bold text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">0</div>
                      <div className="text-xs sm:text-sm text-foreground-muted font-medium">Videos</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent-2/5 to-purple-500/5">
                      <div className="text-2xl sm:text-3xl font-bold text-gradient bg-gradient-to-r from-accent-2 to-purple-500 bg-clip-text text-transparent">0</div>
                      <div className="text-xs sm:text-sm text-foreground-muted font-medium">Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent-2/10 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Account Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-surface-elevated transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-foreground text-sm sm:text-base lg:text-lg">Change Password</div>
                        <div className="text-xs sm:text-sm text-foreground-muted">Update your password</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-surface-elevated transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-foreground text-sm sm:text-base lg:text-lg">Two-Factor Auth</div>
                        <div className="text-xs sm:text-sm text-foreground-muted">Add extra security</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-red-500/10 transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-red-400 text-sm sm:text-base lg:text-lg group-hover:text-red-300">Delete Account</div>
                        <div className="text-xs sm:text-sm text-foreground-muted">Permanently delete account</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground-muted group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
