"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslations, type Language, type Translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  changeLanguage: (newLanguage: Language) => void;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(getTranslations('en'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get language from localStorage or detect from browser
    const getInitialLanguage = (): Language => {
      if (typeof window === 'undefined') return 'en';
      
      // Check if user has manually set a language preference
      const stored = localStorage.getItem('preferredLanguage') as Language;
      if (stored && ['en', 'ar', 'sv', 'tr', 'uk', 'de', 'fr'].includes(stored)) {
        return stored;
      }
      
      // Auto-detect browser language for first-time visitors
      const browserLang = navigator.language.split('-')[0] as Language;
      if (browserLang && ['en', 'ar', 'sv', 'tr', 'uk', 'de', 'fr'].includes(browserLang)) {
        // Save the detected language for future visits
        localStorage.setItem('preferredLanguage', browserLang);
        return browserLang;
      }
      
      return 'en';
    };

    const currentLang = getInitialLanguage();
    setLanguage(currentLang);
    setTranslations(getTranslations(currentLang));
    setIsInitialized(true);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setTranslations(getTranslations(newLanguage));
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      translations,
      changeLanguage,
      isInitialized,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Backward compatibility
export function useTranslations() {
  return useLanguage();
}
