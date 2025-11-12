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
          gender: avatarVoice.gender === 'neutral' ? 'male' : avatarVoice.gender, // Convert 'neutral' to 'male'
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
      {/* Language Selection */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">{translations.studioSelectLanguage}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`group relative p-3 sm:p-4 lg:p-5 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center ${
                  selectedLanguage === language.code
                    ? 'border-indigo-500/60 bg-slate-800/80 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                    : 'border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40 hover:bg-slate-800/60 hover:scale-[1.01]'
                }`}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{language.flag}</div>
                <div className="text-xs sm:text-sm font-semibold text-white">{language.name}</div>
                {selectedLanguage === language.code && (
                  <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        <button
          onClick={onPrev}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#1a1a1a] hover:bg-[#222222] text-white rounded-full transition-all duration-300 border border-[#3a3a3a] flex items-center gap-2 sm:gap-3"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedLanguage}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3"
        >
          {translations.studioContinue}
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
