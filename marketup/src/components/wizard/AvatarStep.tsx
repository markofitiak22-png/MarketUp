"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";

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
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar?.id || '');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Avatar</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Select a virtual presenter who will deliver your message. Each avatar has a unique personality and speaking style.
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedAvatar === avatar.id
                ? 'ring-2 ring-accent bg-accent/10'
                : 'hover:bg-surface-elevated'
            }`}
            onClick={() => handleAvatarSelect(avatar)}
          >
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-accent/20 to-accent-2/20">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white text-2xl font-bold">
                    {avatar.name.charAt(0)}
                  </div>
                </div>
              </div>
              
              {selectedAvatar === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">{avatar.name}</h3>
              <p className="text-sm text-foreground-muted">{avatar.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Section */}
      {selectedAvatar && (
        <div className="glass-elevated rounded-2xl p-8">
          <h3 className="text-xl font-bold text-foreground mb-4 text-center">Preview</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white text-3xl font-bold">
                  {data.avatar?.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-center text-foreground-muted mt-4">
            {data.avatar?.name} will present your video
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedAvatar}
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
