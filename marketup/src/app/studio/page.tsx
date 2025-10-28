"use client";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

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
      accent: string;
      tone: 'professional' | 'energetic' | 'calm' | 'expressive';
      preview?: string;
    };
  } | null;
  backgrounds: {
    id: string;
    name: string;
    image: string;
    type: 'image' | 'video';
    category: string;
    description: string;
  }[] | null;
  text: string;
  settings: {
    duration: number;
    quality: 'standard' | 'hd' | '4k';
    format: 'mp4' | 'webm';
  };
}

const getSteps = (translations: any) => [
  { id: 'avatar', title: translations.studioChooseAvatar, description: translations.studioSelectPresenter },
  { id: 'language', title: translations.studioLanguageVoice, description: translations.studioPickLanguage },
  { id: 'background', title: translations.studioBackgrounds, description: translations.studioChooseScenes },
  { id: 'text', title: translations.studioScript, description: translations.studioWriteMessage },
  { id: 'generation', title: translations.studioGenerate, description: translations.studioCreateVideo },
  { id: 'preview', title: translations.studioPreview, description: translations.studioReviewDownload }
];

export default function VideoCreationWizard() {
  const { data: session } = useSession();
  const router = useRouter();
  const { translations } = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = getSteps(translations);
  const [wizardData, setWizardData] = useState<WizardData>({
    avatar: null,
    language: null,
    backgrounds: null,
    text: '',
    settings: {
      duration: 0,
      quality: 'hd',
      format: 'mp4'
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateWizardData = useCallback((updates: Partial<WizardData>) => {
    setWizardData(prev => {
      // Only update if there are actual changes
      const hasChanges = Object.keys(updates).some(key => {
        const updateValue = updates[key as keyof WizardData];
        const currentValue = prev[key as keyof WizardData];
        
        if (key === 'settings' && updateValue && typeof updateValue === 'object') {
          return JSON.stringify(updateValue) !== JSON.stringify(currentValue);
        }
        
        return updateValue !== currentValue;
      });
      
      if (!hasChanges) {
        return prev;
      }
      
      return { ...prev, ...updates };
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // const goToStep = (stepIndex: number) => {
  //   setCurrentStep(stepIndex);
  // };

  // const canProceed = () => {
  //   switch (currentStep) {
  //     case 0: return wizardData.avatar !== null;
  //     case 1: return wizardData.language !== null;
  //     case 2: return wizardData.background !== null;
  //     case 3: return wizardData.text.trim().length > 0;
  //     case 4: return true; // Generation step
  //     case 5: return true; // Preview step
  //     default: return false;
  //   }
  // };

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
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">{translations.studioAccessDenied}</h1>
          <p className="text-sm sm:text-base text-foreground-muted mb-4 sm:mb-6">{translations.studioSignInRequired}</p>
          <button
            onClick={() => router.push('/auth')}
            className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold"
          >
            {translations.studioSignIn}
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
       

        {/* Main Content */}
        <div>
          <section className="pt-16 sm:pt-20 text-center">
            <div className="container px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                {/* Step Badge */}
                <div className="mx-auto glass-glow rounded-xl sm:rounded-2xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm border border-accent/20 mb-8 sm:mb-12">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-accent to-accent-2 rounded-full animate-pulse" />
                  <span className="text-gradient font-semibold text-sm sm:text-base">{translations.studioStep} {currentStep + 1} {translations.studioOf} {steps.length}</span>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-2 rounded-full animate-ping" />
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