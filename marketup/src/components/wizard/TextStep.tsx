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
  const [isPlaying, setIsPlaying] = useState(false);
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
  };

  const handleNext = () => {
    if (text.trim().length > 0) {
      onNext();
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

  const getDurationLabel = () => {
    if (estimatedDuration <= 30) return translations.studioShort;
    if (estimatedDuration <= 60) return translations.studioMedium;
    return translations.studioLong;
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            {translations.studioWriteYourScript}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioWriteTextAvatarSpeak} <span className="text-indigo-400 font-medium">{translations.studioStartWithTemplate}</span>
        </p>
      </div>

      {/* Templates */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">{translations.studioQuickTemplates}</h3>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'bg-slate-800/40 text-white/60 hover:text-white hover:bg-slate-800/60 border border-slate-700/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group relative p-4 sm:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500/60 bg-slate-800/80 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                    : 'border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40 hover:bg-slate-800/60 hover:scale-[1.01]'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base">{template.title}</h4>
                    <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full font-medium inline-block mt-1">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/60 line-clamp-3 leading-relaxed">
                  {template.text}
                </p>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
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
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{translations.studioYourScript}</h3>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
                <span className="font-medium">{wordCount} {translations.studioWords}</span>
                <span className="font-medium">{charCount} {translations.studioCharacters}</span>
                <span className={`font-bold ${estimatedDuration <= 30 ? 'text-green-400' : estimatedDuration <= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  ~{estimatedDuration}s ({getDurationLabel()})
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={isPlaying ? handleStopPreview : handlePlayPreview}
                disabled={!text.trim()}
                className={`px-3 py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
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
            </div>
          </div>
          
          <div className="bg-slate-800/40 rounded-xl p-4 sm:p-6 border border-slate-700/60">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={translations.studioWriteScriptHere}
              className="w-full h-64 resize-none bg-transparent text-white placeholder-white/40 focus:outline-none text-base sm:text-lg leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        <button
          onClick={onPrev}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#1a1a1a] hover:bg-[#222222] text-white rounded-full transition-all duration-300 border border-[#3a3a3a] flex items-center gap-2 sm:gap-3"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {translations.studioBack}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!text.trim()}
          className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3"
        >
          {translations.studioContinue}
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
