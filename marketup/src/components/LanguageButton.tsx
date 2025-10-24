"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import type { Language } from "@/lib/i18n";

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "ar" as Language, name: "العربية", flag: "🇦🇪" },
  { code: "sv" as Language, name: "Svenska", flag: "🇸🇪" },
  { code: "tr" as Language, name: "Türkçe", flag: "🇹🇷" },
  { code: "uk" as Language, name: "Українська", flag: "🇺🇦" }
];

export default function LanguageButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { language, changeLanguage, isInitialized } = useTranslations();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isInitialized) {
      const currentLang = languages.find(lang => lang.code === language);
      if (currentLang) {
        setSelectedLang(currentLang);
      }
    }
  }, [language, isInitialized]);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLang(language);
    setIsOpen(false);
    changeLanguage(language.code);
  };

  // Show loading state while language is being initialized
  if (!isInitialized) {
    return (
      <div className="relative" ref={ref}>
        <button
          ref={buttonRef}
          disabled
          className="flex items-center gap-1 px-1.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] opacity-50"
          aria-label="Loading language"
        >
          <div className="w-3 h-3 border border-accent/30 border-t-accent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-foreground hidden xl:inline">
            ...
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] hover:bg-accent/5 transition-colors duration-200"
        aria-label="Select language"
      >
        <span className="text-sm">{selectedLang.flag}</span>
        <span className="text-xs font-medium text-foreground hidden xl:inline">
          {selectedLang.code.toUpperCase()}
        </span>
        <svg 
          className={`w-3 h-3 text-foreground-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="fixed w-40 rounded-lg glass p-1.5 shadow-xl border border-[var(--border)]"
          style={{ 
            zIndex: 9999,
            top: buttonRect ? `${buttonRect.bottom + 8}px` : '80px',
            right: buttonRect ? `${window.innerWidth - buttonRect.right}px` : '16px'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md hover:bg-accent/10 transition-colors duration-200 ${
                selectedLang.code === lang.code ? 'bg-accent/15' : ''
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span className="text-xs font-medium text-foreground">{lang.name}</span>
              {selectedLang.code === lang.code && (
                <svg className="w-3 h-3 text-accent ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
