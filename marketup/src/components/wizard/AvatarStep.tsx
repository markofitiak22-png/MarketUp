"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface AvatarStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
}

// Fallback avatars if API fails - Character AI & Anime style
const fallbackAvatars = [
  {
    id: 'char-sarah',
    name: 'Sarah',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
    gender: 'female' as const,
    personality: 'Professional',
    description: 'Professional business presenter'
  },
  {
    id: 'char-michael',
    name: 'Michael',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede',
    gender: 'male' as const,
    personality: 'Confident',
    description: 'Confident corporate speaker'
  },
  {
    id: 'char-emma',
    name: 'Emma',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffd5dc',
    gender: 'female' as const,
    personality: 'Friendly',
    description: 'Friendly marketing expert'
  },
  {
    id: 'char-david',
    name: 'David',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9',
    gender: 'male' as const,
    personality: 'Tech-Savvy',
    description: 'Tech-savvy instructor'
  },
  // Anime-style avatars
  {
    id: 'anime-sakura',
    name: 'Sakura',
    image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sakura&backgroundColor=ffb3d9',
    gender: 'female' as const,
    personality: 'Cheerful & Kawaii',
    description: 'Adorable anime host with bubbly energy'
  },
  {
    id: 'anime-ryu',
    name: 'Ryu',
    image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ryu&backgroundColor=b8e6ff',
    gender: 'male' as const,
    personality: 'Heroic',
    description: 'Brave anime character with strong spirit'
  },
  {
    id: 'anime-yuki',
    name: 'Yuki',
    image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki&backgroundColor=e6d5ff',
    gender: 'female' as const,
    personality: 'Mysterious',
    description: 'Graceful anime presenter with captivating charm'
  },
  // Creative avatars
  {
    id: 'creative-phoenix',
    name: 'Phoenix',
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix&backgroundColor=ff6b35',
    gender: 'neutral' as const,
    personality: 'Legendary',
    description: 'Mythical presenter rising from creative ashes'
  },
  {
    id: 'creative-nova',
    name: 'Nova',
    image: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Nova&backgroundColor=00d9ff',
    gender: 'neutral' as const,
    personality: 'Futuristic',
    description: 'AI-powered host from the digital future'
  },
  {
    id: 'creative-pixel',
    name: 'Pixel',
    image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel&backgroundColor=fbbf24',
    gender: 'neutral' as const,
    personality: 'Nostalgic',
    description: '8-bit gaming legend with retro charm'
  }
];

export default function AvatarStep({ data, onUpdate, onNext }: AvatarStepProps) {
  const { translations } = useTranslations();
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar?.id || '');
  const [avatars, setAvatars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Load avatars from API
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/avatars', {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success && data.avatars) {
          // Transform API avatars to our format
          const transformedAvatars = data.avatars.map((avatar: any) => ({
            id: avatar.id,
            name: avatar.name,
            image: avatar.image,
            gender: avatar.gender,
            personality: avatar.personality,
            description: avatar.description || `${avatar.name} - ${avatar.voice.name} voice`
          }));
          setAvatars(transformedAvatars);
        } else {
          // If API fails, use fallback avatars
          setAvatars(fallbackAvatars);
        }
      } catch (error) {
        console.error('Error fetching avatars:', error);
        // Use fallback avatars on error
        setAvatars(fallbackAvatars);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  const handleAvatarSelect = (avatar: typeof avatars[0]) => {
    setSelectedAvatar(avatar.id);
    onUpdate({
      avatar: {
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        gender: avatar.gender
      }
    });
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
              <div className="text-center">
                <p className="text-lg sm:text-xl font-bold text-foreground mb-1">{data.avatar.name}</p>
                <p className="text-sm sm:text-base text-foreground-muted">
                  {translations.studioWillPresentVideo}
                </p>
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
