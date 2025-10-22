"use client";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇦🇪" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isDetecting, setIsDetecting] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    // Auto-detect browser language
    const detectLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = languages.find(lang => lang.code === browserLang);
      
      if (detectedLang) {
        setSelectedLang(detectedLang);
      }
      
      setIsDetecting(false);
    };

    detectLanguage();
  }, []);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLang(language);
    setIsOpen(false);
    
    // Store language preference
    localStorage.setItem('preferredLanguage', language.code);
    
    // You can add logic here to change the page language
    // For now, we'll just store the preference
  };

  if (isDetecting) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-elevated rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
            <span>Detecting language...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-elevated rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-surface-elevated transition-all duration-200"
        >
          <span className="text-2xl">{selectedLang.flag}</span>
          <span className="text-sm font-medium text-foreground">{selectedLang.name}</span>
          <svg 
            className={`w-4 h-4 text-foreground-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 glass-elevated rounded-xl py-2 min-w-[200px] shadow-lg">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-elevated transition-colors duration-200 ${
                  selectedLang.code === language.code ? 'bg-accent/10' : ''
                }`}
              >
                <span className="text-xl">{language.flag}</span>
                <span className="text-sm font-medium text-foreground">{language.name}</span>
                {selectedLang.code === language.code && (
                  <svg className="w-4 h-4 text-accent ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
