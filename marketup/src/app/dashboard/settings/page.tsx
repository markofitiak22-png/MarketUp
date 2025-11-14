"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import RememberMeSettings from "@/components/RememberMeSettings";
import { useTranslations } from "@/hooks/useTranslations";

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
  const router = useRouter();
  const { translations } = useTranslations();
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const isInitialLoadRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Save settings automatically
  const saveSettings = useCallback(async (currentSettings: SettingsData, currentUserData: UserData | null) => {
    if (isInitialLoadRef.current) return; // Don't save on initial load
    
    try {
      setSaving(true);
      setSaveStatus('saving');
      const response = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: currentSettings,
          userData: currentUserData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchSettingsData().then(() => {
      isInitialLoadRef.current = false;
    });
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (isInitialLoadRef.current) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveSettings(settings, userData);
    }, 1000); // Debounce 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [settings, userData, saveSettings]);

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
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-3 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 bg-slate-800/40 rounded mb-4"></div>
                <div className="h-3 sm:h-4 bg-slate-800/40 rounded w-2/3"></div>
              </div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 mt-3 sm:mt-4 lg:mt-6">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-12 sm:h-16 bg-slate-800/40 rounded"></div>
                <div className="h-12 sm:h-16 bg-slate-800/40 rounded"></div>
                <div className="h-12 sm:h-16 bg-slate-800/40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>Settings</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              {translations.settingsTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.settingsManageAccountPreferences}</p>
            {userData && (
              <p className="text-xs sm:text-sm text-white/50 mt-2 sm:mt-3">
                {translations.settingsMemberSince} {userData.memberSince}
              </p>
            )}
          </div>
          </div>


        {/* Main Stats - Large Cards in Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Active Notifications - Large Card */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.settingsActiveNotifications}</h3>
                    <p className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mt-0.5 sm:mt-1">
                      {Object.values(settings.notifications).filter(Boolean).length} / {Object.keys(settings.notifications).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs sm:text-sm font-medium">
                  {settings.notifications.email ? 'Email' : ''} {settings.notifications.push ? 'Push' : ''} {settings.notifications.marketing ? 'Marketing' : ''} {settings.notifications.updates ? 'Updates' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Level - Compact Card */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  </div>
                  <div>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">{translations.settingsPrivacyLevel}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent capitalize">
                    {settings.privacy.profile}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-[10px] sm:text-xs text-white/50 mb-1.5 sm:mb-2">{translations.settingsProfileVisibility}</p>
                <div className="w-full bg-slate-800/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: settings.privacy.profile === 'public' ? '100%' : settings.privacy.profile === 'friends' ? '66%' : '33%' }}
                  />
        </div>
              </div>
            </div>
          </div>
            </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Left Column - Notifications Grid */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{translations.settingsNotifications}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  key: 'email',
                  title: translations.settingsEmailNotifications,
                  description: translations.settingsReceiveNotificationsViaEmail,
                      icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                },
                {
                  key: 'push',
                  title: translations.settingsPushNotifications,
                  description: translations.settingsReceivePushNotificationsInBrowser,
                      icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )
                },
                {
                  key: 'marketing',
                  title: translations.settingsMarketingEmails,
                  description: translations.settingsReceiveUpdatesAboutNewFeatures,
                      icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      )
                },
                {
                  key: 'updates',
                  title: translations.settingsProductUpdates,
                  description: translations.settingsGetNotifiedAboutNewFeatures,
                      icon: (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )
                }
              ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.title}</h3>
                          <p className="text-[10px] sm:text-xs text-white/60 leading-tight">{item.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-slate-700/60 border border-slate-600/60 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
                  </label>
                </div>
              ))}
              </div>
            </div>
      </div>

          {/* Right Column - Remember Me Settings */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl" />
              <div className="relative z-10">
      <RememberMeSettings />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Preferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Privacy */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.settingsPrivacySecurity}</h2>
            </div>
        
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-purple-500/40 transition-all duration-300">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">{translations.settingsProfileVisibility}</h3>
                <p className="text-[10px] sm:text-xs text-white/60 mb-3 sm:mb-4">{translations.settingsControlWhoCanSeeProfile}</p>
                <select
                  value={settings.privacy.profile}
                  onChange={(e) => handlePrivacyChange('profile', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm transition-all duration-300"
                >
                  <option value="public">{translations.settingsPublic}</option>
                  <option value="private">{translations.settingsPrivate}</option>
                  <option value="friends">{translations.settingsFriendsOnly}</option>
                </select>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    key: 'analytics',
                    title: translations.settingsAnalytics,
                    description: translations.settingsHelpUsImproveBySharing,
                    icon: (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  {
                    key: 'dataSharing',
                    title: translations.settingsDataSharing,
                    description: translations.settingsAllowSharingDataWithPartners,
                    icon: (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300 group">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.title}</h3>
                        <p className="text-[10px] sm:text-xs text-white/60 leading-tight">{item.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2">
                      <input
                        type="checkbox"
                        checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                        onChange={(e) => handlePrivacyChange(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-slate-700/60 border border-slate-600/60 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
      </div>

          {/* Preferences */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.settingsPreferences}</h2>
            </div>
        
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  key: 'theme',
                  label: translations.settingsTheme,
                  options: [
                    { value: 'dark', label: translations.settingsDark },
                    { value: 'light', label: translations.settingsLight },
                    { value: 'auto', label: translations.settingsAuto }
                  ],
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )
                },
                {
                  key: 'language',
                  label: translations.settingsLanguage,
                  options: [
                    { value: 'en', label: translations.settingsEnglish },
                    { value: 'uk', label: translations.settingsUkrainian },
                    { value: 'es', label: translations.settingsSpanish },
                    { value: 'fr', label: translations.settingsFrench }
                  ],
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  )
                },
                {
                  key: 'timezone',
                  label: translations.settingsTimezone,
                  options: [
                    { value: 'UTC', label: translations.settingsUTC },
                    { value: 'America/New_York', label: translations.settingsEasternTime },
                    { value: 'America/Los_Angeles', label: translations.settingsPacificTime },
                    { value: 'Europe/London', label: translations.settingsLondon },
                    { value: 'Europe/Kiev', label: translations.settingsKiev }
                  ],
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  key: 'dateFormat',
                  label: translations.settingsDateFormat,
                  options: [
                    { value: 'MM/DD/YYYY', label: translations.settingsMMDDYYYY },
                    { value: 'DD/MM/YYYY', label: translations.settingsDDMMYYYY },
                    { value: 'YYYY-MM-DD', label: translations.settingsYYYYMMDD }
                  ],
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                }
              ].map((item) => (
                <div key={item.key} className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-orange-500/40 transition-all duration-300 group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0">
                      {item.icon}
                    </div>
                    <label className="text-xs sm:text-sm font-semibold text-white">{item.label}</label>
                  </div>
                  <select
                    value={settings.preferences[item.key as keyof typeof settings.preferences]}
                    onChange={(e) => handlePreferenceChange(item.key, e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-white focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm transition-all duration-300"
                  >
                    {item.options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            </div>
      </div>

          {/* Danger Zone */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-red-500/30 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.settingsDangerZone}</h2>
            </div>
        
            <div className="space-y-2 sm:space-y-3">
              {[
                {
                  title: translations.settingsExportData,
                  description: translations.settingsDownloadCopyOfData,
                  buttonText: translations.settingsExport,
                  buttonClass: 'px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm',
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                {
                  title: translations.settingsDeleteAccount,
                  description: translations.settingsPermanentlyDeleteAccount,
                  buttonText: translations.settingsDeleteAccount,
                  buttonClass: 'px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm',
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl hover:border-red-500/40 hover:bg-slate-800/60 transition-all duration-300 group gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-white">{item.title}</h3>
                      <p className="text-[10px] sm:text-xs text-white/60">{item.description}</p>
                    </div>
                  </div>
                  <button 
                    className={item.buttonClass}
                    onClick={async () => {
                      if (item.title === translations.settingsExportData) {
                        alert(translations.settingsDataExportFeatureComingSoon);
                      } else if (item.title === translations.settingsDeleteAccount) {
                        const confirmed = confirm(
                          translations.settingsAreYouSureDeleteAccount || 
                          "Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
                        );
                        
                        if (confirmed) {
                          try {
                            const response = await fetch('/api/dashboard/account/delete', {
                              method: 'DELETE',
                              credentials: 'include',
                            });

                            const data = await response.json();

                            if (data.success) {
                              // Clear localStorage
                              localStorage.clear();
                              
                              // Sign out and redirect to home
                              await signOut({ 
                                callbackUrl: '/',
                                redirect: true 
                              });
                            } else {
                              alert(data.error || 'Failed to delete account. Please try again.');
                            }
                          } catch (error) {
                            console.error('Error deleting account:', error);
                            alert('An error occurred while deleting your account. Please try again.');
                          }
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
  );
}
