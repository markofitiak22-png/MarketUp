"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";

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
      { id: 'sarah_en', name: 'Sarah', gender: 'female' as const, accent: 'American' },
      { id: 'michael_en', name: 'Michael', gender: 'male' as const, accent: 'American' },
      { id: 'emma_en', name: 'Emma', gender: 'female' as const, accent: 'British' },
      { id: 'david_en', name: 'David', gender: 'male' as const, accent: 'British' }
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    voices: [
      { id: 'maria_es', name: 'María', gender: 'female' as const, accent: 'Castilian' },
      { id: 'carlos_es', name: 'Carlos', gender: 'male' as const, accent: 'Castilian' },
      { id: 'ana_es', name: 'Ana', gender: 'female' as const, accent: 'Mexican' },
      { id: 'jose_es', name: 'José', gender: 'male' as const, accent: 'Mexican' }
    ]
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    voices: [
      { id: 'marie_fr', name: 'Marie', gender: 'female' as const, accent: 'Parisian' },
      { id: 'pierre_fr', name: 'Pierre', gender: 'male' as const, accent: 'Parisian' }
    ]
  },
  {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    voices: [
      { id: 'anna_de', name: 'Anna', gender: 'female' as const, accent: 'Standard' },
      { id: 'klaus_de', name: 'Klaus', gender: 'male' as const, accent: 'Standard' }
    ]
  },
  {
    code: 'it',
    name: 'Italian',
    flag: '🇮🇹',
    voices: [
      { id: 'giulia_it', name: 'Giulia', gender: 'female' as const, accent: 'Standard' },
      { id: 'marco_it', name: 'Marco', gender: 'male' as const, accent: 'Standard' }
    ]
  },
  {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    voices: [
      { id: 'sofia_pt', name: 'Sofia', gender: 'female' as const, accent: 'European' },
      { id: 'joao_pt', name: 'João', gender: 'male' as const, accent: 'European' }
    ]
  }
];

export default function LanguageStep({ data, onUpdate, onNext, onPrev }: LanguageStepProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(data.language?.code || '');
  const [selectedVoice, setSelectedVoice] = useState(data.language?.voice.id || '');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

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
            gender: voice.gender
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

  const handleNext = () => {
    if (selectedLanguage && selectedVoice) {
      onNext();
    }
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Language & Voice</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Choose the language and voice for your video. You can preview each voice before selecting.
        </p>
      </div>

      {/* Language Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Select Language</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`glass rounded-xl p-4 text-center transition-all duration-200 hover:scale-105 ${
                selectedLanguage === language.code
                  ? 'ring-2 ring-accent bg-accent/10'
                  : 'hover:bg-surface-elevated'
              }`}
            >
              <div className="text-3xl mb-2">{language.flag}</div>
              <div className="text-sm font-medium text-foreground">{language.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      {currentLanguage && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Choose Voice</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentLanguage.voices.map((voice) => (
              <div
                key={voice.id}
                className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedVoice === voice.id
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-surface-elevated'
                }`}
                onClick={() => handleVoiceSelect(voice)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                      <span className="text-lg">
                        {voice.gender === 'female' ? '👩' : '👨'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{voice.name}</div>
                      <div className="text-sm text-foreground-muted">{voice.accent}</div>
                    </div>
                  </div>
                  
                  {selectedVoice === voice.id && (
                    <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-elevated hover:bg-surface transition-colors disabled:opacity-50"
                >
                  {playingVoice === voice.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Playing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Preview</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Section */}
      {data.language && (
        <div className="glass-elevated rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Selected Voice</h3>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
              <span className="text-2xl">
                {data.language.voice.gender === 'female' ? '👩' : '👨'}
              </span>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{data.language.voice.name}</div>
              <div className="text-sm text-foreground-muted">{data.language.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="btn-outline btn-lg px-8 py-3"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedLanguage || !selectedVoice}
          className="btn-primary btn-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
