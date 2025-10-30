"use client";
import { useState, useEffect } from "react";
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
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    voices: [
      { id: 'fatima_ar', name: 'Fatima', gender: 'female' as const, accent: 'Standard', tone: 'professional' as const },
      { id: 'omar_ar', name: 'Omar', gender: 'male' as const, accent: 'Standard', tone: 'energetic' as const },
      { id: 'layla_ar', name: 'Layla', gender: 'female' as const, accent: 'Gulf', tone: 'calm' as const },
      { id: 'hassan_ar', name: 'Hassan', gender: 'male' as const, accent: 'Standard', tone: 'expressive' as const }
    ]
  },
  {
    code: 'sv',
    name: 'Swedish',
    flag: '🇸🇪',
    voices: [
      { id: 'emma_sv', name: 'Emma', gender: 'female' as const, accent: 'Standard', tone: 'professional' as const },
      { id: 'erik_sv', name: 'Erik', gender: 'male' as const, accent: 'Standard', tone: 'energetic' as const },
      { id: 'sofia_sv', name: 'Sofia', gender: 'female' as const, accent: 'Standard', tone: 'calm' as const }
    ]
  },
  {
    code: 'tr',
    name: 'Turkish',
    flag: '🇹🇷',
    voices: [
      { id: 'ayse_tr', name: 'Ayşe', gender: 'female' as const, accent: 'Standard', tone: 'professional' as const },
      { id: 'mehmet_tr', name: 'Mehmet', gender: 'male' as const, accent: 'Standard', tone: 'energetic' as const },
      { id: 'zeynep_tr', name: 'Zeynep', gender: 'female' as const, accent: 'Istanbul', tone: 'calm' as const }
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
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    voices: [
      { id: 'marie_fr', name: 'Marie', gender: 'female' as const, accent: 'Parisian', tone: 'professional' as const },
      { id: 'pierre_fr', name: 'Pierre', gender: 'male' as const, accent: 'Parisian', tone: 'energetic' as const }
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

// Generate gradient color for voice avatars based on name
const getVoiceColor = (name: string) => {
  const colors: Record<string, string> = {
    'Sarah': 'from-pink-400 to-rose-500',
    'Michael': 'from-blue-400 to-indigo-500',
    'Emma': 'from-purple-400 to-pink-500',
    'David': 'from-cyan-400 to-blue-500',
    'Fatima': 'from-amber-400 to-orange-500',
    'Omar': 'from-emerald-400 to-green-500',
    'Layla': 'from-violet-400 to-purple-500',
    'Hassan': 'from-teal-400 to-cyan-500',
    'Erik': 'from-sky-400 to-blue-500',
    'Sofia': 'from-rose-400 to-pink-500',
    'Ayşe': 'from-fuchsia-400 to-purple-500',
    'Mehmet': 'from-indigo-400 to-blue-500',
    'Zeynep': 'from-pink-400 to-rose-500',
    'Anna': 'from-orange-400 to-red-500',
    'Klaus': 'from-slate-400 to-gray-500',
    'Marie': 'from-rose-400 to-pink-500',
    'Pierre': 'from-blue-400 to-indigo-500'
  };
  return colors[name] || 'from-gray-400 to-gray-500';
};

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

  // Load voices for Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices();
      };
      
      loadVoices();
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const playVoicePreview = (voiceId: string, voiceName: string, gender: string) => {
    if (playingVoice === voiceId) {
      // Stop if already playing
      speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }

    // Stop any current playback
    speechSynthesis.cancel();
    setPlayingVoice(voiceId);

    // Create sample text based on language
    const language = languages.find(l => l.code === selectedLanguage);
    const sampleTexts: Record<string, string> = {
      'en': `Hi! I'm ${voiceName}. Let me help you create amazing content with my voice.`,
      'ar': `مرحباً! أنا ${voiceName}. دعني أساعدك في إنشاء محتوى رائع بصوتي.`,
      'sv': `Hej! Jag är ${voiceName}. Låt mig hjälpa dig att skapa fantastiskt innehåll med min röst.`,
      'tr': `Merhaba! Ben ${voiceName}. Sesimle harika içerik oluşturmanıza yardımcı olayım.`,
      'de': `Hallo! Ich bin ${voiceName}. Lass mich dir helfen, großartige Inhalte mit meiner Stimme zu erstellen.`,
      'fr': `Bonjour! Je suis ${voiceName}. Laissez-moi vous aider à créer un contenu incroyable avec ma voix.`
    };

    const text = sampleTexts[selectedLanguage] || sampleTexts['en'];
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a voice that matches the language and gender
    const voices = speechSynthesis.getVoices();
    const languageCode = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
    
    const preferredVoice = voices.find(voice => {
      const matchesLanguage = voice.lang.startsWith(languageCode) || voice.lang.startsWith(selectedLanguage);
      const matchesGender = gender === 'female' 
        ? voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
        : voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man');
      return matchesLanguage && matchesGender;
    }) || voices.find(voice => voice.lang.startsWith(languageCode) || voice.lang.startsWith(selectedLanguage));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = languageCode;
    }

    utterance.rate = 1.0;
    utterance.pitch = gender === 'female' ? 1.1 : 0.9;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setPlayingVoice(null);
    };

    utterance.onerror = () => {
      setPlayingVoice(null);
    };

    speechSynthesis.speak(utterance);
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
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getVoiceColor(voice.name)} flex items-center justify-center shadow-lg`}>
                        <span className="text-white text-xl font-bold">
                          {voice.name.charAt(0)}
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
                      playVoicePreview(voice.id, voice.name, voice.gender);
                    }}
                    className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all ${
                      playingVoice === voice.id
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gradient-to-r from-accent-2 to-purple-500 text-white hover:from-purple-500 hover:to-accent-2 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {playingVoice === voice.id ? (
                      <>
                        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Stop</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
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
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="flex items-center justify-center gap-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getVoiceColor(data.language.voice.name)} flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-3xl font-bold">
                    {data.language.voice.name.charAt(0)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-foreground">{data.language.voice.name}</div>
                  <div className="text-lg text-foreground-muted">{data.language.name}</div>
                  <div className="text-sm text-accent-2 font-medium capitalize mt-1">{data.language.voice.tone}</div>
                </div>
              </div>
              
              {/* Voice Preview Button */}
              <button
                onClick={() => playVoicePreview(data.language!.voice.id, data.language!.voice.name, data.language!.voice.gender)}
                className={`w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  playingVoice === data.language.voice.id
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gradient-to-r from-accent to-accent-2 hover:from-accent-2 hover:to-accent text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {playingVoice === data.language.voice.id ? (
                  <>
                    <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>Listen to Voice</span>
                  </>
                )}
              </button>
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
