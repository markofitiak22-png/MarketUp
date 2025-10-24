"use client";
import { useState, useEffect } from "react";
import RememberMeSettings from "@/components/RememberMeSettings";

interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  locale: string | null;
  country: string | null;
  createdAt: Date;
  memberSince: string;
}

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    updates: boolean;
  };
  privacy: {
    profile: string;
    analytics: boolean;
    dataSharing: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: false,
      marketing: true,
      updates: true
    },
    privacy: {
      profile: "public",
      analytics: true,
      dataSharing: false
    },
    preferences: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings data
  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/settings');
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data.user);
        setSettings(data.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings,
          userData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-elevated rounded-2xl p-6 sm:p-8">
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 bg-surface rounded mb-4"></div>
                <div className="h-3 sm:h-4 bg-surface rounded w-2/3"></div>
              </div>
            </div>
            <div className="glass-elevated rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-12 sm:h-16 bg-surface rounded"></div>
                <div className="h-12 sm:h-16 bg-surface rounded"></div>
                <div className="h-12 sm:h-16 bg-surface rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Hero Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-3 sm:mb-4">
              Settings
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
              Manage your account preferences, notifications, and security settings
            </p>
            {userData && (
              <p className="text-sm sm:text-base text-foreground-muted mt-3 sm:mt-4">
                Member since {userData.memberSince}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* User Information */}
          {userData && (
            <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Account Information</h2>
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Email</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      disabled
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground-muted cursor-not-allowed text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Name</label>
                    <input
                      type="text"
                      value={userData.name || ''}
                      onChange={(e) => setUserData(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light text-sm sm:text-base transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Country</label>
                    <select
                      value={userData.country || ''}
                      onChange={(e) => setUserData(prev => prev ? { ...prev, country: e.target.value } : null)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light text-sm sm:text-base transition-all duration-300"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UA">Ukraine</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Member Since</label>
                    <input
                      type="text"
                      value={userData.memberSince}
                      disabled
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground-muted cursor-not-allowed text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
        </div>
      )}

          {/* Notifications */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                🔔
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Notifications</h2>
            </div>
        
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  key: 'email',
                  title: 'Email Notifications',
                  description: 'Receive notifications via email',
                  icon: '📧'
                },
                {
                  key: 'push',
                  title: 'Push Notifications',
                  description: 'Receive push notifications in your browser',
                  icon: '🔔'
                },
                {
                  key: 'marketing',
                  title: 'Marketing Emails',
                  description: 'Receive updates about new features and tips',
                  icon: '📢'
                },
                {
                  key: 'updates',
                  title: 'Product Updates',
                  description: 'Get notified about new features and improvements',
                  icon: '🔄'
                }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:bg-surface-elevated transition-all duration-300 hover:scale-[1.02] group">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-surface-elevated flex items-center justify-center text-sm sm:text-base lg:text-lg group-hover:scale-110 transition-transform flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm lg:text-base font-bold text-foreground truncate">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-foreground-muted leading-tight">{item.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 sm:w-12 sm:h-6 lg:w-16 lg:h-8 bg-surface border border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 lg:after:h-6 lg:after:w-6 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              ))}
            </div>
      </div>

      {/* Remember Me Settings */}
      <RememberMeSettings />

          {/* Privacy */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Privacy & Security</h2>
            </div>
        
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-surface-elevated hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 sm:mb-3">Profile Visibility</h3>
                <p className="text-xs sm:text-sm text-foreground-muted mb-4 sm:mb-6">Control who can see your profile information</p>
                <select
                  value={settings.privacy.profile}
                  onChange={(e) => handlePrivacyChange('profile', e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light text-sm sm:text-base transition-all duration-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    key: 'analytics',
                    title: 'Analytics',
                    description: 'Help us improve by sharing anonymous usage data',
                    icon: '📊'
                  },
                  {
                    key: 'dataSharing',
                    title: 'Data Sharing',
                    description: 'Allow sharing data with third-party partners',
                    icon: '🤝'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:bg-surface-elevated transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-surface-elevated flex items-center justify-center text-sm sm:text-base lg:text-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-foreground truncate">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-foreground-muted leading-tight">{item.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                      <input
                        type="checkbox"
                        checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                        onChange={(e) => handlePrivacyChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 sm:w-12 sm:h-6 lg:w-16 lg:h-8 bg-surface border border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 lg:after:h-6 lg:after:w-6 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
      </div>

          {/* Preferences */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Preferences</h2>
            </div>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  key: 'theme',
                  label: 'Theme',
                  options: [
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                    { value: 'auto', label: 'Auto' }
                  ],
                  icon: '🌙'
                },
                {
                  key: 'language',
                  label: 'Language',
                  options: [
                    { value: 'en', label: 'English' },
                    { value: 'uk', label: 'Українська' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' }
                  ],
                  icon: '🌍'
                },
                {
                  key: 'timezone',
                  label: 'Timezone',
                  options: [
                    { value: 'UTC', label: 'UTC' },
                    { value: 'America/New_York', label: 'Eastern Time' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time' },
                    { value: 'Europe/London', label: 'London' },
                    { value: 'Europe/Kiev', label: 'Kiev' }
                  ],
                  icon: '🕐'
                },
                {
                  key: 'dateFormat',
                  label: 'Date Format',
                  options: [
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ],
                  icon: '📅'
                }
              ].map((item) => (
                <div key={item.key} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-surface-elevated hover:scale-[1.02] transition-all duration-300 group">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <label className="text-sm sm:text-base font-bold text-foreground">{item.label}</label>
                  </div>
                  <select
                    value={settings.preferences[item.key as keyof typeof settings.preferences]}
                    onChange={(e) => handlePreferenceChange(item.key, e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light text-sm sm:text-base transition-all duration-300"
                  >
                    {item.options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
      </div>

          {/* Danger Zone */}
          <div className="glass-elevated rounded-2xl p-6 sm:p-8 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group border border-red-500/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform">
                ⚠️
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Danger Zone</h2>
            </div>
        
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  title: 'Export Data',
                  description: 'Download a copy of your data',
                  buttonText: 'Export',
                  buttonClass: 'px-4 sm:px-6 py-2 sm:py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl sm:rounded-2xl hover:bg-blue-500/20 transition-all duration-300 font-bold text-sm sm:text-base hover:scale-105',
                  icon: '📥'
                },
                {
                  title: 'Delete Account',
                  description: 'Permanently delete your account and all data',
                  buttonText: 'Delete Account',
                  buttonClass: 'px-4 sm:px-6 py-2 sm:py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl sm:rounded-2xl hover:bg-red-500/20 transition-all duration-300 font-bold text-sm sm:text-base hover:scale-105',
                  icon: '🗑️'
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-surface-elevated border border-border hover:scale-[1.02] transition-all duration-300 group gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-foreground-muted">{item.description}</p>
                    </div>
                  </div>
                  <button 
                    className={item.buttonClass}
                    onClick={() => {
                      if (item.title === 'Export Data') {
                        alert('Data export feature coming soon!');
                      } else if (item.title === 'Delete Account') {
                        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                          alert('Account deletion feature coming soon!');
                        }
                      }
                    }}
                  >
                    {item.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
