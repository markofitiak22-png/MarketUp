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

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: filterStatus,
          sortBy,
          sortOrder
        });
        
        const response = await fetch(`/api/admin/videos?${params}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data.videos);
        } else {
          console.error('Failed to fetch videos:', data.error);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

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
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full mr-1 sm:mr-1.5 animate-pulse"></div>
            {translations.adminVideosPending}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminVideosApproved}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminVideosRejected}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-accent-2/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-2/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/10 to-accent-2/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            {translations.adminVideosModeration}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed px-4">
            {translations.adminVideosModerationDescription}
          </p>
          <div className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-foreground-muted">
            <span className="font-bold text-foreground text-lg sm:text-xl lg:text-2xl">{filteredVideos.length}</span> {translations.adminVideosToReview}
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600 sm:w-6 sm:h-6 lg:w-8 lg:h-8">
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">{translations.adminVideosSearchFilters}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                {translations.adminVideosSearch}
              </label>
              <input
                type="text"
                placeholder={translations.adminVideosSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                {translations.adminVideosStatus}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">{translations.adminVideosAllStatus}</option>
                <option value="pending">{translations.adminVideosPending}</option>
                <option value="approved">{translations.adminVideosApproved}</option>
                <option value="rejected">{translations.adminVideosRejected}</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                {translations.adminVideosSortBy}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="uploadDate">{translations.adminVideosUploadDate}</option>
                <option value="title">{translations.adminVideosTitle}</option>
                <option value="uploader">{translations.adminVideosUploader}</option>
                <option value="flags">{translations.adminVideosFlags}</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3">
                {translations.adminVideosOrder}
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-border bg-surface-elevated text-sm sm:text-base lg:text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="desc">{translations.adminVideosNewestFirst}</option>
                <option value="asc">{translations.adminVideosOldestFirst}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Videos List */}
        <div className="glass-elevated rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          {loading ? (
            <div className="p-4 sm:p-6 lg:p-10">
              <div className="space-y-4 sm:space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 sm:space-x-6 p-4 sm:p-6">
                    <div className="w-16 h-10 sm:w-20 sm:h-12 lg:w-24 lg:h-16 bg-surface-elevated rounded-xl sm:rounded-2xl animate-pulse"></div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <div className="h-4 sm:h-5 bg-surface-elevated rounded animate-pulse w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-surface-elevated rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="w-16 sm:w-20 lg:w-24 h-6 sm:h-8 bg-surface-elevated rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredVideos.map((video) => (
                <div key={video.id} className="p-4 sm:p-6 lg:p-8 hover:bg-surface/50 transition-all duration-300 hover:scale-[1.01] group">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full sm:w-24 lg:w-32 h-16 sm:h-16 lg:h-20 object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-black/80 text-white text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                          {video.duration}
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2 sm:mb-3 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-sm sm:text-base lg:text-lg text-foreground-muted mb-3 sm:mb-4 line-clamp-2">
                            {video.description}
                          </p>
                          
                          {/* Uploader Info */}
                          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <img
                              src={video.uploader.avatar}
                              alt={video.uploader.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                            <span className="text-sm sm:text-base lg:text-lg text-foreground-muted truncate">
                              {video.uploader.name}
                            </span>
                            <span className="text-xs sm:text-sm lg:text-base text-foreground-muted hidden sm:inline">
                              • {formatDate(video.uploadDate)}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-sm sm:text-base lg:text-lg text-foreground-muted mb-3 sm:mb-4">
                            <span className="font-bold">{video.views.toLocaleString()} {translations.adminVideosViews}</span>
                            <span className="font-bold">{video.likes} {translations.adminVideosLikes}</span>
                            <span className="text-red-500 font-bold">{video.flags} {translations.adminVideosFlagsCount}</span>
                            <span className="bg-surface-elevated px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm lg:text-base font-bold">
                              {video.category}
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                            {video.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs sm:text-sm lg:text-base bg-accent/10 text-accent px-2 sm:px-3 py-1 sm:py-1.5 lg:py-2 rounded-lg sm:rounded-xl font-bold"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col sm:flex-row sm:flex-col items-start sm:items-end space-y-3 sm:space-y-4 w-full sm:w-auto">
                          <div className="flex-shrink-0">
                            {getStatusBadge(video.status)}
                          </div>
                          
                          {video.status === "pending" && (
                            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
                              <button
                                onClick={() => {
                                  setSelectedVideo(video);
                                  setShowModal(true);
                                }}
                                className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-accent text-white rounded-xl sm:rounded-2xl hover:bg-accent-hover transition-all duration-300 text-sm sm:text-base lg:text-lg font-bold hover:scale-105 flex-1 sm:flex-none"
                              >
                                {translations.adminVideosReview}
                              </button>
                            </div>
                          )}

                          {video.status === "rejected" && video.reason && (
                            <div className="text-xs sm:text-sm lg:text-base text-red-500 text-left sm:text-right max-w-full sm:max-w-64">
                              {translations.adminVideosReason}: {video.reason}
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Review Modal */}
        {showModal && selectedVideo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-elevated rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">{translations.adminVideosReviewVideo}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Video Player Placeholder */}
                <div className="bg-black rounded-3xl aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="w-24 h-24 mx-auto mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <p className="text-2xl font-bold">{translations.adminVideosVideoPlayer}</p>
                    <p className="text-lg opacity-75">{translations.adminVideosClickToPlay}</p>
                  </div>
                </div>

                {/* Video Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{translations.adminVideosVideoInformation}</h3>
                    <div className="space-y-3 text-lg">
                      <div><span className="font-bold">{translations.adminVideosTitle}:</span> {selectedVideo.title}</div>
                      <div><span className="font-bold">{translations.adminVideosDuration}:</span> {selectedVideo.duration}</div>
                      <div><span className="font-bold">{translations.adminVideosCategory}:</span> {selectedVideo.category}</div>
                      <div><span className="font-bold">{translations.adminVideosUploadDate}:</span> {formatDate(selectedVideo.uploadDate)}</div>
                      <div><span className="font-bold">{translations.adminVideosFlagsCount}:</span> {selectedVideo.flags}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{translations.adminVideosUploaderInformation}</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={selectedVideo.uploader.avatar}
                        alt={selectedVideo.uploader.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="text-xl font-bold text-foreground">{selectedVideo.uploader.name}</div>
                        <div className="text-lg text-foreground-muted">{selectedVideo.uploader.email}</div>
                      </div>
                    </div>
                    <div className="space-y-3 text-lg">
                      <div><span className="font-bold">{translations.adminVideosViews}:</span> {selectedVideo.views.toLocaleString()}</div>
                      <div><span className="font-bold">{translations.adminVideosLikes}:</span> {selectedVideo.likes}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{translations.adminVideosDescription}</h3>
                  <p className="text-lg text-foreground-muted">{selectedVideo.description}</p>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{translations.adminVideosTags}</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedVideo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-accent/10 text-accent px-4 py-2 rounded-2xl text-lg font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-6 pt-6 border-t border-border">
                  <button
                    onClick={() => {
                      const reason = prompt(translations.adminVideosEnterRejectionReason);
                      if (reason) handleReject(selectedVideo.id, reason);
                    }}
                    className="px-8 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                  >
                    {translations.adminVideosReject}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedVideo.id)}
                    className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                  >
                    {translations.adminVideosApprove}
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
