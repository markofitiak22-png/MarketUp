"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";

interface BackgroundStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const backgrounds = [
  {
    id: 'office',
    name: 'Modern Office',
    image: '/backgrounds/office.jpg',
    type: 'image' as const,
    category: 'Professional',
    description: 'Clean, professional office environment'
  },
  {
    id: 'studio',
    name: 'Video Studio',
    image: '/backgrounds/studio.jpg',
    type: 'image' as const,
    category: 'Professional',
    description: 'Professional video production studio'
  },
  {
    id: 'conference',
    name: 'Conference Room',
    image: '/backgrounds/conference.jpg',
    type: 'image' as const,
    category: 'Professional',
    description: 'Corporate meeting room setting'
  },
  {
    id: 'home',
    name: 'Home Office',
    image: '/backgrounds/home.jpg',
    type: 'image' as const,
    category: 'Casual',
    description: 'Comfortable home office setup'
  },
  {
    id: 'outdoor',
    name: 'Outdoor Scene',
    image: '/backgrounds/outdoor.jpg',
    type: 'image' as const,
    category: 'Casual',
    description: 'Natural outdoor environment'
  },
  {
    id: 'abstract',
    name: 'Abstract Gradient',
    image: '/backgrounds/abstract.jpg',
    type: 'image' as const,
    category: 'Creative',
    description: 'Modern abstract background'
  },
  {
    id: 'city',
    name: 'City Skyline',
    image: '/backgrounds/city.jpg',
    type: 'image' as const,
    category: 'Creative',
    description: 'Urban cityscape backdrop'
  },
  {
    id: 'nature',
    name: 'Nature Scene',
    image: '/backgrounds/nature.jpg',
    type: 'image' as const,
    category: 'Creative',
    description: 'Peaceful natural setting'
  }
];

const categories = ['All', 'Professional', 'Casual', 'Creative'];

export default function BackgroundStep({ data, onUpdate, onNext, onPrev }: BackgroundStepProps) {
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>(data.backgrounds?.map(bg => bg.id) || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewMode, setPreviewMode] = useState(false);

  const filteredBackgrounds = selectedCategory === 'All' 
    ? backgrounds 
    : backgrounds.filter(bg => bg.category === selectedCategory);

  const handleBackgroundSelect = (background: typeof backgrounds[0]) => {
    const newSelectedBackgrounds = selectedBackgrounds.includes(background.id)
      ? selectedBackgrounds.filter(id => id !== background.id)
      : [...selectedBackgrounds, background.id];
    
    setSelectedBackgrounds(newSelectedBackgrounds);
    
    const selectedBgObjects = newSelectedBackgrounds.map(id => {
      const bg = backgrounds.find(b => b.id === id);
      return bg ? {
        id: bg.id,
        name: bg.name,
        image: bg.image,
        type: bg.type,
        category: bg.category,
        description: bg.description
      } : null;
    }).filter(Boolean);
    
    onUpdate({
      backgrounds: selectedBgObjects
    });
  };

  const handleNext = () => {
    if (selectedBackgrounds.length > 0) {
      onNext();
    }
  };

  const selectedBgs = selectedBackgrounds.map(id => backgrounds.find(bg => bg.id === id)).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Choose Backgrounds</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Select multiple backgrounds for your video. You can choose 2-4 different scenes to create dynamic transitions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-white'
                : 'bg-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredBackgrounds.map((background) => (
          <div
            key={background.id}
            className={`glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedBackgrounds.includes(background.id)
                ? 'ring-2 ring-accent'
                : 'hover:bg-surface-elevated'
            }`}
            onClick={() => handleBackgroundSelect(background)}
          >
            <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent-2/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl opacity-50">
                  {background.category === 'Professional' && '🏢'}
                  {background.category === 'Casual' && '🏠'}
                  {background.category === 'Creative' && '🎨'}
                </div>
              </div>
              
              {selectedBackgrounds.includes(background.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{background.name}</h3>
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                  {background.category}
                </span>
              </div>
              <p className="text-sm text-foreground-muted">{background.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Backgrounds Counter */}
      {selectedBackgrounds.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{selectedBackgrounds.length} background{selectedBackgrounds.length !== 1 ? 's' : ''} selected</span>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {selectedBackgrounds.length > 0 && (
        <div className="glass-elevated rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Preview</h3>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="btn-outline btn-sm"
            >
              {previewMode ? 'Exit Preview' : 'Preview Mode'}
            </button>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl opacity-50">
                  {selectedBgs.length > 0 && selectedBgs[0].category === 'Professional' && '🏢'}
                  {selectedBgs.length > 0 && selectedBgs[0].category === 'Casual' && '🏠'}
                  {selectedBgs.length > 0 && selectedBgs[0].category === 'Creative' && '🎨'}
                </div>
              </div>
              
              {previewMode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white text-2xl font-bold">
                    {data.avatar?.name.charAt(0)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <h4 className="text-lg font-semibold text-foreground">
                {selectedBgs.length > 0 ? selectedBgs[0].name : 'Selected Backgrounds'}
              </h4>
              <p className="text-sm text-foreground-muted">
                {selectedBgs.length > 0 ? selectedBgs[0].description : `${selectedBackgrounds.length} background${selectedBackgrounds.length !== 1 ? 's' : ''} selected`}
              </p>
              {selectedBgs.length > 1 && (
                <div className="mt-2 text-xs text-accent">
                  +{selectedBgs.length - 1} more background{selectedBgs.length - 1 !== 1 ? 's' : ''}
                </div>
              )}
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
          disabled={selectedBackgrounds.length === 0}
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
