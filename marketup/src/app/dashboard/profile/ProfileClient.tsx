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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 rounded-3xl" />
        
        <div className="relative glass-elevated rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {formData.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {formData.name || "Anonymous User"}
              </h1>
              <p className="text-lg text-foreground-muted mb-1">{formData.email}</p>
              <div className="flex items-center gap-4 text-sm text-foreground-muted">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formData.country || "Not set"}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {formData.locale || "Not set"}
                </span>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isEditing 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" 
                    : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                }`}
              >
                {isEditing ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-elevated rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none opacity-50 cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                  <p className="text-xs text-foreground-muted">Email cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Language
                  </label>
                  <select
                    value={formData.locale}
                    onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <option value="">Select your language</option>
                    <option value="en">🇺🇸 English</option>
                    <option value="sv">🇸🇪 Swedish</option>
                    <option value="ar">🇦🇪 Arabic</option>
                    <option value="tr">🇹🇷 Turkish</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="btn-outline px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="glass-elevated rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Profile Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">Profile Completion</span>
                <span className="text-sm font-semibold text-accent">75%</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-xs text-foreground-muted">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-xs text-foreground-muted">Projects</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass-elevated rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-sm">Change Password</div>
                    <div className="text-xs text-foreground-muted">Update your password</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-sm">Two-Factor Auth</div>
                    <div className="text-xs text-foreground-muted">Add extra security</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-red-400 text-sm group-hover:text-red-300">Delete Account</div>
                    <div className="text-xs text-foreground-muted">Permanently delete account</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
