"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface LanguageStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦'
  },
  {
    code: 'sv',
    name: 'Swedish',
    flag: '🇸🇪'
  },
  {
    code: 'tr',
    name: 'Turkish',
    flag: '🇹🇷'
  },
  {
    code: 'de',
    name: 'German',
    flag: '🇩🇪'
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷'
  }
];

export default function LanguageStep({ data, onUpdate, onNext, onPrev }: LanguageStepProps) {
  const { translations } = useTranslations();
  const [selectedLanguage, setSelectedLanguage] = useState(data.language?.code || '');

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language.code);
    // Use voice from avatar (Marcus voice)
    const avatarVoice = data.avatar?.voice || {
      id: 'Ak9WvlDj5TXD6zyDtpXG',
      name: 'Marcus Voice',
      gender: 'male' as const,
      language: 'English'
    };
    
    onUpdate({
      language: {
        code: language.code,
        name: language.name,
        voice: {
          id: avatarVoice.id,
          name: avatarVoice.name,
          gender: avatarVoice.gender,
          accent: 'neutral',
          tone: 'professional' as const
        }
      }
    });
  };

  const handleNext = () => {
    if (selectedLanguage) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          {translations.studioSelectLanguage}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioChooseLanguage}
        </p>
      </div>

      {/* Language Selection */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">{translations.studioSelectLanguage}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`group relative p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-center ${
                  selectedLanguage === language.code
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20 scale-105'
                    : 'border-[var(--border)] hover:border-accent/50 hover:bg-accent/5 hover:scale-102'
                }`}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{language.flag}</div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">{language.name}</div>
                {selectedLanguage === language.code && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onPrev}
          className="group btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:bg-accent/5 transition-all duration-300 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedLanguage}
          className="group relative btn-primary btn-lg px-8 py-4 text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-3">
            {translations.studioContinue}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
