"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";

interface PreviewStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onPrev: () => void;
  onComplete: () => void;
}

export default function PreviewStep({ data, onUpdate, onPrev, onComplete }: PreviewStepProps) {
  const { translations } = useTranslations();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Get video ID from session storage (set during generation)
  useEffect(() => {
    const storedVideoId = sessionStorage.getItem('currentVideoId');
    if (storedVideoId) {
      setVideoId(storedVideoId);
      setVideoUrl(`/api/video/stream/${storedVideoId}`);
    }
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleDownload = async () => {
    if (!videoId) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const response = await fetch(`/api/video/download/${videoId}`);
      const data = await response.json();
      
      if (data.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadProgress(100);
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
        }, 1000);
      } else {
        throw new Error(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleRegenerate = () => {
    // Reset to generation step
    onUpdate({});
  };

  const videoStats = {
    duration: data.settings.duration,
    quality: data.settings.quality.toUpperCase(),
    format: data.settings.format.toUpperCase(),
    size: '2.4 MB',
    resolution: data.settings.quality === '4k' ? '3840x2160' : data.settings.quality === 'hd' ? '1920x1080' : '1280x720'
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.9] mb-4 sm:mb-6">
          <span className="block bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            {translations.studioYourVideoReady}
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
          {translations.studioReviewGeneratedVideo}
        </p>
      </div>

      {/* Video Preview and Video Settings in Row */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Preview with Actions */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="text-white/70">
                      {translations.studioLoadingVideo || "Loading video..."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
                <div className="text-2xl font-bold text-white">{videoStats.duration}s</div>
                <div className="text-sm text-white/60">{translations.studioDuration}</div>
              </div>
              <div className="text-center bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
                <div className="text-2xl font-bold text-white">{videoStats.quality}</div>
                <div className="text-sm text-white/60">{translations.studioQuality}</div>
              </div>
              <div className="text-center bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
                <div className="text-2xl font-bold text-white">{videoStats.format}</div>
                <div className="text-sm text-white/60">{translations.studioFormat}</div>
              </div>
              <div className="text-center bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
                <div className="text-2xl font-bold text-white">{videoStats.size}</div>
                <div className="text-sm text-white/60">{translations.studioFileSize}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">{translations.studioActions}</h3>
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {translations.studioDownloading} {downloadProgress}%
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {translations.studioDownloadVideo}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleRegenerate}
                  className="w-full px-6 py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700/60 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {translations.studioRegenerate}
                </button>
                
                <button
                  onClick={onComplete}
                  className="w-full px-6 py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700/60 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translations.studioSaveContinue}
                </button>
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="space-y-6">
            {/* Settings Summary */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{translations.studioVideoSettings}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{translations.studioAvatar}</span>
                  <span className="font-medium text-white">{data.avatar?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{translations.studioVoice}</span>
                  <span className="font-medium text-white">{data.language?.voice.name} ({data.language?.name})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{translations.studioBackground}</span>
                  <span className="font-medium text-white">{data.backgrounds?.[0]?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{translations.studioResolution}</span>
                  <span className="font-medium text-white">{videoStats.resolution}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">{translations.studioScriptLength}</span>
                  <span className="font-medium text-white">{data.text.split(' ').length} {translations.studioWords}</span>
                </div>
              </div>
            </div>

            {/* Script Preview */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{translations.studioScript}</h3>
              <div className="bg-slate-800/40 rounded-lg p-4 max-h-48 overflow-y-auto border border-slate-700/60">
                <p className="text-white/80 leading-relaxed">{data.text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Progress */}
      {isDownloading && (
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{translations.studioDownloadProgress}</span>
              <span className="text-sm text-white/60">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800/40 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

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
      </div>
    </div>
  );
}
