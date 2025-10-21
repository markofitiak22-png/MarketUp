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
  }, [text]);

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
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-6">
          Write your <span className="text-gradient bg-gradient-to-r from-accent via-accent-2 to-purple-500 bg-clip-text text-transparent">script</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed font-light">
          Write the text that your avatar will speak. <span className="text-accent font-medium">You can start with a template or write your own content.</span>
        </p>
      </div>

      {/* Templates */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Templates</h3>
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
            <h3 className="text-2xl font-bold text-foreground">Your Script</h3>
            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <span className="font-medium">{wordCount} words</span>
              <span className="font-medium">{charCount} characters</span>
              <span className={`font-bold ${getDurationColor()}`}>
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
      </div>

      {/* Tips */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Writing Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">Natural Speech</h4>
                <p className="text-foreground-muted">Write as you would speak naturally, with pauses and emphasis.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">Optimal Length</h4>
                <p className="text-foreground-muted">Keep videos between 30-120 seconds for best engagement.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">Clear Structure</h4>
                <p className="text-foreground-muted">Start with a hook, deliver your message, and end with a call to action.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-2/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-accent-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-lg mb-2">Pronunciation</h4>
                <p className="text-foreground-muted">Use phonetic spelling for difficult words: "AI" as "A-I".</p>
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
            
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Preview</h3>
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
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!text.trim()}
          className="group relative btn-primary btn-lg px-8 py-4 text-lg font-bold overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-3">
            Continue
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
