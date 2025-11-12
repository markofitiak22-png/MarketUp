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
    gender: 'male' | 'female' | 'neutral';
    voice: {
      id: string;
      name: string;
      gender: 'male' | 'female' | 'neutral';
      language: string;
    };
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
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 relative">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center max-w-md mx-auto relative z-10">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl p-8 shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{translations.studioAccessDenied}</h1>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6">{translations.studioSignInRequired}</p>
            <button
              onClick={() => router.push('/auth')}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              {translations.studioSignIn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative">
      {/* Shared background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top left blob */}
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Top right blob */}
        <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Middle left blob */}
        <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Middle right blob */}
        <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        {/* Bottom left blob */}
        <div className="absolute top-[80%] left-[15%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Bottom right blob */}
        <div className="absolute top-[90%] right-[5%] w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        {/* Additional connecting blobs */}
        <div className="absolute top-[35%] left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[45%] right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[70%] left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[75%] right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Main Content */}
        <div>
          <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-7xl mx-auto">
              {/* Badge with decorative lines */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  <span>{translations.studioStep} {currentStep + 1} {translations.studioOf} {steps.length}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
              </div>
              
              {/* Step Content */}
              <div>
                {renderCurrentStep()}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}