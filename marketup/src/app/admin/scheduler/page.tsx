"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: "approved" | "published";
  category: string;
  tags: string[];
}

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface ScheduledPost {
  id: string;
  videoId: string;
  video: Video;
  socialNetwork: string;
  scheduledDate: string;
  status: "scheduled" | "published" | "failed" | "cancelled";
  customMessage?: string;
  createdAt: string;
}

export default function PublicationScheduler() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "published" | "failed" | "cancelled">("all");
  const [filterNetwork, setFilterNetwork] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialNetworks: SocialNetwork[] = [
    {
      id: "youtube",
      name: "YouTube",
      icon: "🎥",
      color: "bg-red-500",
      enabled: true
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📷",
      color: "bg-pink-500",
      enabled: true
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "bg-black",
      enabled: true
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "bg-blue-600",
      enabled: true
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: "🐦",
      color: "bg-blue-400",
      enabled: true
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "bg-blue-700",
      enabled: true
    }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          status: filterStatus,
          network: filterNetwork
        });
        
        const response = await fetch(`/api/admin/scheduler?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data.videos);
          setScheduledPosts(data.data.scheduledPosts);
        } else {
          console.error('Failed to fetch scheduler data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching scheduler data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterStatus, filterNetwork]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showScheduler) {
        setShowScheduler(false);
      }
    };

    if (showScheduler) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showScheduler]);

  const handleSchedulePost = async () => {
    if (!selectedVideo) {
      alert("Please select a video");
      return;
    }
    if (selectedNetworks.length === 0) {
      alert("Please select at least one social network");
      return;
    }
    if (!scheduledDate) {
      alert("Please select a publication date");
      return;
    }
    if (!scheduledTime) {
      alert("Please select a publication time");
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      
      const response = await fetch('/api/admin/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: selectedVideo.id,
          socialNetworks: selectedNetworks,
          scheduledDate: scheduledDateTime,
          customMessage: customMessage || undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the data to get the new scheduled posts
        const refreshResponse = await fetch('/api/admin/scheduler');
        const refreshData = await refreshResponse.json();
        
        if (refreshData.success) {
          setScheduledPosts(refreshData.data.scheduledPosts);
        }
        
        // Reset form
        setSelectedVideo(null);
        setSelectedNetworks([]);
        setScheduledDate("");
        setScheduledTime("");
        setCustomMessage("");
        setShowScheduler(false);
        alert('Post scheduled successfully!');
      } else {
        console.error('Failed to schedule post:', data.error);
        alert('Failed to schedule post. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Error scheduling post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action: 'cancel'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScheduledPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, status: "cancelled" as const } : post
        ));
      } else {
        console.error('Failed to cancel post:', data.error);
        alert('Failed to cancel post. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling post:', error);
      alert('Error cancelling post. Please try again.');
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action: 'publish'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScheduledPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, status: "published" as const } : post
        ));
      } else {
        console.error('Failed to publish post:', data.error);
        alert('Failed to publish post. Please try again.');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Error publishing post. Please try again.');
    }
  };

  // Posts are already filtered by the API
  const filteredPosts = scheduledPosts;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
            Scheduled
          </span>
        );
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Published
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getNetworkInfo = (networkId: string) => {
    return socialNetworks.find(n => n.id === networkId);
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

  const getTimeUntilPublish = (scheduledDate: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-accent via-accent-2 to-accent bg-clip-text text-transparent mb-6">
            Publication Scheduler
          </h1>
          <p className="text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
            Schedule video publications across social networks
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowScheduler(true)}
            className="btn-primary px-10 py-5 text-xl font-bold hover:scale-105 transition-all duration-300"
          >
            + Schedule New Post
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="glass-elevated rounded-3xl p-10 hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                <path d="M9 14l2 2 4-4"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-foreground">Search & Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-foreground mb-3">
                Status Filter
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-6 py-4 rounded-2xl border border-border bg-surface-elevated text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold text-foreground mb-3">
                Social Network
              </label>
              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-border bg-surface-elevated text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Networks</option>
                {socialNetworks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.icon} {network.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="glass-elevated rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 group">
          {loading ? (
            <div className="p-10">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-6 p-6">
                    <div className="w-24 h-16 bg-surface-elevated rounded-2xl animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-surface-elevated rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-surface-elevated rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="w-24 h-8 bg-surface-elevated rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredPosts.map((post) => {
                const network = getNetworkInfo(post.socialNetwork);
                return (
                  <div key={post.id} className="p-8 hover:bg-surface/50 transition-all duration-300 hover:scale-[1.01] group">
                    <div className="flex items-start space-x-6">
                      {/* Video Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={post.video.thumbnail}
                          alt={post.video.title}
                          className="w-28 h-20 object-cover rounded-2xl group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Post Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-foreground mb-3">
                              {post.video.title}
                            </h3>
                            
                            {/* Social Network */}
                            <div className="flex items-center space-x-3 mb-4">
                              <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-lg font-bold text-white ${network?.color}`}>
                                {network?.icon} {network?.name}
                              </span>
                              <span className="text-lg text-foreground-muted">
                                • {formatDate(post.scheduledDate)}
                              </span>
                            </div>

                            {/* Custom Message */}
                            {post.customMessage && (
                              <p className="text-lg text-foreground-muted mb-4">
                                "{post.customMessage}"
                              </p>
                            )}

                            {/* Time Info */}
                            <div className="flex items-center space-x-6 text-lg text-foreground-muted">
                              <span className="font-bold">Duration: {post.video.duration}</span>
                              <span className="font-bold">Category: {post.video.category}</span>
                              {post.status === "scheduled" && (
                                <span className="text-blue-600 font-bold text-xl">
                                  Publishes in: {getTimeUntilPublish(post.scheduledDate)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col items-end space-y-4">
                            {getStatusBadge(post.status)}
                            
                            {post.status === "scheduled" && (
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handlePublishNow(post.id)}
                                  className="px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                                >
                                  Publish Now
                                </button>
                                <button
                                  onClick={() => handleCancelPost(post.id)}
                                  className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 text-lg font-bold hover:scale-105"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

        {/* Scheduler Modal */}
        {showScheduler && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowScheduler(false);
              }
            }}
          >
            <div className="glass-elevated rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">Schedule New Post</h2>
                  <button
                    onClick={() => setShowScheduler(false)}
                    className="p-3 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Video Selection */}
                <div>
                  <label className="block text-2xl font-bold text-foreground mb-6">
                    Select Video *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedVideo?.id === video.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-16 h-12 object-cover rounded-xl"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-foreground text-lg line-clamp-1">
                              {video.title}
                            </h4>
                            <p className="text-base text-foreground-muted">
                              {video.duration} • {video.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Networks Selection */}
                <div>
                  <label className="block text-2xl font-bold text-foreground mb-6">
                    Select Social Networks *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {socialNetworks.map((network) => (
                      <label
                        key={network.id}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedNetworks.includes(network.id)
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNetworks.includes(network.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNetworks([...selectedNetworks, network.id]);
                            } else {
                              setSelectedNetworks(selectedNetworks.filter(id => id !== network.id));
                            }
                          }}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{network.icon}</span>
                          <span className="font-bold text-foreground text-lg">{network.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-2xl font-bold text-foreground mb-4">
                      Publication Date *
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-surface-elevated text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-2xl font-bold text-foreground mb-4">
                      Publication Time *
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-surface-elevated text-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                  <label className="block text-2xl font-bold text-foreground mb-4">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Add a custom message to accompany your video..."
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl border border-border bg-surface-elevated text-lg text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-6 pt-6 border-t border-border">
                  <button
                    onClick={() => setShowScheduler(false)}
                    className="px-8 py-4 bg-surface text-foreground rounded-2xl hover:bg-surface-elevated transition-all duration-300 text-lg font-bold hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSchedulePost}
                    disabled={isSubmitting}
                    className={`px-8 py-4 rounded-2xl transition-all duration-300 text-lg font-bold hover:scale-105 ${
                      isSubmitting 
                        ? 'bg-accent/50 text-white cursor-not-allowed' 
                        : 'bg-accent text-white hover:bg-accent-hover'
                    }`}
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
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
