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
      
      // Call the real API to start video generation with full data
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(requestData),
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">{translations.studioGenerateYourVideo}</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          {translations.studioCreatePersonalizedVideo} {translations.studioProcessTakes2To3Minutes}
        </p>
      </div>

      {/* Video Summary */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{translations.studioVideoSummary}</h3>
              <p className="text-sm text-foreground-muted">Review your video configuration</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Avatar & Voice */}
            <div className="space-y-4">
              {/* Avatar Card */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/10 to-accent-2/10">
                    <img 
                      src={data.avatar?.image} 
                      alt={data.avatar?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-accent font-semibold mb-1">AVATAR</div>
                    <div className="font-bold text-foreground text-lg">{data.avatar?.name}</div>
                    <div className="text-sm text-foreground-muted capitalize">{data.avatar?.gender}</div>
                  </div>
                </div>
              </div>
              
              {/* Voice Card */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <span className="text-3xl">🗣️</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-accent font-semibold mb-1">VOICE & LANGUAGE</div>
                    <div className="font-bold text-foreground text-lg">{data.language?.voice.name}</div>
                    <div className="text-sm text-foreground-muted">{data.language?.name} • {data.language?.voice.tone}</div>
                  </div>
                </div>
              </div>
              
              {/* Duration Card */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-3xl">⏱️</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-accent font-semibold mb-1">VIDEO DURATION</div>
                    <div className="font-bold text-foreground text-lg">{data.settings.duration} seconds</div>
                    <div className="text-sm text-foreground-muted">{data.text.split(' ').length} words • {data.settings.quality.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Backgrounds & Script */}
            <div className="space-y-4">
              {/* Backgrounds Card */}
              <div className="glass rounded-2xl p-6">
                <div className="text-xs text-accent font-semibold mb-3">BACKGROUNDS ({data.backgrounds?.length || 0})</div>
                <div className="grid grid-cols-2 gap-3">
                  {data.backgrounds?.slice(0, 4).map((bg, index) => (
                    <div key={bg.id} className="relative">
                      <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
                        <img 
                          src={bg.image} 
                          alt={bg.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-foreground truncate">{bg.name}</div>
                    </div>
                  ))}
                </div>
                {(data.backgrounds?.length || 0) > 4 && (
                  <div className="mt-3 text-sm text-foreground-muted text-center">
                    +{(data.backgrounds?.length || 0) - 4} more backgrounds
                  </div>
                )}
              </div>
              
              {/* Script Preview Card */}
              <div className="glass rounded-2xl p-6">
                <div className="text-xs text-accent font-semibold mb-3">SCRIPT PREVIEW</div>
                <div className="bg-surface/50 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm text-foreground leading-relaxed line-clamp-6">
                    {data.text}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-foreground-muted">
                  <span>{data.text.length} characters</span>
                  <span>~{Math.ceil(data.text.split(' ').length / 150)} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Settings */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 justify-center text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                <span className="font-medium text-foreground-muted">Quality:</span>
                <span className="font-bold text-accent">{data.settings.quality.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                <span className="font-medium text-foreground-muted">Format:</span>
                <span className="font-bold text-accent">{data.settings.format.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                <span className="font-medium text-foreground-muted">Scenes:</span>
                <span className="font-bold text-accent">{data.backgrounds?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Process */}
      {isGenerating ? (
        <div className="max-w-4xl mx-auto">
          <div className="glass-elevated rounded-3xl p-10 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent-2/5 to-purple-500/5 animate-pulse" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full animate-pulse" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-2 rounded-2xl animate-pulse" />
                  <div className="absolute inset-2 bg-background rounded-xl flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-3">{translations.studioGeneratingYourVideo}</h3>
                <p className="text-lg text-foreground-muted">{translations.studioDontCloseWindow}</p>
              </div>

              {/* Large Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-foreground">{translations.studioProgress}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-surface rounded-full h-6 overflow-hidden shadow-inner">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-accent via-accent-2 to-purple-500 h-6 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-sm text-foreground-muted">
                  <span>{generationSteps[currentStep]?.label || 'Processing...'}</span>
                  <span>Step {currentStep + 1} of {generationSteps.length}</span>
                </div>
              </div>

              {/* Generation Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {generationSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`glass rounded-2xl p-4 transition-all duration-300 ${
                      index === currentStep 
                        ? 'ring-2 ring-accent shadow-lg scale-105' 
                        : index < currentStep 
                        ? 'opacity-60' 
                        : 'opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent-2/10 flex items-center justify-center">
                        {getStepIcon(index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm mb-1 truncate">{step.label}</div>
                        {index === currentStep && isGenerating && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-foreground-muted">
                              {Math.round((index + 1) * 100 / generationSteps.length)}%
                            </span>
                          </div>
                        )}
                        {index < currentStep && (
                          <div className="text-xs text-success font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {translations.studioComplete}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm text-foreground-muted mb-1">Estimated Time</div>
                  <div className="text-lg font-bold text-foreground">
                    {formatTime(Math.max(0, Math.floor((100 - progress) * 3)))}
                  </div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="text-sm text-foreground-muted mb-1">Video Quality</div>
                  <div className="text-lg font-bold text-foreground uppercase">{data.settings.quality}</div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="text-center">
                <button
                  onClick={cancelGeneration}
                  className="px-6 py-3 rounded-xl border-2 border-red-500/30 text-red-500 font-semibold hover:bg-red-500/10 transition-all flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {translations.studioCancelGeneration}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="glass-elevated rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent-2/10 to-transparent rounded-tr-full" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-3xl animate-pulse" />
                <div className="absolute inset-3 bg-background rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-3xl font-bold text-foreground mb-4">{translations.studioReadyToGenerate}</h3>
              <p className="text-lg text-foreground-muted mb-8 max-w-xl mx-auto">
                {translations.studioVideoCreatedWithSettings} Everything is ready to create your personalized video!
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <span className="font-medium text-foreground">{data.avatar?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-lg">🌍</span>
                  </div>
                  <span className="font-medium text-foreground">{data.language?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-lg">🎬</span>
                  </div>
                  <span className="font-medium text-foreground">{data.backgrounds?.length} scenes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-lg">⏱️</span>
                  </div>
                  <span className="font-medium text-foreground">~{data.settings.duration}s</span>
                </div>
              </div>
              
              {/* Generate Button */}
              <button
                onClick={startGeneration}
                className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-accent via-accent-2 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-2 via-purple-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">{translations.studioStartGeneration}</span>
                <div className="flex gap-1 relative z-10">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </button>
              
              {/* Note */}
              <p className="mt-6 text-sm text-foreground-muted flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {translations.studioGenerationTakes2To3Minutes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isGenerating}
          className="btn-outline btn-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
        
        {!isGenerating && (
          <div className="text-sm text-foreground-muted flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {translations.studioGenerationTakes2To3Minutes}
          </div>
        )}
      </div>
    </div>
  );
}
