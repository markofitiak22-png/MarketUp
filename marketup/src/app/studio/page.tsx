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
    <div className="min-h-screen bg-background relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/3 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-2/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <span className="text-lg font-bold text-gradient bg-gradient-to-r from-foreground to-foreground-muted bg-clip-text text-transparent">
                  MarketUp Studio
                </span>
              </div>
              <div className="text-sm text-foreground-muted">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <section className=" pt-12 text-center">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                {/* Step Badge */}
                <div className="mx-auto glass-glow rounded-2xl px-8 py-4 inline-flex items-center gap-3 text-sm border border-accent/20 mb-12">
                  <div className="w-3 h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                  <span className="text-gradient font-semibold text-base">Step {currentStep + 1} of {steps.length}</span>
                  <div className="w-2 h-2 bg-accent-2 rounded-full animate-ping" />
                </div>
                
                {/* Step Content */}
                <div className="animate-fade-in">
                  {renderCurrentStep()}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}