"use client";
import { useState, useEffect } from "react";
import { WizardData } from "@/app/studio/page";
import { useTranslations } from "@/hooks/useTranslations";
import { useSession } from "next-auth/react";

interface PreviewStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onPrev: () => void;
  onComplete: () => void;
}

export default function PreviewStep({ data, onUpdate, onPrev, onComplete }: PreviewStepProps) {
  const { translations } = useTranslations();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);
  const [allowedEdits, setAllowedEdits] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [exportType, setExportType] = useState<"download" | "social_media">("download");
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Function to fetch video info
  const fetchVideoInfo = async (videoIdToFetch: string) => {
    try {
      const response = await fetch(`/api/video/info/${videoIdToFetch}`, { credentials: 'include' });
      const videoData = await response.json();
      
      if (videoData.success) {
        setEditCount(videoData.editCount || 0);
        setSubscriptionTier(videoData.subscriptionTier);
        
        // Map tier to allowed edits
        const editLimits: Record<string, number> = {
          'BASIC': 0,
          'STANDARD': 1,
          'PREMIUM': 2,
        };
        setAllowedEdits(editLimits[videoData.subscriptionTier] || 0);
      }
    } catch (err) {
      console.error('Error fetching video info:', err);
    }
  };

  // Get video ID from session storage (set during generation)
  useEffect(() => {
    const storedVideoId = sessionStorage.getItem('currentVideoId');
    if (storedVideoId) {
      setVideoId(storedVideoId);
      setVideoUrl(`/api/video/stream/${storedVideoId}`);
      fetchVideoInfo(storedVideoId);
    }
  }, []);

  // Poll for video updates (in case it was just regenerated)
  useEffect(() => {
    if (!videoId) return;
    
    const pollInterval = setInterval(() => {
      fetchVideoInfo(videoId);
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(pollInterval);
  }, [videoId]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleDownload = async (type: "download" | "social_media" = "download") => {
    if (!videoId) return;
    
    // Check if edits are required but not used (for plans with edits)
    if (allowedEdits > 0 && editCount < allowedEdits) {
      const remaining = allowedEdits - editCount;
      alert(`You have ${remaining} edit${remaining > 1 ? 's' : ''} remaining. Please use all your edits before downloading or publishing.`);
      return;
    }
    
    setExportType(type);
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const response = await fetch(`/api/video/download/${videoId}?exportType=${type}`);
      const data = await response.json();
      
      if (data.success) {
        // Mark video as published
        await fetch(`/api/video/publish/${videoId}`, { 
          method: 'POST',
          credentials: 'include'
        });
        
        if (type === "download") {
          // Create download link
          const link = document.createElement('a');
          link.href = data.downloadUrl;
          link.download = data.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Social media export - show success message
          alert('Video exported successfully! Ready for social media publishing.');
        }
        
        setDownloadProgress(100);
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
          setShowExportOptions(false);
        }, 1000);
      } else {
        throw new Error(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleEdit = async () => {
    if (!videoId) return;
    
    // Check if user has edits remaining
    if (editCount >= allowedEdits) {
      alert(`You have used all ${allowedEdits} edit${allowedEdits > 1 ? 's' : ''} allowed for your plan.`);
      return;
    }
    
    setIsEditing(true);
    
    try {
      // Mark that we're editing so GenerationStep knows to use existingVideoId
      sessionStorage.setItem('isEditing', 'true');
      
      // Go back to text step to allow editing
      // This will allow user to modify the script
      onPrev();
      onPrev(); // Go back to text step
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to start editing. Please try again.');
      sessionStorage.removeItem('isEditing');
    } finally {
      setIsEditing(false);
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

            {/* Edit Count Info */}
            {allowedEdits > 0 && (
              <div className="mt-6 bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Edits remaining:</span>
                  <span className={`text-lg font-bold ${
                    (allowedEdits - editCount) > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {allowedEdits - editCount} / {allowedEdits}
                  </span>
                </div>
                {editCount < allowedEdits && (
                  <p className="text-xs text-yellow-400 mt-2">
                    You must use all {allowedEdits} edit{allowedEdits > 1 ? 's' : ''} before downloading or publishing.
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">{translations.studioActions}</h3>
              <div className="space-y-4">
                {/* Edit Button - only show if user has edits available */}
                {allowedEdits > 0 && editCount < allowedEdits && (
                  <button
                    onClick={handleEdit}
                    disabled={isEditing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Video ({allowedEdits - editCount} remaining)
                  </button>
                )}
                
                {/* Export Options */}
                {!showExportOptions ? (
                  <button
                    onClick={() => setShowExportOptions(true)}
                    disabled={isDownloading || (allowedEdits > 0 && editCount < allowedEdits)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Video
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleDownload("download")}
                      disabled={isDownloading || (allowedEdits > 0 && editCount < allowedEdits)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isDownloading && exportType === "download" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Downloading {downloadProgress}%
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download to Device
                        </>
                      )}
                    </button>
                    
                    {(subscriptionTier === "STANDARD" || subscriptionTier === "PREMIUM") && (
                      <button
                        onClick={() => handleDownload("social_media")}
                        disabled={isDownloading || (allowedEdits > 0 && editCount < allowedEdits)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isDownloading && exportType === "social_media" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Exporting {downloadProgress}%
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Export to Social Media (No Watermark)
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowExportOptions(false)}
                      className="w-full px-6 py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700/60 flex items-center justify-center gap-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {allowedEdits === 0 && (
                  <button
                    onClick={handleRegenerate}
                    className="w-full px-6 py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white font-semibold rounded-xl transition-all duration-300 border border-slate-700/60 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {translations.studioRegenerate}
                  </button>
                )}
                
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
