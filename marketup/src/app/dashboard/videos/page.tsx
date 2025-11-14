"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

interface Video {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  duration: string;
  thumbnail: string;
  views: number;
  downloads: number;
  videoUrl?: string;
  metadata?: {
    quality?: string;
    format?: string;
    fileSize?: number;
    resolution?: string;
  };
}

export default function VideosPage() {
  const { translations } = useTranslations();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareVideo, setShareVideo] = useState<Video | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'loading';
  }>({ show: false, message: '', type: 'info' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch videos from API
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filter !== 'all' && { status: filter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/dashboard/videos?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Auto-close notification after 3 seconds for success/info messages
  useEffect(() => {
    if (notification.show && (notification.type === 'success' || notification.type === 'info')) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: 'info' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.type]);


  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        fetchVideos();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchVideos]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filtering
  };

  const handleVideoAction = async (action: string, videoId: string) => {
    switch (action) {
      case 'download':
        try {
          const video = videos.find(v => v.id === videoId);
          if (!video) {
            setNotification({ show: true, message: translations.videosVideoNotFound || 'Video not found', type: 'error' });
            return;
          }

          if (!video.videoUrl) {
            setNotification({ show: true, message: translations.videosVideoNotAvailable || 'Video is not available for download', type: 'error' });
            return;
          }

          // Fetch the video file as blob
          const response = await fetch(video.videoUrl);
          if (!response.ok) {
            throw new Error('Failed to fetch video');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Determine file extension from content type or default to mp4
          const contentType = response.headers.get('content-type') || 'video/mp4';
          const extension = contentType.includes('webm') ? 'webm' : 
                           contentType.includes('mov') ? 'mov' : 
                           contentType.includes('avi') ? 'avi' : 'mp4';
          
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = `${video.title || `video-${videoId}`}.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the object URL
          window.URL.revokeObjectURL(url);

          // Optionally update download count (if you have an API for that)
          // await fetch(`/api/dashboard/videos/${videoId}/download`, { method: 'POST' });
        } catch (error) {
          console.error('Error downloading video:', error);
          setNotification({ show: true, message: translations.videosDownloadError || 'Failed to download video', type: 'error' });
        }
        break;
      case 'share':
        const videoToShare = videos.find(v => v.id === videoId);
        if (!videoToShare) {
          setNotification({ show: true, message: translations.videosVideoNotFound || 'Video not found', type: 'error' });
          return;
        }
        if (!videoToShare.videoUrl) {
          setNotification({ show: true, message: translations.videosVideoNotAvailable || 'Video is not available for sharing', type: 'error' });
          return;
        }
        setShareVideo(videoToShare);
        setEditingTitle(videoToShare.title);
        setShowShareModal(true);
        setLinkCopied(false);
        break;
      case 'delete':
        setVideoToDelete(videoId);
        setShowDeleteConfirm(true);
        break;
      case 'duplicate':
        try {
          const videoToDuplicate = videos.find(v => v.id === videoId);
          if (!videoToDuplicate) {
            setNotification({ show: true, message: translations.videosVideoNotFound || 'Video not found', type: 'error' });
            return;
          }

          // Show loading message
          const loadingMessage = translations.videosDuplicating || 'Duplicating video...';
          setNotification({ show: true, message: loadingMessage, type: 'loading' });

          const response = await fetch('/api/dashboard/videos/duplicate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ videoId })
          });

          const data = await response.json();

          if (data.success) {
            setNotification({ show: true, message: translations.videosDuplicateSuccess || 'Video duplication started successfully!', type: 'success' });
            // Refresh videos list
            fetchVideos();
          } else {
            setNotification({ show: true, message: data.message || translations.videosDuplicateError || 'Failed to duplicate video', type: 'error' });
          }
        } catch (error) {
          console.error('Error duplicating video:', error);
          setNotification({ show: true, message: translations.videosDuplicateError || 'Failed to duplicate video', type: 'error' });
        }
        break;
    }
  };


  return (
    <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
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
      
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header Section with Badge */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
            <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="hidden sm:block w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-xs sm:text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>My Videos</span>
            </div>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-indigo-500" />
            <div className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                {translations.videosMyVideos.split(' ')[0]} <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{translations.videosMyVideos.split(' ')[1]}</span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-white/60">{translations.videosManageViewAll}</p>
            </div>
            <Link
              href="/studio"
              className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {translations.videosCreateNewVideo}
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden mb-4 sm:mb-6 lg:mb-8">
          <div className="relative z-10">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={translations.videosSearchVideos}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base"
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["all", "completed", "processing", "queued"].map((status) => {
                  const getFilterText = (status: string) => {
                    switch (status) {
                      case "all": return translations.videosAll;
                      case "completed": return translations.videosCompleted;
                      case "processing": return translations.videosProcessing;
                      case "queued": return translations.videosQueued;
                      default: return status.charAt(0).toUpperCase() + status.slice(1);
                    }
                  };
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleFilterChange(status)}
                      className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 ${
                        filter === status
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-800/40 text-white/60 hover:text-white hover:bg-slate-800/60 border border-slate-700/60"
                      }`}
                    >
                      {getFilterText(status)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"></div>
              <p className="text-sm sm:text-base lg:text-lg text-white/60">{translations.videosLoadingVideos}</p>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 relative">
            {videos.map((video) => (
            <div key={video.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 group relative">
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-1 truncate">{video.title}</h3>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{video.createdAt}</p>
                  </div>
                </div>
            
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-white/60">{translations.videosStatus}</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${
                      video.status === "Completed" ? "bg-green-500/20 text-green-400" :
                      video.status === "Processing" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {video.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-white/60">{translations.videosDuration}</span>
                    <span className="text-[10px] sm:text-xs font-semibold text-white">{video.duration}</span>
                  </div>
                  
                  {video.status === "Completed" && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-white/60">{translations.videosViews}</span>
                        <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{video.views.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-white/60">{translations.videosDownloads}</span>
                        <span className="text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{video.downloads}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700/60">
                  {/* Download and Share buttons - visible on all screens */}
                  {video.status === "Completed" && (
                    <>
                      <button 
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-indigo-500/40 text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                        onClick={() => handleVideoAction('download', video.id)}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {translations.videosDownload}
                      </button>
                      
                      <button 
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-purple-500/40 text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                        onClick={() => handleVideoAction('share', video.id)}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        {translations.videosShare}
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-slate-600/60 text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                    onClick={() => handleVideoAction('duplicate', video.id)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {translations.videosDuplicate}
                  </button>
                  
                  <button 
                    className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-800/40 hover:bg-red-500/10 text-red-400 rounded-lg border border-slate-700/60 hover:border-red-500/40 text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                    onClick={() => handleVideoAction('delete', video.id)}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {translations.videosDelete}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.videosNoVideosFound}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/60 mb-4 sm:mb-6">
                {searchTerm ? translations.videosTryAdjustingSearch : translations.videosCreateFirstVideo}
              </p>
              <Link
                href="/studio"
                className="inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {translations.videosCreateVideo}
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && videos.length > 0 && (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 relative overflow-hidden mt-4 sm:mt-6 lg:mt-8">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm lg:text-base text-white/60">
                  {translations.videosPage} <span className="font-bold text-white">{page}</span> {translations.videosOf} <span className="font-bold text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-indigo-500/40 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2" 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">{translations.videosPrevious}</span>
                    <span className="sm:hidden">{translations.videosPrev}</span>
                  </button>
                  <button 
                    className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg border border-slate-700/60 hover:border-indigo-500/40 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <span className="hidden sm:inline">{translations.videosNext}</span>
                    <span className="sm:hidden">{translations.videosNext}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && shareVideo && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShareModal(false);
              setShareVideo(null);
              setLinkCopied(false);
              setEditingTitle("");
            }
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <div className="p-4 sm:p-6 border-b border-slate-700/60">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {translations.videosShareVideo}
                </h2>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setShareVideo(null);
                    setLinkCopied(false);
                    setEditingTitle("");
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Video Info */}
              <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/60">
                <label className="block text-sm text-white/60 mb-2">Title</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                    onBlur={async () => {
                      if (editingTitle.trim() && editingTitle !== shareVideo.title) {
                        setSavingTitle(true);
                        try {
                          const response = await fetch('/api/dashboard/videos', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              videoId: shareVideo.id,
                              title: editingTitle.trim()
                            })
                          });
                          const data = await response.json();
                          if (data.success) {
                            setShareVideo({ ...shareVideo, title: editingTitle.trim() });
                            // Update video in the list
                            setVideos(videos.map(v => 
                              v.id === shareVideo.id 
                                ? { ...v, title: editingTitle.trim() }
                                : v
                            ));
                          }
                        } catch (error) {
                          console.error('Error updating title:', error);
                          setEditingTitle(shareVideo.title); // Revert on error
                        } finally {
                          setSavingTitle(false);
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700/60 bg-slate-900/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    disabled={savingTitle}
                  />
                  {savingTitle && (
                    <div className="flex items-center px-2">
                      <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Link Section */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-white mb-2">
                  {translations.videosCopyLink}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareVideo.videoUrl}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(shareVideo.videoUrl || '');
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 2000);
                      } catch (error) {
                        console.error('Failed to copy link:', error);
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = shareVideo.videoUrl || '';
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                          document.execCommand('copy');
                          setLinkCopied(true);
                          setTimeout(() => setLinkCopied(false), 2000);
                        } catch (err) {
                          console.error('Fallback copy failed:', err);
                        }
                        document.body.removeChild(textArea);
                      }
                    }}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 ${
                      linkCopied
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border border-indigo-500/30'
                    }`}
                  >
                    {linkCopied ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {translations.videosLinkCopied}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {translations.videosCopyLink}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-white mb-3">
                  {translations.videosShare || "Share on"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(shareVideo.videoUrl || '');
                      const text = encodeURIComponent(shareVideo.title);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
                    }}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300 text-xs sm:text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="hidden sm:inline">Facebook</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(shareVideo.videoUrl || '');
                      const text = encodeURIComponent(shareVideo.title);
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
                    }}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 rounded-lg text-sky-400 hover:text-sky-300 transition-all duration-300 text-xs sm:text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <span className="hidden sm:inline">Twitter</span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(shareVideo.videoUrl || '');
                      const text = encodeURIComponent(shareVideo.title);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
                    }}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300 text-xs sm:text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="hidden sm:inline">LinkedIn</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(shareVideo.videoUrl || '');
                      const text = encodeURIComponent(`${shareVideo.title} - ${shareVideo.videoUrl}`);
                      window.open(`https://wa.me/?text=${text}`, '_blank', 'width=600,height=400');
                    }}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-all duration-300 text-xs sm:text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(shareVideo.title);
                      const body = encodeURIComponent(`Check out this video: ${shareVideo.videoUrl}`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 rounded-lg text-slate-400 hover:text-slate-300 transition-all duration-300 text-xs sm:text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification.show && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8"
          onClick={() => {
            if (notification.type !== 'loading') {
              setNotification({ show: false, message: '', type: 'info' });
            }
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-md w-full relative">
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-green-500/20' :
                  notification.type === 'error' ? 'bg-red-500/20' :
                  notification.type === 'loading' ? 'bg-indigo-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {notification.type === 'success' ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : notification.type === 'error' ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : notification.type === 'loading' ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                {/* Message */}
                <div className="flex-1">
                  <p className={`text-sm sm:text-base font-medium ${
                    notification.type === 'success' ? 'text-green-400' :
                    notification.type === 'error' ? 'text-red-400' :
                    notification.type === 'loading' ? 'text-indigo-400' :
                    'text-blue-400'
                  }`}>
                    {notification.message}
                  </p>
                </div>

                {/* Close button (only for non-loading notifications) */}
                {notification.type !== 'loading' && (
                  <button
                    onClick={() => setNotification({ show: false, message: '', type: 'info' })}
                    className="flex-shrink-0 p-1 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && videoToDelete && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 lg:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteConfirm(false);
              setVideoToDelete(null);
            }
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-md w-full relative">
            <div className="p-4 sm:p-6 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {translations.videosDelete || "Delete Video"}
                  </h2>
                </div>
                {!deleting && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setVideoToDelete(null);
                    }}
                    className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <p className="text-white/80 text-sm sm:text-base">
                {translations.videosAreYouSureDelete}
              </p>
              <p className="text-white/60 text-xs sm:text-sm">
                {translations.videosDeleteWarning || "This action cannot be undone."}
              </p>

              <div className="flex gap-3 sm:gap-4 pt-4">
                <button
                  onClick={async () => {
                    if (!videoToDelete) return;
                    
                    setDeleting(true);
                    try {
                      const response = await fetch(`/api/dashboard/videos?videoId=${videoToDelete}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      });

                      const data = await response.json();

                      if (data.success) {
                        setShowDeleteConfirm(false);
                        setVideoToDelete(null);
                        setNotification({ 
                          show: true, 
                          message: translations.videosDeleteSuccess || 'Video deleted successfully!', 
                          type: 'success' 
                        });
                        // Refresh videos list
                        fetchVideos();
                      } else {
                        setNotification({ 
                          show: true, 
                          message: data.message || translations.videosDeleteError || 'Failed to delete video', 
                          type: 'error' 
                        });
                      }
                    } catch (error) {
                      console.error('Error deleting video:', error);
                      setNotification({ 
                        show: true, 
                        message: translations.videosDeleteError || 'Failed to delete video', 
                        type: 'error' 
                      });
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{translations.videosDeleting || "Deleting..."}</span>
                    </>
                  ) : (
                    <span>{translations.videosDelete || "Delete"}</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setVideoToDelete(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {translations.profileCancel || "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
