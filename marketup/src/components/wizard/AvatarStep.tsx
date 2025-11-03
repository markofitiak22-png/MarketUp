"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface AvatarStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
}

// Fallback avatars if API fails - Marcus and Bob (HeyGen compatible)
const fallbackAvatars = [
  {
    id: '285f8a71dcd14421a7e4ecda88d78610', // Marcus HeyGen ID
    name: 'Marcus',
    image: '/avatars/Marcus.png',
    gender: 'male' as const,
    personality: 'Confident & Charismatic',
    description: 'A cheerful Man in a professional kitchen',
    voice: { id: 'Ak9WvlDj5TXD6zyDtpXG', name: 'Marcus Voice', gender: 'male' as const, language: 'English' }
  },
  {
    id: '8fb979fae61f487297620072ff19e6b5', // Bob HeyGen ID
    name: 'Bob',
    image: '/avatars/Bob.png',
    gender: 'male' as const,
    personality: 'Professional & Friendly',
    description: 'A professional presenter',
    voice: { id: '2yPUSv5lTtXwpjGQBuZO', name: 'Bob Voice', gender: 'male' as const, language: 'English' }
  }
];

export default function AvatarStep({ data, onUpdate, onNext }: AvatarStepProps) {
  const { translations } = useTranslations();
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar?.id || '');
  const [avatars, setAvatars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Load avatars - show fallback immediately, then update from API
  useEffect(() => {
    // Show fallback avatars immediately for fast loading
    setAvatars(fallbackAvatars);
    setLoading(false);
    
    // Then fetch from API in background and update if successful
    const fetchAvatars = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('/api/avatars', {
          credentials: "include",
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        const data = await response.json();
        
        if (data.success && data.avatars && data.avatars.length > 0) {
          // Transform API avatars to our format
          const transformedAvatars = data.avatars.map((avatar: any) => ({
            id: avatar.id,
            name: avatar.name,
            image: avatar.image,
            gender: avatar.gender,
            personality: avatar.personality,
            description: avatar.description || `${avatar.name} - ${avatar.voice.name} voice`,
            voice: avatar.voice
          }));
          
          // Only update if we got valid avatars with images
          if (transformedAvatars[0]?.image) {
            setAvatars(transformedAvatars);
          }
        }
      } catch (error: unknown) {
        // Silently fail - we already have fallback avatars showing
        if (error instanceof Error && error.name !== 'AbortError') {
          console.log('Avatar API fetch failed, using fallback:', error);
        }
      }
    };

    // Fetch in background after initial render
    fetchAvatars();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, [audioElement]);

  const handleAvatarSelect = (avatar: typeof avatars[0]) => {
    // Stop any currently playing voice preview when switching avatars
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    setIsPlayingVoice(false);
    
    setSelectedAvatar(avatar.id);
    onUpdate({
      avatar: {
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        gender: avatar.gender,
        voice: avatar.voice
      }
    });
  };

  const playVoicePreview = async () => {
    if (!data.avatar?.voice || isPlayingVoice || isGeneratingPreview) return;

    const avatar = data.avatar;
    const voiceId = avatar.voice.id; // HeyGen voice ID
    const avatarId = avatar.id; // Avatar ID
    
    setIsGeneratingPreview(true);

    try {
      console.log('🎤 Getting voice preview (will use cache if available)...');
      console.log('   Voice ID:', voiceId);
      console.log('   Avatar ID:', avatarId);

      // Generate or get cached preview using HeyGen API
      // API will return cached URL if preview already exists locally
      const response = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          voiceId: voiceId,
          avatarId: avatarId,
          text: `Hello! I'm ${avatar.name}. I'll be your video presenter today. Let me bring your content to life with my voice.`
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate preview');
      }

      // Play the audio/video (from local cache or newly generated)
      const audio = new Audio(result.audioUrl);
      setAudioElement(audio);
      
      audio.onended = () => {
        setIsPlayingVoice(false);
        setAudioElement(null);
      };

      audio.onerror = () => {
        console.error('Error playing preview audio');
        setIsPlayingVoice(false);
        setAudioElement(null);
      };

      setIsGeneratingPreview(false);
      setIsPlayingVoice(true);
      await audio.play();
      
      if (result.cached) {
        console.log('✅ Playing cached voice preview:', result.audioUrl);
      } else {
        console.log('✅ Playing newly generated voice preview:', result.audioUrl);
      }

    } catch (error: any) {
      console.error('Error generating voice preview:', error);
      alert('Failed to generate voice preview. Please try again.');
      setIsGeneratingPreview(false);
      setIsPlayingVoice(false);
    }
  };

  const stopVoicePreview = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    setIsPlayingVoice(false);
  };

  const handleNext = () => {
    if (selectedAvatar) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          {translations.studioChooseYourAvatar}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioSelectVirtualPresenter} <span className="text-accent font-medium">{translations.studioEachAvatarUnique}</span>
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-foreground-muted text-sm sm:text-base">Loading avatars...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedAvatar === avatar.id
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20 scale-105'
                    : 'border-[var(--border)] hover:border-accent/50 hover:bg-accent/5 hover:scale-102'
                }`}
                onClick={() => handleAvatarSelect(avatar)}
              >
                <div className="relative">
                  <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gradient-to-br from-accent/10 to-accent-2/10 flex items-center justify-center">
                    <img 
                      src={avatar.image} 
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedAvatar === avatar.id && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">{avatar.name}</h3>
                  {avatar.personality && (
                    <p className="text-xs font-medium text-accent mb-1">{avatar.personality}</p>
                  )}
                  <p className="text-xs sm:text-sm text-foreground-muted">{avatar.description}</p>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {selectedAvatar && data.avatar && (
        <div className="max-w-2xl mx-auto px-4">
          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
            
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">{translations.studioPreview}</h3>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-accent/10 to-accent-2/10 flex items-center justify-center shadow-xl">
                  <img 
                    src={data.avatar.image} 
                    alt={data.avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-4 w-full">
                <div>
                  <p className="text-lg sm:text-xl font-bold text-foreground mb-1">{data.avatar.name}</p>
                  {data.avatar.voice && (
                    <p className="text-xs sm:text-sm text-accent-2 font-medium mb-2">
                      Voice: {data.avatar.voice.name}
                    </p>
                  )}
                  <p className="text-sm sm:text-base text-foreground-muted">
                    {translations.studioWillPresentVideo}
                  </p>
                </div>
                
                {/* Voice Preview Button */}
                <button
                  onClick={isPlayingVoice ? stopVoicePreview : playVoicePreview}
                  disabled={isGeneratingPreview}
                  className={`w-full max-w-xs mx-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isPlayingVoice 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : isGeneratingPreview
                      ? 'bg-gray-500 text-white cursor-wait'
                      : 'bg-gradient-to-r from-accent to-accent-2 hover:from-accent-2 hover:to-accent text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isGeneratingPreview ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating Preview...</span>
                    </>
                  ) : isPlayingVoice ? (
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
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
        <button
          onClick={handleNext}
          disabled={!selectedAvatar}
          className="group relative btn-primary btn-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2 sm:gap-3">
            {translations.studioContinue}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
