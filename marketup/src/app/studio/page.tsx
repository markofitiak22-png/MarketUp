"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Step components
import AvatarStep from "@/components/wizard/AvatarStep";
import LanguageStep from "@/components/wizard/LanguageStep";
import BackgroundStep from "@/components/wizard/BackgroundStep";
import TextStep from "@/components/wizard/TextStep";
import GenerationStep from "@/components/wizard/GenerationStep";
import PreviewStep from "@/components/wizard/PreviewStep";

export interface WizardData {
  avatar: {
    id: string;
    name: string;
    image: string;
    gender: 'male' | 'female';
  } | null;
  language: {
    code: string;
    name: string;
    voice: {
      id: string;
      name: string;
      gender: 'male' | 'female';
      preview?: string;
    };
  } | null;
  background: {
    id: string;
    name: string;
    image: string;
    type: 'image' | 'video';
  } | null;
  text: string;
  settings: {
    duration: number;
    quality: 'standard' | 'hd' | '4k';
    format: 'mp4' | 'webm';
  };
}

const steps = [
  { id: 'avatar', title: 'Choose Avatar', description: 'Select your virtual presenter' },
  { id: 'language', title: 'Language & Voice', description: 'Pick language and voice' },
  { id: 'background', title: 'Background', description: 'Choose your scene' },
  { id: 'text', title: 'Script', description: 'Write your message' },
  { id: 'generation', title: 'Generate', description: 'Create your video' },
  { id: 'preview', title: 'Preview', description: 'Review and download' }
];

export default function VideoCreationWizard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    avatar: null,
    language: null,
    background: null,
    text: '',
    settings: {
      duration: 0,
      quality: 'hd',
      format: 'mp4'
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return wizardData.avatar !== null;
      case 1: return wizardData.language !== null;
      case 2: return wizardData.background !== null;
      case 3: return wizardData.text.trim().length > 0;
      case 4: return true; // Generation step
      case 5: return true; // Preview step
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AvatarStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <LanguageStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <BackgroundStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <TextStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <GenerationStep
            data={wizardData}
            onUpdate={updateWizardData}
            onNext={nextStep}
            onPrev={prevStep}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        );
      case 5:
        return (
          <PreviewStep
            data={wizardData}
            onUpdate={updateWizardData}
            onPrev={prevStep}
            onComplete={() => router.push('/dashboard/videos')}
          />
        );
      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-foreground-muted mb-6">Please sign in to create videos</p>
          <button
            onClick={() => router.push('/auth')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Create Video</h1>
                <p className="text-xs sm:text-sm text-foreground-muted">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-foreground-muted hidden sm:inline">Progress:</span>
                <div className="w-20 sm:w-32 bg-border rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-foreground-muted">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    index === currentStep
                      ? 'bg-accent text-white'
                      : index < currentStep
                      ? 'bg-accent/20 text-accent hover:bg-accent/30'
                      : 'text-foreground-muted cursor-not-allowed'
                  }`}
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs ${
                    index === currentStep
                      ? 'bg-white/20'
                      : index < currentStep
                      ? 'bg-accent'
                      : 'bg-border'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="hidden sm:block">{step.title}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-6 lg:w-8 h-px bg-border mx-1 lg:mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}