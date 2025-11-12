"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface BackgroundStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const backgrounds = [
  // Professional Locations
  {
    id: 'modern-office',
    name: 'Modern Office',
    image: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Professional',
    description: 'Sleek modern office with glass walls and city view'
  },
  {
    id: 'conference-room',
    name: 'Conference Room',
    image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Professional',
    description: 'Professional meeting room with presentation setup'
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup Office',
    image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Professional',
    description: 'Creative tech startup workspace'
  },
  {
    id: 'executive-office',
    name: 'Executive Office',
    image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Professional',
    description: 'Elegant executive office with premium furnishings'
  },
  // Casual Locations
  {
    id: 'home-office',
    name: 'Cozy Home Office',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Casual',
    description: 'Warm and comfortable home workspace'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    image: 'https://images.pexels.com/photos/2467287/pexels-photo-2467287.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Casual',
    description: 'Trendy cafe environment with natural lighting'
  },
  {
    id: 'library',
    name: 'Modern Library',
    image: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Casual',
    description: 'Quiet library with bookshelves backdrop'
  },
  {
    id: 'minimalist-room',
    name: 'Minimalist Room',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Casual',
    description: 'Clean minimalist interior design'
  },
  // Creative Locations
  {
    id: 'art-studio',
    name: 'Art Studio',
    image: 'https://images.pexels.com/photos/1647120/pexels-photo-1647120.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Creative',
    description: 'Colorful creative art studio space'
  },
  {
    id: 'rooftop-city',
    name: 'Rooftop City View',
    image: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Creative',
    description: 'Stunning city skyline from rooftop'
  },
  {
    id: 'futuristic-space',
    name: 'Futuristic Space',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    type: 'image' as const,
    category: 'Creative',
    description: 'Modern futuristic architectural space'
  },
  {
    id: 'nature-garden',
    name: 'Botanical Garden',
    image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1920',
    type: 'image' as const,
    category: 'Creative',
    description: 'Lush green botanical garden setting'
  }
];

const getCategories = (translations: any) => [translations.studioAll, translations.studioProfessional, translations.studioCasual, translations.studioCreative];

export default function BackgroundStep({ data, onUpdate, onNext, onPrev }: BackgroundStepProps) {
  const { translations } = useTranslations();
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>(data.backgrounds?.map(bg => bg.id) || []);
  const [selectedCategory, setSelectedCategory] = useState(translations.studioAll);
  
  const categories = getCategories(translations);

  const filteredBackgrounds = selectedCategory === translations.studioAll 
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
    }).filter((bg): bg is NonNullable<typeof bg> => bg !== null);
    
    onUpdate({
      backgrounds: selectedBgObjects
    });
  };

  const handleNext = () => {
    if (selectedBackgrounds.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            {translations.studioChooseBackgrounds}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioSelectMultipleBackgrounds} {translations.studioChoose2To4Scenes}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-slate-700 text-white border border-slate-600'
                : 'bg-slate-800/40 text-white/60 hover:text-white hover:bg-slate-800/60 border border-slate-700/60'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
        {filteredBackgrounds.map((background) => (
          <div
            key={background.id}
            className={`group bg-slate-900/60 backdrop-blur-sm border rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedBackgrounds.includes(background.id)
                ? 'border-indigo-500/60 bg-slate-800/80 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                : 'border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-800/70 hover:scale-[1.01]'
            }`}
            onClick={() => handleBackgroundSelect(background)}
          >
            <div className="aspect-video relative overflow-hidden bg-slate-800/40">
              <img 
                src={background.image} 
                alt={background.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Selection Checkmark */}
              {selectedBackgrounds.includes(background.id) && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="text-xs px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white rounded-full font-medium border border-slate-700/60">
                  {background.category}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-5">
              <h3 className="font-bold text-white mb-2 text-lg sm:text-xl">{background.name}</h3>
              <p className="text-sm text-white/60">{background.description}</p>
            </div>
          </div>
        ))}
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
          disabled={selectedBackgrounds.length === 0}
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
