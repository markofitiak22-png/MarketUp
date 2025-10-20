"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-elevated rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-foreground-muted">Manage your account preferences and settings</p>
      </div>

      {/* Notifications */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Notifications</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Email Notifications</h3>
              <p className="text-sm text-foreground-muted">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Push Notifications</h3>
              <p className="text-sm text-foreground-muted">Receive push notifications in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Marketing Emails</h3>
              <p className="text-sm text-foreground-muted">Receive updates about new features and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.marketing}
                onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Product Updates</h3>
              <p className="text-sm text-foreground-muted">Get notified about new features and improvements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.updates}
                onChange={(e) => handleNotificationChange('updates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Privacy & Security</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Profile Visibility</h3>
            <p className="text-sm text-foreground-muted mb-3">Control who can see your profile information</p>
            <select
              value={settings.privacy.profile}
              onChange={(e) => handlePrivacyChange('profile', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-foreground-muted">Help us improve by sharing anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Data Sharing</h3>
              <p className="text-sm text-foreground-muted">Allow sharing data with third-party partners</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.dataSharing}
                onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-elevated rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Theme
            </label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            >
              <option value="en">English</option>
              <option value="uk">Українська</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Kiev">Kiev</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Date Format
            </label>
            <select
              value={settings.preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border-strong bg-surface-elevated text-foreground focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-elevated rounded-2xl p-8 border border-error/20">
        <h2 className="text-xl font-bold text-foreground mb-6">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Export Data</h3>
              <p className="text-sm text-foreground-muted">Download a copy of your data</p>
            </div>
            <button className="btn-outline px-4 py-2">
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Delete Account</h3>
              <p className="text-sm text-foreground-muted">Permanently delete your account and all data</p>
            </div>
            <button className="text-error hover:text-error/80 px-4 py-2 border border-error/20 rounded-lg hover:bg-error/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
