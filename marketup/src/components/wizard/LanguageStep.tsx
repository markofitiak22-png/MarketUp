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
    flag: '🇺🇸',
    voices: [
      { id: 'sarah_en', name: 'Sarah', gender: 'female' as const, accent: 'American', tone: 'professional' as const },
      { id: 'michael_en', name: 'Michael', gender: 'male' as const, accent: 'American', tone: 'energetic' as const },
      { id: 'emma_en', name: 'Emma', gender: 'female' as const, accent: 'British', tone: 'calm' as const },
      { id: 'david_en', name: 'David', gender: 'male' as const, accent: 'British', tone: 'expressive' as const }
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    voices: [
      { id: 'maria_es', name: 'María', gender: 'female' as const, accent: 'Castilian', tone: 'professional' as const },
      { id: 'carlos_es', name: 'Carlos', gender: 'male' as const, accent: 'Castilian', tone: 'energetic' as const },
      { id: 'ana_es', name: 'Ana', gender: 'female' as const, accent: 'Mexican', tone: 'calm' as const },
      { id: 'jose_es', name: 'José', gender: 'male' as const, accent: 'Mexican', tone: 'expressive' as const }
    ]
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    voices: [
      { id: 'marie_fr', name: 'Marie', gender: 'female' as const, accent: 'Parisian', tone: 'professional' as const },
      { id: 'pierre_fr', name: 'Pierre', gender: 'male' as const, accent: 'Parisian', tone: 'energetic' as const }
    ]
  },
  {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    voices: [
      { id: 'anna_de', name: 'Anna', gender: 'female' as const, accent: 'Standard', tone: 'calm' as const },
      { id: 'klaus_de', name: 'Klaus', gender: 'male' as const, accent: 'Standard', tone: 'professional' as const }
    ]
  },
  {
    code: 'it',
    name: 'Italian',
    flag: '🇮🇹',
    voices: [
      { id: 'giulia_it', name: 'Giulia', gender: 'female' as const, accent: 'Standard', tone: 'expressive' as const },
      { id: 'marco_it', name: 'Marco', gender: 'male' as const, accent: 'Standard', tone: 'energetic' as const }
    ]
  },
  {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    voices: [
      { id: 'sofia_pt', name: 'Sofia', gender: 'female' as const, accent: 'European', tone: 'calm' as const },
      { id: 'joao_pt', name: 'João', gender: 'male' as const, accent: 'European', tone: 'professional' as const }
    ]
  }
];

const getToneFilters = (translations: any) => [
  { id: 'all', name: translations.studioAllTones, icon: '🎵' },
  { id: 'professional', name: translations.studioProfessional, icon: '💼' },
  { id: 'energetic', name: translations.studioEnergetic, icon: '⚡' },
  { id: 'calm', name: translations.studioCalm, icon: '🌊' },
  { id: 'expressive', name: translations.studioExpressive, icon: '🎭' }
];

export default function LanguageStep({ data, onUpdate, onNext, onPrev }: LanguageStepProps) {
  const { translations } = useTranslations();
  const [selectedLanguage, setSelectedLanguage] = useState(data.language?.code || '');
  const [selectedVoice, setSelectedVoice] = useState(data.language?.voice.id || '');
  const [selectedTone, setSelectedTone] = useState('all');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  
  const toneFilters = getToneFilters(translations);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language.code);
    setSelectedVoice(''); // Reset voice selection
    onUpdate({
      language: null // Clear previous selection
    });
  };

  const handleVoiceSelect = (voice: typeof languages[0]['voices'][0]) => {
    setSelectedVoice(voice.id);
    const language = languages.find(l => l.code === selectedLanguage);
    if (language) {
      onUpdate({
        language: {
          code: language.code,
          name: language.name,
          voice: {
            id: voice.id,
            name: voice.name,
            gender: voice.gender,
            accent: voice.accent || 'neutral',
            tone: voice.tone || 'professional'
          }
        }
      });
    }
  };

  const playVoicePreview = (voiceId: string) => {
    setPlayingVoice(voiceId);
    // Simulate audio playback
    setTimeout(() => setPlayingVoice(null), 2000);
  };

  // Get filtered voices based on selected language and tone
  const getFilteredVoices = () => {
    const language = languages.find(l => l.code === selectedLanguage);
    if (!language) return [];
    
    return language.voices.filter(voice => 
      selectedTone === 'all' || voice.tone === selectedTone
    );
  };

  const handleNext = () => {
    if (selectedLanguage && selectedVoice) {
      onNext();
    }
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          {translations.studioLanguageVoice}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioChooseLanguageVoice} <span className="text-accent font-medium">{translations.studioPreviewEachVoice}</span>
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

      {/* Voice Selection */}
      {currentLanguage && (
        <div className="max-w-5xl mx-auto">
          <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
            
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioChooseVoice}</h3>
            
            {/* Tone Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {toneFilters.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTone === tone.id
                      ? 'bg-accent-2 text-white'
                      : 'bg-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <span className="mr-2">{tone.icon}</span>
                  {tone.name}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFilteredVoices().map((voice) => (
                <div
                  key={voice.id}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    selectedVoice === voice.id
                      ? 'border-accent-2 bg-accent-2/10 shadow-lg shadow-accent-2/20 scale-105'
                      : 'border-[var(--border)] hover:border-accent-2/50 hover:bg-accent-2/5 hover:scale-102'
                  }`}
                  onClick={() => handleVoiceSelect(voice)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-2/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-2xl">
                          {voice.gender === 'female' ? '👩' : '👨'}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-lg">{voice.name}</div>
                        <div className="text-sm text-foreground-muted">{voice.accent}</div>
                        <div className="text-xs text-accent-2 font-medium capitalize">{voice.tone}</div>
                      </div>
                    </div>
                    
                    {selectedVoice === voice.id && (
                      <div className="w-6 h-6 bg-gradient-to-br from-accent-2 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoicePreview(voice.id);
                    }}
                    disabled={playingVoice === voice.id}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface-elevated hover:bg-surface transition-colors disabled:opacity-50"
                  >
                    {playingVoice === voice.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-accent-2 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">{translations.studioPlaying}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">{translations.studioPreview}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {data.language && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
            
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioSelectedVoice}</h3>
            <div className="flex items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <span className="text-3xl">
                  {data.language.voice.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{data.language.voice.name}</div>
                <div className="text-lg text-foreground-muted">{data.language.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          disabled={!selectedLanguage || !selectedVoice}
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
