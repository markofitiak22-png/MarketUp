"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";

interface TextStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const templates = [
  {
    id: 'welcome',
    title: 'Welcome Message',
    text: 'Welcome to our company! We\'re excited to have you here and look forward to working with you.',
    category: 'Business'
  },
  {
    id: 'product',
    title: 'Product Introduction',
    text: 'Introducing our latest product that will revolutionize the way you work. With cutting-edge technology and user-friendly design.',
    category: 'Marketing'
  },
  {
    id: 'training',
    title: 'Training Introduction',
    text: 'Welcome to today\'s training session. We\'ll cover the key concepts and provide hands-on practice to help you succeed.',
    category: 'Education'
  },
  {
    id: 'announcement',
    title: 'Company Announcement',
    text: 'We have an important announcement to share with our team. This update will help us move forward together.',
    category: 'Business'
  },
  {
    id: 'tutorial',
    title: 'Tutorial Introduction',
    text: 'In this tutorial, we\'ll walk you through the process step by step. Let\'s get started with the basics.',
    category: 'Education'
  },
  {
    id: 'promotion',
    title: 'Special Offer',
    text: 'Don\'t miss out on our limited-time offer! Get exclusive access to premium features at a special price.',
    category: 'Marketing'
  }
];

export default function TextStep({ data, onUpdate, onNext, onPrev }: TextStepProps) {
  const [text, setText] = useState(data.text || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;
    const wordsCount = words.length;
    
    setWordCount(wordsCount);
    setCharCount(chars);
    
    // Estimate duration: ~150 words per minute for natural speech
    const duration = Math.max(1, Math.ceil(wordsCount / 2.5));
    setEstimatedDuration(duration);
    
    onUpdate({
      text,
      settings: {
        ...data.settings,
        duration
      }
    });
  }, [text, data.settings, onUpdate]);

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
    if (estimatedDuration <= 30) return 'Short';
    if (estimatedDuration <= 60) return 'Medium';
    return 'Long';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Write Your Script</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Write the text that your avatar will speak. You can start with a template or write your own content.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Quick Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-accent bg-accent/10'
                  : 'hover:bg-surface-elevated'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{template.title}</h4>
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-foreground-muted line-clamp-3">
                {template.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Text Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Your Script</h3>
          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <span className={getDurationColor()}>
              ~{estimatedDuration}s ({getDurationLabel()})
            </span>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Write your script here... Your avatar will speak this text naturally."
            className="w-full h-64 resize-none bg-transparent text-foreground placeholder-foreground-muted focus:outline-none text-lg leading-relaxed"
          />
        </div>
      </div>

      {/* Tips */}
      <div className="glass-elevated rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Writing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Natural Speech</h4>
              <p className="text-sm text-foreground-muted">Write as you would speak naturally, with pauses and emphasis.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Optimal Length</h4>
              <p className="text-sm text-foreground-muted">Keep videos between 30-120 seconds for best engagement.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Clear Structure</h4>
              <p className="text-sm text-foreground-muted">Start with a hook, deliver your message, and end with a call to action.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Pronunciation</h4>
              <p className="text-sm text-foreground-muted">Use phonetic spelling for difficult words: "AI" as "A-I".</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {text && (
        <div className="glass-elevated rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">
                {data.avatar?.gender === 'female' ? '👩' : '👨'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-foreground-muted mb-2">
                {data.avatar?.name} • {data.language?.name} • ~{estimatedDuration}s
              </div>
              <div className="text-foreground leading-relaxed">
                {text}
              </div>
            </div>
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
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!text.trim()}
          className="btn-primary btn-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
