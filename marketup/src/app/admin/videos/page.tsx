"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  uploader: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  status: "pending" | "approved" | "rejected";
  category: string;
  tags: string[];
  views: number;
  likes: number;
  flags: number;
  reason?: string;
}

export default function VideoModeration() {
  const { translations } = useTranslations();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"uploadDate" | "title" | "uploader" | "flags">("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalVideos: 0,
    pendingVideos: 0,
    approvedVideos: 0,
    rejectedVideos: 0
  });

  // Fetch videos from API
  const fetchVideos = async (page: number = currentPage) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: filterStatus,
          sortBy,
        sortOrder,
        page: page.toString(),
        limit: '10'
        });
        
        const response = await fetch(`/api/admin/videos?${params}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data.videos);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
        } else {
          console.error('Failed to fetch videos:', data.error);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchVideos(1);
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchVideos(page);
    }
  };

  const handleApprove = async (videoId: string) => {
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          videoId,
          action: 'approve'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVideos(prev => prev.map(video => 
          video.id === videoId ? { ...video, status: "approved" as const } : video
        ));
        setShowModal(false);
        setSelectedVideo(null);
        fetchVideos(currentPage); // Refresh current page
      } else {
        console.error('Failed to approve video:', data.error);
      }
    } catch (error) {
      console.error('Error approving video:', error);
    }
  };

  const handleReject = async (videoId: string, reason: string) => {
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          videoId,
          action: 'reject',
          reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVideos(prev => prev.map(video => 
          video.id === videoId ? { ...video, status: "rejected" as const, reason } : video
        ));
        setShowModal(false);
        setSelectedVideo(null);
        fetchVideos(currentPage); // Refresh current page
      } else {
        console.error('Failed to reject video:', data.error);
      }
    } catch (error) {
      console.error('Error rejecting video:', error);
    }
  };

  // Videos are already filtered and sorted by the API
  const filteredVideos = videos;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
            {translations.adminVideosPending || "Pending"}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminVideosApproved || "Approved"}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminVideosRejected || "Rejected"}
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] relative overflow-hidden">
        {/* Shared background blobs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[20%] right-[15%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[50%] left-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-[60%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 space-y-8 p-3 sm:p-6 lg:p-8">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-3xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-800/40 rounded mb-6"></div>
              <div className="h-64 bg-slate-800/40 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="mb-4 sm:mb-8">
          <div className="hidden sm:flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <span>{translations.adminVideosModeration || "Video Moderation"}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              {translations.adminVideosModeration || "Video Moderation"}
          </h1>
            <p className="text-sm sm:text-base text-white/60">
              {translations.adminVideosModerationDescription || "Manage and moderate all videos"}
          </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Videos */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalVideos || "Total Videos"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.totalVideos}
              </p>
            </div>
          </div>

          {/* Pending Videos */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminPendingVideos || "Pending"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.pendingVideos}
              </p>
            </div>
          </div>

          {/* Approved Videos */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminApprovedVideos || "Approved"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.approvedVideos}
              </p>
            </div>
          </div>
          
          {/* Rejected Videos */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminRejectedVideos || "Rejected"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.rejectedVideos}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Filters and Table (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Filters and Search */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminSearch || "Search"}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="relative sm:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
              <input
                type="text"
                      placeholder={translations.adminVideosSearchPlaceholder || "Search videos..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
              />
            </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">{translations.adminVideosAllStatus || "All Status"}</option>
                    <option value="pending">{translations.adminVideosPending || "Pending"}</option>
                    <option value="approved">{translations.adminVideosApproved || "Approved"}</option>
                    <option value="rejected">{translations.adminVideosRejected || "Rejected"}</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  >
                    <option value="uploadDate">{translations.adminVideosUploadDate || "Upload Date"}</option>
                    <option value="title">{translations.adminVideosTitle || "Title"}</option>
                    <option value="uploader">{translations.adminVideosUploader || "Uploader"}</option>
                    <option value="flags">{translations.adminVideosFlags || "Flags"}</option>
              </select>
            </div>
          </div>
        </div>

            {/* Videos Table */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
          {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-lg animate-pulse">
                        <div className="w-16 h-10 bg-slate-700/60 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
                    </div>
                        <div className="w-20 h-6 bg-slate-700/60 rounded-full"></div>
                  </div>
                ))}
              </div>
                ) : filteredVideos.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.adminNoVideosFound || "No videos found"}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60">{translations.adminTryDifferentFilters || "Try different filters or search terms"}</p>
            </div>
          ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[200px]">{translations.adminVideosVideo || "Video"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[150px]">{translations.adminVideosUploader || "Uploader"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden lg:table-cell min-w-[180px]">{translations.adminVideosUploadDate || "Upload Date"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[100px]">{translations.adminVideosStatus || "Status"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
              {filteredVideos.map((video) => (
                          <tr key={video.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                            <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-[200px]">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-slate-800/40 flex-shrink-0 group">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                        />
                                  {/* Video Icon Overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                      </svg>
                                    </div>
                                  </div>
                        </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{video.title}</p>
                                  <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{video.duration}</p>
                      </div>
                    </div>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[150px]">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs sm:text-sm font-bold">
                                    {video.uploader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">{video.uploader.name}</p>
                                  <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{video.uploader.email}</p>
                          </div>
                        </div>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[180px]">
                              <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{formatDate(video.uploadDate)}</span>
                            </td>
                            <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[100px]">
                              <div className="flex items-center gap-2">
                            {getStatusBadge(video.status)}
                          {video.status === "pending" && (
                              <button
                                onClick={() => {
                                  setSelectedVideo(video);
                                  setShowModal(true);
                                }}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300"
                              >
                                    {translations.adminVideosReview || "Review"}
                              </button>
                                )}
                            </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                            </div>
                          )}
                        </div>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-sm sm:text-base text-white/60">
                  {translations.adminShowingVideos || "Showing"} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {translations.adminOfVideos || "of"} {pagination.total} {translations.adminVideos || "videos"}
                </p>
                {pagination.pages > 1 && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {translations.adminPrevious || "Previous"}
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum: number;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-slate-800/40 border border-slate-700/60 text-white hover:bg-slate-800/60 hover:scale-105'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {translations.adminNext || "Next"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Quick Stats (1/3 width) */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">{translations.adminQuickActions || "Quick Actions"}</h3>
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => fetchVideos(currentPage)}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-indigo-500/40 text-sm sm:text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {translations.adminRefreshData || "Refresh Data"}
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>

        {/* Review Modal */}
        {showModal && selectedVideo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{translations.adminVideosReviewVideo || "Review Video"}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 sm:p-3 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
              </div>

                <div className="space-y-6 sm:space-y-8">
                {/* Video Player Placeholder */}
                  <div className="bg-black rounded-xl sm:rounded-2xl aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                      <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                      <p className="text-lg sm:text-xl font-bold">{translations.adminVideosVideoPlayer || "Video Player"}</p>
                      <p className="text-sm sm:text-base opacity-75">{translations.adminVideosClickToPlay || "Click to play"}</p>
                    </div>
                  </div>

                  {/* Video Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{translations.adminVideosVideoInformation || "Video Information"}</h3>
                      <div className="space-y-3 text-sm sm:text-base">
                        <div><span className="font-bold text-white/60">{translations.adminVideosTitle || "Title"}:</span> <span className="text-white">{selectedVideo.title}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminVideosDuration || "Duration"}:</span> <span className="text-white">{selectedVideo.duration}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminVideosCategory || "Category"}:</span> <span className="text-white">{selectedVideo.category}</span></div>
                        <div><span className="font-bold text-white/60">{translations.adminVideosUploadDate || "Upload Date"}:</span> <span className="text-white">{formatDate(selectedVideo.uploadDate)}</span></div>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{translations.adminVideosUploaderInformation || "Uploader Information"}</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {selectedVideo.uploader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-bold text-white">{selectedVideo.uploader.name}</div>
                          <div className="text-sm sm:text-base text-white/60">{selectedVideo.uploader.email}</div>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                  <div className="bg-slate-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/60">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{translations.adminVideosDescription || "Description"}</h3>
                    <p className="text-sm sm:text-base text-white/80">{selectedVideo.description}</p>
                </div>

                {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-6 pt-6 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                        const reason = prompt(translations.adminVideosEnterRejectionReason || "Enter rejection reason:");
                      if (reason) handleReject(selectedVideo.id, reason);
                    }}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl sm:rounded-2xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 text-sm sm:text-base font-bold hover:scale-105"
                  >
                      {translations.adminVideosReject || "Reject"}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedVideo.id)}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base font-bold hover:scale-105 shadow-lg shadow-green-500/20"
                  >
                      {translations.adminVideosApprove || "Approve"}
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
