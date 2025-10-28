"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface TextStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const getTemplates = (translations: any) => [
  {
    id: 'welcome',
    title: translations.studioWelcomeMessage,
    text: 'Welcome to our company! We&apos;re excited to have you here and look forward to working with you.',
    category: translations.studioBusiness
  },
  {
    id: 'product',
    title: translations.studioProductIntroduction,
    text: 'Introducing our latest product that will revolutionize the way you work. With cutting-edge technology and user-friendly design.',
    category: translations.studioMarketing
  },
  {
    id: 'training',
    title: translations.studioTrainingIntroduction,
    text: 'Welcome to today&apos;s training session. We&apos;ll cover the key concepts and provide hands-on practice to help you succeed.',
    category: translations.studioEducation
  },
  {
    id: 'announcement',
    title: translations.studioCompanyAnnouncement,
    text: 'We have an important announcement to share with our team. This update will help us move forward together.',
    category: translations.studioBusiness
  },
  {
    id: 'tutorial',
    title: translations.studioTutorialIntroduction,
    text: 'In this tutorial, we&apos;ll walk you through the process step by step. Let&apos;s get started with the basics.',
    category: translations.studioEducation
  },
  {
    id: 'promotion',
    title: translations.studioSpecialOffer,
    text: 'Don&apos;t miss out on our limited-time offer! Get exclusive access to premium features at a special price.',
    category: translations.studioMarketing
  }
];

export default function TextStep({ data, onUpdate, onNext, onPrev }: TextStepProps) {
  const { translations } = useTranslations();
  const [text, setText] = useState(data.text || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  
  const templates = getTemplates(translations);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const wordsCount = words.length;
    
    setWordCount(wordsCount);
    setCharCount(chars);
    
    // Estimate duration: ~150 words per minute for natural speech
    const duration = Math.max(1, Math.ceil(wordsCount / 2.5));
    setEstimatedDuration(duration);
  }, [text]);

  // Separate effect for updating parent component
  useEffect(() => {
    if (estimatedDuration > 0) {
      onUpdate({
        text,
        settings: {
          ...data.settings,
          duration: estimatedDuration
        }
      });
    }
  }, [text, estimatedDuration]); // Removed onUpdate and data.settings from dependencies

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setText(template.text);
    setSelectedTemplate(template.id);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    setSelectedTemplate(null);
  };

  const handleNext = () => {
    if (text.trim().length > 0) {
      onNext();
    }
  };

  const getDurationColor = () => {
    if (estimatedDuration <= 30) return 'text-success';
    if (estimatedDuration <= 60) return 'text-warning';
    return 'text-error';
  };

  const getDurationLabel = () => {
    if (estimatedDuration <= 30) return translations.studioShort;
    if (estimatedDuration <= 60) return translations.studioMedium;
    return translations.studioLong;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
          {translations.studioWriteYourScript}
        </h1>
        <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioWriteTextAvatarSpeak} <span className="text-accent font-medium">{translations.studioStartWithTemplate}</span>
        </p>
      </div>

      {/* Templates */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioQuickTemplates}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20 scale-105'
                    : 'border-[var(--border)] hover:border-accent/50 hover:bg-accent/5 hover:scale-102'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground text-lg">{template.title}</h4>
                  <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-medium">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-foreground-muted line-clamp-3 leading-relaxed">
                  {template.text}
                </p>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Text Editor */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">{translations.studioYourScript}</h3>
            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <span className="font-medium">{wordCount} {translations.studioWords}</span>
              <span className="font-medium">{charCount} {translations.studioCharacters}</span>
              <span className={`font-bold ${getDurationColor()}`}>
                ~{estimatedDuration}s ({getDurationLabel()})
              </span>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6">
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={translations.studioWriteScriptHere}
              className="w-full h-64 resize-none bg-transparent text-foreground placeholder-foreground-muted focus:outline-none text-lg leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioWritingTips}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">{translations.studioNaturalSpeech}</h4>
                <p className="text-foreground-muted">{translations.studioWriteAsYouSpeak}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">{translations.studioOptimalLength}</h4>
                <p className="text-foreground-muted">{translations.studioKeepVideos30To120}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">{translations.studioClearStructure}</h4>
                <p className="text-foreground-muted">{translations.studioStartWithHook}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">{translations.studioPronunciation}</h4>
                <p className="text-foreground-muted">{translations.studioUsePhoneticSpelling}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {text && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-2/15 to-transparent rounded-bl-3xl" />
            
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioPreview}</h3>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">
                  {data.avatar?.gender === 'female' ? '👩' : '👨'}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground-muted mb-3 font-medium">
                  {data.avatar?.name} • {data.language?.name} • ~{estimatedDuration}s
                </div>
                <div className="text-foreground leading-relaxed text-lg">
                  {text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onPrev}
          className="group btn-outline btn-lg px-8 py-4 text-lg font-semibold hover:bg-accent/5 transition-all duration-300 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!text.trim()}
          className="group relative btn-primary btn-lg px-8 py-4 text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-3">
            {translations.studioContinue}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-2 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
}
