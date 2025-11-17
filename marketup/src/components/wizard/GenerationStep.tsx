"use client";
import { useState, useRef, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface GenerationStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const getGenerationSteps = (translations: any) => [
  { id: 'preparing', label: translations.studioPreparingAssets, duration: 2000 },
  { id: 'avatar', label: translations.studioGeneratingAvatarAnimation, duration: 8000 },
  { id: 'voice', label: translations.studioSynthesizingVoice, duration: 6000 },
  { id: 'background', label: translations.studioProcessingBackground, duration: 4000 },
  { id: 'compositing', label: translations.studioCompositingVideo, duration: 10000 },
  { id: 'finalizing', label: translations.studioFinalizingOutput, duration: 3000 }
];

export default function GenerationStep({ 
  data, 
  onNext, 
  onPrev, 
  isGenerating, 
  setIsGenerating 
}: GenerationStepProps) {
  const { translations } = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime] = useState(0);
  // const [generationId, setGenerationId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const generationSteps = getGenerationSteps(translations);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startGeneration = async () => {
    // Validate required data before starting
    if (!data.avatar || !data.language || !data.backgrounds || data.backgrounds.length === 0 || !data.text) {
      alert('Please complete all required steps before generating the video.');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setProgress(0);
    
    try {
      // Prepare video generation request
      const requestData = {
        // Avatar information
        avatar: {
          id: data.avatar?.id,
          name: data.avatar?.name || 'default',
          image: data.avatar?.image,
          gender: data.avatar?.gender,
          voice: data.avatar?.voice
        },
        // Language and voice settings
        language: {
          code: data.language?.code,
          name: data.language?.name || 'English',
          voice: data.language?.voice
        },
        // All selected backgrounds
        backgrounds: data.backgrounds?.map(bg => ({
          id: bg.id,
          name: bg.name,
          image: bg.image,
          type: bg.type,
          category: bg.category
        })) || [],
        // Script text
        text: data.text,
        // Video settings
        settings: {
          duration: data.settings.duration,
          quality: data.settings.quality,
          format: data.settings.format
        },
        // Metadata
        title: `Video ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        createdAt: new Date().toISOString()
      };
      
      console.log('Starting video generation with data:', {
        avatar: requestData.avatar.name,
        language: requestData.language.name,
        voice: requestData.language.voice?.name,
        backgroundsCount: requestData.backgrounds.length,
        textLength: requestData.text.length,
        settings: requestData.settings
      });
      
      // Check if this is an edit (video ID exists in session storage)
      // Only use existingVideoId if we're actually editing (coming from preview step)
      // For new videos, clear the old video ID
      const existingVideoId = sessionStorage.getItem('currentVideoId');
      const isEditing = sessionStorage.getItem('isEditing') === 'true';
      
      // Add existingVideoId if this is an edit
      const finalRequestData = {
        ...requestData,
        ...(existingVideoId && isEditing ? { existingVideoId } : {})
      };
      
      if (existingVideoId && isEditing) {
        // Clear the editing flag
        sessionStorage.removeItem('isEditing');
      } else {
        // Clear old video ID for new video generation
        sessionStorage.removeItem('currentVideoId');
      }
      
      // Call the real API to start video generation with full data
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(finalRequestData),
      });

      const result = await response.json();
      
      if (!result.success) {
        const errorMessage = result.details 
          ? Object.values(result.details).filter(Boolean).join(', ')
          : result.error || 'Failed to start generation';
        throw new Error(errorMessage);
      }

      // Start polling for status updates
      const { videoId } = result;
      
      // Store video ID in session storage for preview step
      sessionStorage.setItem('currentVideoId', videoId);
      
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/video/generate?videoId=${videoId}`);
          const statusData = await statusResponse.json();
          
          if (statusData.success) {
            if (statusData.status === 'completed') {
              clearInterval(pollInterval);
              setIsGenerating(false);
              onNext();
            } else if (statusData.status === 'processing') {
              setProgress(statusData.progress || 0);
              // Update current step based on progress
              const stepIndex = Math.floor((statusData.progress || 0) / (100 / generationSteps.length));
              setCurrentStep(Math.min(stepIndex, generationSteps.length - 1));
            }
          }
        } catch (error) {
          console.error('Error checking generation status:', error);
        }
      }, 2000); // Poll every 2 seconds

      // Store interval reference for cleanup
      intervalRef.current = pollInterval;
      
    } catch (error) {
      console.error('Error starting generation:', error);
      setIsGenerating(false);
      alert(`Error starting video generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const cancelGeneration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsGenerating(false);
    setCurrentStep(0);
    setProgress(0);
    // setGenerationId(null);
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return (
        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (stepIndex === currentStep && isGenerating) {
      return (
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      );
    }
    
    return (
      <div className="w-5 h-5 border-2 border-border rounded-full" />
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            {translations.studioGenerateYourVideo}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioCreatePersonalizedVideo} {translations.studioProcessTakes2To3Minutes}
        </p>
      </div>

      {/* Two Sections in Row */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Summary */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{translations.studioVideoSummary}</h3>
            <p className="text-sm text-white/60 mb-6">Review your video configuration</p>
            
            <div className="space-y-4">
            {/* Avatar Card */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-700/40 flex-shrink-0">
                  <img 
                    src={data.avatar?.image} 
                    alt={data.avatar?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-indigo-400 font-semibold mb-1">AVATAR</div>
                  <div className="font-bold text-white text-sm truncate">{data.avatar?.name}</div>
                  <div className="text-xs text-white/60 capitalize">{data.avatar?.gender}</div>
                </div>
              </div>
            </div>
            
            {/* Voice Card */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🗣️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-indigo-400 font-semibold mb-1">VOICE & LANGUAGE</div>
                  <div className="font-bold text-white text-sm truncate">{data.language?.voice.name}</div>
                  <div className="text-xs text-white/60 truncate">{data.language?.name} • {data.language?.voice.tone}</div>
                </div>
              </div>
            </div>
            
            {/* Duration Card */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⏱️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-indigo-400 font-semibold mb-1">VIDEO DURATION</div>
                  <div className="font-bold text-white text-sm">{data.settings.duration} seconds</div>
                  <div className="text-xs text-white/60">{data.text.split(' ').length} words • {data.settings.quality.toUpperCase()}</div>
                </div>
              </div>
            </div>
            
            {/* Backgrounds */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
              <div className="text-xs text-indigo-400 font-semibold mb-3">BACKGROUNDS ({data.backgrounds?.length || 0})</div>
              <div className="grid grid-cols-2 gap-2">
                {data.backgrounds?.slice(0, 4).map((bg, index) => (
                  <div key={bg.id} className="relative">
                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-700/40">
                      <img 
                        src={bg.image} 
                        alt={bg.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="mt-1 text-xs font-medium text-white/80 truncate">{bg.name}</div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        
          {/* Ready to Generate / Generation Process */}
        {isGenerating ? (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
                <div className="absolute inset-2 bg-slate-800/40 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{translations.studioGeneratingYourVideo}</h3>
              <p className="text-sm text-white/60">{translations.studioDontCloseWindow}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-white">{translations.studioProgress}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="relative w-full bg-slate-800/40 rounded-full h-4 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-white/60">
                <span>{generationSteps[currentStep]?.label || 'Processing...'}</span>
                <span>Step {currentStep + 1} of {generationSteps.length}</span>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="text-center">
              <button
                onClick={cancelGeneration}
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all"
              >
                {translations.studioCancelGeneration}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl" />
                <div className="absolute inset-2 bg-slate-800/40 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{translations.studioReadyToGenerate}</h3>
              <p className="text-sm text-white/60 mb-6">
                {translations.studioVideoCreatedWithSettings}
              </p>
              
              <button
                onClick={startGeneration}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-base font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{translations.studioStartGeneration}</span>
              </button>
              
              <p className="mt-4 text-xs text-white/50">
                {translations.studioGenerationTakes2To3Minutes}
              </p>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        <button
          onClick={onPrev}
          disabled={isGenerating}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#1a1a1a] hover:bg-[#222222] text-white rounded-full transition-all duration-300 border border-[#3a3a3a] flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
      </div>
    </div>
  );
}
