"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface AvatarStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
}

const avatars = [
  {
    id: 'sarah',
    name: 'Sarah',
    image: '/avatars/sarah.jpg',
    gender: 'female' as const,
    description: 'Professional business presenter'
  },
  {
    id: 'michael',
    name: 'Michael',
    image: '/avatars/michael.jpg',
    gender: 'male' as const,
    description: 'Confident corporate speaker'
  },
  {
    id: 'emma',
    name: 'Emma',
    image: '/avatars/emma.jpg',
    gender: 'female' as const,
    description: 'Friendly marketing expert'
  },
  {
    id: 'david',
    name: 'David',
    image: '/avatars/david.jpg',
    gender: 'male' as const,
    description: 'Tech-savvy instructor'
  },
  {
    id: 'lisa',
    name: 'Lisa',
    image: '/avatars/lisa.jpg',
    gender: 'female' as const,
    description: 'Creative content creator'
  },
  {
    id: 'alex',
    name: 'Alex',
    image: '/avatars/alex.jpg',
    gender: 'male' as const,
    description: 'Dynamic sales presenter'
  }
];

export default function AvatarStep({ data, onUpdate, onNext }: AvatarStepProps) {
  const { translations } = useTranslations();
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar?.id || '');
  // const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

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
                  <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gradient-to-br from-accent/20 to-accent-2/20">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                        {avatar.name.charAt(0)}
                      </div>
                    </div>
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
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{avatar.name}</h3>
                  <p className="text-xs sm:text-sm text-foreground-muted">{avatar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {selectedAvatar && (
        <div className="max-w-2xl mx-auto px-4">
          <div className="glass-elevated rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-2xl sm:rounded-bl-3xl" />
            
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center">{translations.studioPreview}</h3>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                  <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                    {data.avatar?.name.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-center text-foreground-muted mt-3 sm:mt-4 text-base sm:text-lg">
              <span className="font-semibold text-accent">{data.avatar?.name}</span> {translations.studioWillPresentVideo}
            </p>
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
