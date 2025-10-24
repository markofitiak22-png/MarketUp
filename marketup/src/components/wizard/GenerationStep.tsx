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
      // Call the real API to start video generation
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: data.avatar?.name || 'default',
          language: data.language?.name || 'English',
          background: data.backgrounds?.[0]?.image || '',
          text: data.text,
          title: `Video ${new Date().toLocaleDateString()}`
        }),
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
      <div className="glass-elevated rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{translations.studioVideoSummary}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <span className="text-lg">
                  {data.avatar?.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div>
                <div className="font-medium text-foreground">{data.avatar?.name}</div>
                <div className="text-sm text-foreground-muted">{translations.studioAvatar}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <span className="text-lg">🗣️</span>
              </div>
              <div>
                <div className="font-medium text-foreground">{data.language?.voice.name}</div>
                <div className="text-sm text-foreground-muted">{data.language?.name}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <span className="text-lg">🎬</span>
              </div>
              <div>
                <div className="font-medium text-foreground">{data.backgrounds?.[0]?.name}</div>
                <div className="text-sm text-foreground-muted">{translations.studioBackground}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              <div>
                <div className="font-medium text-foreground">{data.settings.duration}s {translations.studioDuration}</div>
                <div className="text-sm text-foreground-muted">{data.text.split(' ').length} {translations.studioWords}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Process */}
      {isGenerating ? (
        <div className="glass-elevated rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{translations.studioGeneratingYourVideo}</h3>
            <p className="text-foreground-muted">{translations.studioDontCloseWindow}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{translations.studioProgress}</span>
              <span className="text-sm text-foreground-muted">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent to-accent-2 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Generation Steps */}
          <div className="space-y-4">
            {generationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {getStepIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{step.label}</div>
                  {index === currentStep && isGenerating && (
                    <div className="text-sm text-foreground-muted">
                      {translations.studioProcessing} {Math.round((index + 1) * 100 / generationSteps.length)}%
                    </div>
                  )}
                </div>
                {index < currentStep && (
                  <div className="text-success text-sm font-medium">{translations.studioComplete}</div>
                )}
              </div>
            ))}
          </div>

          {/* Estimated Time */}
          <div className="mt-6 text-center">
            <div className="text-sm text-foreground-muted">
              {translations.studioEstimatedTimeRemaining} {formatTime(Math.max(0, estimatedTime - Math.floor(progress * estimatedTime / 100)))}
            </div>
          </div>

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={cancelGeneration}
              className="btn-outline btn-sm"
            >
              {translations.studioCancelGeneration}
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-elevated rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{translations.studioReadyToGenerate}</h3>
          <p className="text-foreground-muted mb-6">
            {translations.studioVideoCreatedWithSettings}
          </p>
          <button
            onClick={startGeneration}
            className="btn-primary btn-lg px-8 py-3"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {translations.studioStartGeneration}
          </button>
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
