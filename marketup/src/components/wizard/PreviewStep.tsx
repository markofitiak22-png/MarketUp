"use client";
import { useState } from "react";
import { WizardData } from "@/app/studio/page";

interface PreviewStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
  onPrev: () => void;
  onComplete: () => void;
}

export default function PreviewStep({ data, onUpdate, onPrev, onComplete }: PreviewStepProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    // Simulate video playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Your Video is Ready!</h2>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Review your generated video and download it when you're satisfied with the result.
        </p>
      </div>

      {/* Video Preview */}
      <div className="glass-elevated rounded-2xl p-8">
        <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-xl overflow-hidden relative">
          {/* Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center">
                {isPlaying ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </div>
              <div className="text-foreground-muted">
                {isPlaying ? 'Playing...' : 'Click to preview'}
              </div>
            </div>
          </div>
          
          {/* Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-accent ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{videoStats.duration}s</div>
            <div className="text-sm text-foreground-muted">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{videoStats.quality}</div>
            <div className="text-sm text-foreground-muted">Quality</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{videoStats.format}</div>
            <div className="text-sm text-foreground-muted">Format</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{videoStats.size}</div>
            <div className="text-sm text-foreground-muted">File Size</div>
          </div>
        </div>
      </div>

      {/* Video Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Video Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Avatar</span>
              <span className="font-medium text-foreground">{data.avatar?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Voice</span>
              <span className="font-medium text-foreground">{data.language?.voice.name} ({data.language?.name})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Background</span>
              <span className="font-medium text-foreground">{data.background?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Resolution</span>
              <span className="font-medium text-foreground">{videoStats.resolution}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Script Length</span>
              <span className="font-medium text-foreground">{data.text.split(' ').length} words</span>
            </div>
          </div>
        </div>

        {/* Script Preview */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Script</h3>
          <div className="bg-surface-elevated rounded-lg p-4 max-h-48 overflow-y-auto">
            <p className="text-foreground leading-relaxed">{data.text}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="glass-elevated rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Downloading... {downloadProgress}%
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Video
              </>
            )}
          </button>
          
          <button
            onClick={handleRegenerate}
            className="btn-outline btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate
          </button>
          
          <button
            onClick={onComplete}
            className="btn-outline btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save & Continue
          </button>
        </div>
      </div>

      {/* Download Progress */}
      {isDownloading && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Download Progress</span>
            <span className="text-sm text-foreground-muted">{downloadProgress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
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
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground-muted">
            Video generated successfully
          </span>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
