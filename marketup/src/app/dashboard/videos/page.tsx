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
        // TODO: Implement download functionality
        console.log('Download video:', videoId);
        alert(translations.videosDownloadFunctionalityComingSoon);
        break;
      case 'share':
        // TODO: Implement share functionality
        console.log('Share video:', videoId);
        alert(translations.videosShareFunctionalityComingSoon);
        break;
      case 'delete':
        if (confirm(translations.videosAreYouSureDelete)) {
          // TODO: Implement delete functionality
          alert(translations.videosDeleteFunctionalityComingSoon);
        }
        break;
      case 'duplicate':
        // TODO: Implement duplicate functionality
        alert(translations.videosDuplicateFunctionalityComingSoon);
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
    </div>
  );
}
