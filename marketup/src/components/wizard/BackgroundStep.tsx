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
  const [previewMode, setPreviewMode] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  
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

  const selectedBgs = selectedBackgrounds.map(id => backgrounds.find(bg => bg.id === id)).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">{translations.studioChooseBackgrounds}</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          {translations.studioSelectMultipleBackgrounds} {translations.studioChoose2To4Scenes}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredBackgrounds.map((background) => (
          <div
            key={background.id}
            className={`group glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedBackgrounds.includes(background.id)
                ? 'ring-4 ring-accent shadow-xl shadow-accent/30 scale-105'
                : 'hover:scale-102 hover:shadow-lg'
            }`}
            onClick={() => handleBackgroundSelect(background)}
          >
            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
              <img 
                src={background.image} 
                alt={background.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Preview Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Selection Checkmark */}
              {selectedBackgrounds.includes(background.id) && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="text-xs px-3 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full font-medium">
                  {background.category}
                </span>
              </div>
              
            </div>
            
            <div className="p-4 bg-surface/50 backdrop-blur-sm">
              <h3 className="font-bold text-foreground mb-1 text-lg">{background.name}</h3>
              <p className="text-sm text-foreground-muted line-clamp-2">{background.description}</p>
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
            <span className="font-medium">{selectedBackgrounds.length} {translations.studioBackgroundsSelected}</span>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {selectedBackgrounds.length > 0 && (
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">{translations.studioPreview}</h3>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                previewMode 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                  : 'bg-gradient-to-r from-accent to-accent-2 text-white hover:from-accent-2 hover:to-accent'
              }`}
            >
              {previewMode ? '✕ Exit Preview' : '👁 Preview Mode'}
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Main Preview */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
                <img 
                  src={selectedBgs.length > 0 ? selectedBgs[previewIndex]?.image : ''} 
                  alt={selectedBgs.length > 0 ? selectedBgs[previewIndex]?.name : ''}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Navigation Arrows */}
                {selectedBgs.length > 1 && (
                  <>
                    <button
                      onClick={() => setPreviewIndex((prev) => (prev > 0 ? prev - 1 : selectedBgs.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPreviewIndex((prev) => (prev < selectedBgs.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Avatar Overlay in Preview Mode */}
                {previewMode && data.avatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="relative">
                      {/* Avatar Circle */}
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                        <img 
                          src={data.avatar.image} 
                          alt={data.avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Pulse Animation */}
                      <div className="absolute inset-0 rounded-full border-4 border-accent animate-ping opacity-75"></div>
                    </div>
                  </div>
                )}
                
                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {selectedBgs.length > 0 ? selectedBgs[previewIndex]?.name : translations.studioSelectedBackgrounds}
                      </h4>
                      <p className="text-sm text-white/80">
                        {selectedBgs.length > 0 ? selectedBgs[previewIndex]?.description : `${selectedBackgrounds.length} ${translations.studioBackgroundsSelected}`}
                      </p>
                    </div>
                    {selectedBgs.length > 1 && (
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-white font-bold">{previewIndex + 1}</span>
                        <span className="text-white/60">/</span>
                        <span className="text-white/80">{selectedBgs.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {selectedBgs.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedBgs.map((bg, index) => (
                  <div 
                    key={bg?.id} 
                    className="relative flex-shrink-0 cursor-pointer"
                    onClick={() => setPreviewIndex(index)}
                  >
                    <div className={`w-32 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 ${
                      previewIndex === index 
                        ? 'border-accent ring-2 ring-accent/50 scale-105' 
                        : 'border-accent/30 hover:border-accent'
                    }`}>
                      <img 
                        src={bg?.image} 
                        alt={bg?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all ${
                      previewIndex === index 
                        ? 'bg-gradient-to-br from-accent to-accent-2 scale-110' 
                        : 'bg-accent/70'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          {translations.studioBack}
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedBackgrounds.length === 0}
          className="btn-primary btn-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {translations.studioContinue}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
