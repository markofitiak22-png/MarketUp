"use client";

import { useState, useEffect } from "react";

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
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"uploadDate" | "title" | "uploader" | "flags">("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Simulate fetching videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVideos: Video[] = [
        {
          id: "1",
          title: "Amazing Product Review - Must Watch!",
          description: "In this video, I review the latest tech product and share my honest thoughts about its features and performance.",
          thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
          duration: "8:42",
          uploadDate: "2024-01-15T10:30:00Z",
          uploader: {
            id: "user1",
            name: "Tech Reviewer",
            email: "tech@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          },
          status: "pending",
          category: "Technology",
          tags: ["review", "tech", "product"],
          views: 1250,
          likes: 89,
          flags: 2
        },
        {
          id: "2",
          title: "Cooking Tutorial: Perfect Pasta",
          description: "Learn how to make the perfect pasta with this step-by-step cooking tutorial.",
          thumbnail: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=225&fit=crop",
          duration: "12:15",
          uploadDate: "2024-01-14T15:45:00Z",
          uploader: {
            id: "user2",
            name: "Chef Maria",
            email: "maria@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
          },
          status: "pending",
          category: "Food & Cooking",
          tags: ["cooking", "tutorial", "pasta"],
          views: 890,
          likes: 67,
          flags: 0
        },
        {
          id: "3",
          title: "Fitness Workout Routine",
          description: "30-minute high-intensity workout routine for beginners.",
          thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
          duration: "28:30",
          uploadDate: "2024-01-13T08:20:00Z",
          uploader: {
            id: "user3",
            name: "Fitness Pro",
            email: "fitness@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          status: "approved",
          category: "Fitness",
          tags: ["fitness", "workout", "health"],
          views: 2100,
          likes: 156,
          flags: 0
        },
        {
          id: "4",
          title: "Inappropriate Content",
          description: "This video contains content that violates our community guidelines.",
          thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
          duration: "5:20",
          uploadDate: "2024-01-12T20:15:00Z",
          uploader: {
            id: "user4",
            name: "Problem User",
            email: "problem@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
          },
          status: "rejected",
          category: "Other",
          tags: ["inappropriate"],
          views: 45,
          likes: 2,
          flags: 8,
          reason: "Violates community guidelines"
        },
        {
          id: "5",
          title: "Travel Vlog: Paris Adventure",
          description: "Join me on an amazing journey through the beautiful streets of Paris.",
          thumbnail: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=225&fit=crop",
          duration: "15:45",
          uploadDate: "2024-01-11T14:30:00Z",
          uploader: {
            id: "user5",
            name: "Travel Blogger",
            email: "travel@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
          },
          status: "pending",
          category: "Travel",
          tags: ["travel", "paris", "vlog"],
          views: 3200,
          likes: 234,
          flags: 1
        }
      ];
      
      setVideos(mockVideos);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const handleApprove = async (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: "approved" as const } : video
    ));
    setShowModal(false);
    setSelectedVideo(null);
  };

  const handleReject = async (videoId: string, reason: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: "rejected" as const, reason } : video
    ));
    setShowModal(false);
    setSelectedVideo(null);
  };

  const filteredVideos = videos
    .filter(video => {
      const matchesStatus = filterStatus === "all" || video.status === filterStatus;
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.uploader.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "uploadDate":
          aValue = new Date(a.uploadDate).getTime();
          bValue = new Date(b.uploadDate).getTime();
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "uploader":
          aValue = a.uploader.name.toLowerCase();
          bValue = b.uploader.name.toLowerCase();
          break;
        case "flags":
          aValue = a.flags;
          bValue = b.flags;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5 animate-pulse"></div>
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Rejected
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Video Moderation</h1>
          <p className="text-foreground-muted mt-2">
            Review and moderate video content uploaded by users
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-foreground-muted">
            <span className="font-bold text-foreground">{filteredVideos.length}</span> videos
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search videos or uploaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="uploadDate">Upload Date</option>
              <option value="title">Title</option>
              <option value="uploader">Uploader</option>
              <option value="flags">Flags</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="w-16 h-12 bg-surface rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-surface rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-surface rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredVideos.map((video) => (
              <div key={video.id} className="p-6 hover:bg-surface/50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-foreground-muted mb-2 line-clamp-2">
                          {video.description}
                        </p>
                        
                        {/* Uploader Info */}
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src={video.uploader.avatar}
                            alt={video.uploader.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-foreground-muted">
                            {video.uploader.name}
                          </span>
                          <span className="text-xs text-foreground-muted">
                            • {formatDate(video.uploadDate)}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-foreground-muted">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>{video.likes} likes</span>
                          <span className="text-red-500">{video.flags} flags</span>
                          <span className="bg-surface px-2 py-1 rounded-full text-xs">
                            {video.category}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {video.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-accent/10 text-accent px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-3">
                        {getStatusBadge(video.status)}
                        
                        {video.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedVideo(video);
                                setShowModal(true);
                              }}
                              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-bold"
                            >
                              Review
                            </button>
                          </div>
                        )}

                        {video.status === "rejected" && video.reason && (
                          <div className="text-xs text-red-500 text-right max-w-48">
                            Reason: {video.reason}
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
          <div className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Review Video</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-foreground-muted hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Video Player Placeholder */}
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm opacity-75">Click to play</p>
                </div>
              </div>

              {/* Video Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Video Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-bold">Title:</span> {selectedVideo.title}</div>
                    <div><span className="font-bold">Duration:</span> {selectedVideo.duration}</div>
                    <div><span className="font-bold">Category:</span> {selectedVideo.category}</div>
                    <div><span className="font-bold">Upload Date:</span> {formatDate(selectedVideo.uploadDate)}</div>
                    <div><span className="font-bold">Flags:</span> {selectedVideo.flags}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Uploader Information</h3>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedVideo.uploader.avatar}
                      alt={selectedVideo.uploader.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-foreground">{selectedVideo.uploader.name}</div>
                      <div className="text-sm text-foreground-muted">{selectedVideo.uploader.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-bold">Views:</span> {selectedVideo.views.toLocaleString()}</div>
                    <div><span className="font-bold">Likes:</span> {selectedVideo.likes}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Description</h3>
                <p className="text-foreground-muted">{selectedVideo.description}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) handleReject(selectedVideo.id, reason);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedVideo.id)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
