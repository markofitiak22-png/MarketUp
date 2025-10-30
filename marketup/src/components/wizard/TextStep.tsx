"use client";
import { useState, useEffect, useRef } from "react";
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
    text: 'Welcome to our company! We\'re excited to have you here and look forward to working with you. Our team is dedicated to providing you with the best experience possible. Let\'s make great things happen together!',
    category: translations.studioBusiness,
    icon: '👋'
  },
  {
    id: 'product',
    title: translations.studioProductIntroduction,
    text: 'Introducing our latest product that will revolutionize the way you work. With cutting-edge technology and user-friendly design, we\'ve created something truly special. Experience innovation at its finest!',
    category: translations.studioMarketing,
    icon: '🚀'
  },
  {
    id: 'training',
    title: translations.studioTrainingIntroduction,
    text: 'Welcome to today\'s training session! We\'ll cover the key concepts and provide hands-on practice to help you succeed. By the end of this session, you\'ll have all the tools you need to excel.',
    category: translations.studioEducation,
    icon: '📚'
  },
  {
    id: 'announcement',
    title: translations.studioCompanyAnnouncement,
    text: 'We have an important announcement to share with our team. This exciting update will help us move forward together and achieve our goals. Thank you for being part of our journey!',
    category: translations.studioBusiness,
    icon: '📢'
  },
  {
    id: 'tutorial',
    title: translations.studioTutorialIntroduction,
    text: 'In this tutorial, we\'ll walk you through the process step by step. Let\'s get started with the basics and build your skills. Follow along and you\'ll be a pro in no time!',
    category: translations.studioEducation,
    icon: '🎓'
  },
  {
    id: 'promotion',
    title: translations.studioSpecialOffer,
    text: 'Don\'t miss out on our limited-time offer! Get exclusive access to premium features at a special price. This deal won\'t last long, so act now and transform your experience!',
    category: translations.studioMarketing,
    icon: '🎁'
  },
  {
    id: 'testimonial',
    title: 'Customer Testimonial',
    text: 'I\'ve been using this service for months now, and it has completely transformed my workflow. The results speak for themselves. I highly recommend it to anyone looking to boost their productivity!',
    category: translations.studioMarketing,
    icon: '⭐'
  },
  {
    id: 'howto',
    title: 'How-To Guide',
    text: 'Let me show you exactly how to accomplish this task efficiently. First, we\'ll set up the basics. Then, we\'ll explore the advanced features. Finally, you\'ll have everything you need to succeed.',
    category: translations.studioEducation,
    icon: '📝'
  },
  {
    id: 'update',
    title: 'Product Update',
    text: 'We\'ve just released exciting new features that will enhance your experience. These updates are based on your valuable feedback. Let\'s explore what\'s new and how you can benefit!',
    category: translations.studioBusiness,
    icon: '🔄'
  }
];

export default function TextStep({ data, onUpdate, onNext, onPrev }: TextStepProps) {
  const { translations } = useTranslations();
  const [text, setText] = useState(data.text || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const templates = getTemplates(translations);
  
  const categories = ['All', translations.studioBusiness, translations.studioMarketing, translations.studioEducation];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

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
    setIsSaved(false);
  };

  const handleNext = () => {
    if (text.trim().length > 0) {
      onNext();
    }
  };
  
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedText = `Based on your prompt "${aiPrompt}", here's a professional script: This is an engaging introduction that captures attention. We'll guide you through the key points with clarity and enthusiasm. Let's explore this topic together and discover valuable insights!`;
      
      setText(generatedText);
      setSelectedTemplate(null);
      setAiPrompt('');
      setShowAiGenerator(false);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePlayPreview = () => {
    if (!text || isPlaying) return;
    
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    speechSynthesis.speak(utterance);
  };
  
  const handleStopPreview = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  const handleClearText = () => {
    if (confirm('Are you sure you want to clear all text?')) {
      setText('');
      setSelectedTemplate(null);
    }
  };
  
  const handleSaveDraft = () => {
    localStorage.setItem('video_script_draft', text);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const handleLoadDraft = () => {
    const draft = localStorage.getItem('video_script_draft');
    if (draft) {
      setText(draft);
      setSelectedTemplate(null);
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

      {/* AI Generator */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-3xl" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">AI Script Generator</h3>
                <p className="text-sm text-foreground-muted">Let AI write your script in seconds</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiGenerator(!showAiGenerator)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
            >
              {showAiGenerator ? 'Hide' : 'Show'} AI Generator
            </button>
          </div>
          
          {showAiGenerator && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe what you want to say... (e.g., 'A welcoming message for new customers about our eco-friendly products')"
                className="w-full h-24 resize-none bg-transparent text-foreground placeholder-foreground-muted focus:outline-none text-base leading-relaxed border border-accent/20 rounded-xl p-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAiGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Generate Script
                    </>
                  )}
                </button>
                <button
                  onClick={() => setAiPrompt('')}
                  className="px-6 py-3 rounded-xl border border-accent/30 text-foreground font-semibold hover:bg-accent/5 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Templates */}
      <div className="max-w-5xl mx-auto">
        <div className="glass-elevated rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/15 to-transparent rounded-bl-3xl" />
          
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{translations.studioQuickTemplates}</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg'
                    : 'bg-surface-elevated text-foreground-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20 scale-105'
                    : 'border-[var(--border)] hover:border-accent/50 hover:bg-accent/5 hover:scale-102'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-base">{template.title}</h4>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full font-medium inline-block mt-1">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground-muted line-clamp-3 leading-relaxed">
                  {template.text}
                </p>
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
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
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{translations.studioYourScript}</h3>
              <div className="flex items-center gap-4 text-sm text-foreground-muted mt-2">
                <span className="font-medium">{wordCount} {translations.studioWords}</span>
                <span className="font-medium">{charCount} {translations.studioCharacters}</span>
                <span className={`font-bold ${getDurationColor()}`}>
                  ~{estimatedDuration}s ({getDurationLabel()})
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleLoadDraft}
                className="px-3 py-2 rounded-lg border border-accent/30 text-foreground text-sm font-medium hover:bg-accent/5 transition-all flex items-center gap-2"
                title="Load saved draft"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Load
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={!text.trim()}
                className="px-3 py-2 rounded-lg border border-accent/30 text-foreground text-sm font-medium hover:bg-accent/5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save as draft"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {isSaved ? '✓ Saved' : 'Save'}
              </button>
              <button
                onClick={isPlaying ? handleStopPreview : handlePlayPreview}
                disabled={!text.trim()}
                className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-accent to-accent-2 hover:shadow-lg'
                }`}
                title={isPlaying ? 'Stop preview' : 'Play preview'}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play
                  </>
                )}
              </button>
              <button
                onClick={handleClearText}
                disabled={!text.trim()}
                className="px-3 py-2 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear all text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={translations.studioWriteScriptHere}
              className="w-full h-64 resize-none bg-transparent text-foreground placeholder-foreground-muted focus:outline-none text-lg leading-relaxed"
            />
          </div>
          
          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-foreground-muted font-medium">Quick actions:</span>
            <button
              onClick={() => setText(text + ' Hello!')}
              className="px-3 py-1 rounded-lg bg-surface text-foreground text-xs font-medium hover:bg-accent/10 transition-all"
            >
              + Add Greeting
            </button>
            <button
              onClick={() => setText(text + ' Thank you for watching!')}
              className="px-3 py-1 rounded-lg bg-surface text-foreground text-xs font-medium hover:bg-accent/10 transition-all"
            >
              + Add Closing
            </button>
            <button
              onClick={() => setText(text + ' Don\'t forget to subscribe!')}
              className="px-3 py-1 rounded-lg bg-surface text-foreground text-xs font-medium hover:bg-accent/10 transition-all"
            >
              + Call to Action
            </button>
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
