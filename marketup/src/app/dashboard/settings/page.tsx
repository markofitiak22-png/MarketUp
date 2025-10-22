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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-elevated rounded-3xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded mb-4"></div>
            <div className="h-4 bg-surface rounded w-2/3"></div>
          </div>
        </div>
        <div className="glass-elevated rounded-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-surface rounded"></div>
            <div className="h-16 bg-surface rounded"></div>
            <div className="h-16 bg-surface rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 rounded-3xl" />
        
        <div className="relative glass-elevated rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-lg text-foreground-muted">Manage your account preferences and settings</p>
                {userData && (
                  <p className="text-sm text-foreground-muted mt-1">
                    Member since {userData.memberSince}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* User Information */}
      {userData && (
        <div className="glass-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Account Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={userData.name || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <select
                  value={userData.country || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, country: e.target.value } : null)}
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
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
                <label className="block text-sm font-medium text-foreground mb-2">Member Since</label>
                <input
                  type="text"
                  value={userData.memberSince}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground-muted cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586-2.586A2 2 0 018.828 4h8.586a2 2 0 011.414.586L21.172 7H4.828zM4 7v10a2 2 0 002 2h12a2 2 0 002-2V7H4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          {[
            {
              key: 'email',
              title: 'Email Notifications',
              description: 'Receive notifications via email',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              key: 'push',
              title: 'Push Notifications',
              description: 'Receive push notifications in your browser',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586-2.586A2 2 0 018.828 4h8.586a2 2 0 011.414.586L21.172 7H4.828zM4 7v10a2 2 0 002 2h12a2 2 0 002-2V7H4z" />
                </svg>
              )
            },
            {
              key: 'marketing',
              title: 'Marketing Emails',
              description: 'Receive updates about new features and tips',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              )
            },
            {
              key: 'updates',
              title: 'Product Updates',
              description: 'Get notified about new features and improvements',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-elevated transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center text-foreground-muted">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground-muted">{item.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                  onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-surface border border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Remember Me Settings */}
      <RememberMeSettings />

      {/* Privacy */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Privacy & Security</h2>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface-elevated">
            <h3 className="font-semibold text-foreground mb-2">Profile Visibility</h3>
            <p className="text-sm text-foreground-muted mb-4">Control who can see your profile information</p>
            <select
              value={settings.privacy.profile}
              onChange={(e) => handlePrivacyChange('profile', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all duration-200"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'analytics',
                title: 'Analytics',
                description: 'Help us improve by sharing anonymous usage data',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                key: 'dataSharing',
                title: 'Data Sharing',
                description: 'Allow sharing data with third-party partners',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                )
              }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-elevated transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center text-foreground-muted">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-foreground-muted">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                    onChange={(e) => handlePrivacyChange(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-surface border border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-elevated rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Preferences</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              key: 'theme',
              label: 'Theme',
              options: [
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'auto', label: 'Auto' }
              ],
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )
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
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              )
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
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              key: 'dateFormat',
              label: 'Date Format',
              options: [
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
              ],
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            }
          ].map((item) => (
            <div key={item.key} className="p-4 rounded-xl bg-surface-elevated">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-foreground-muted">
                  {item.icon}
                </div>
                <label className="font-semibold text-foreground">{item.label}</label>
              </div>
              <select
                value={settings.preferences[item.key as keyof typeof settings.preferences]}
                onChange={(e) => handlePreferenceChange(item.key, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light transition-all duration-200"
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
      <div className="glass-elevated rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Danger Zone</h2>
        </div>
        
        <div className="space-y-4">
          {[
            {
              title: 'Export Data',
              description: 'Download a copy of your data',
              buttonText: 'Export',
              buttonClass: 'px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors font-semibold',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            },
            {
              title: 'Delete Account',
              description: 'Permanently delete your account and all data',
              buttonText: 'Delete Account',
              buttonClass: 'px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-semibold',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )
            }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-foreground-muted">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground-muted">{item.description}</p>
                </div>
              </div>
              <button 
                className={item.buttonClass}
                onClick={() => {
                  if (item.title === 'Export Data') {
                    // TODO: Implement data export
                    alert('Data export feature coming soon!');
                  } else if (item.title === 'Delete Account') {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // TODO: Implement account deletion
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
  );
}
