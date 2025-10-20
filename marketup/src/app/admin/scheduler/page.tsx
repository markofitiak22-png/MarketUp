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

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVideos: Video[] = [
        {
          id: "1",
          title: "Amazing Product Review - Must Watch!",
          thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
          duration: "8:42",
          status: "approved",
          category: "Technology",
          tags: ["review", "tech", "product"]
        },
        {
          id: "2",
          title: "Cooking Tutorial: Perfect Pasta",
          thumbnail: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=225&fit=crop",
          duration: "12:15",
          status: "approved",
          category: "Food & Cooking",
          tags: ["cooking", "tutorial", "pasta"]
        },
        {
          id: "3",
          title: "Fitness Workout Routine",
          thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
          duration: "28:30",
          status: "approved",
          category: "Fitness",
          tags: ["fitness", "workout", "health"]
        },
        {
          id: "4",
          title: "Travel Vlog: Paris Adventure",
          thumbnail: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=225&fit=crop",
          duration: "15:45",
          status: "approved",
          category: "Travel",
          tags: ["travel", "paris", "vlog"]
        }
      ];

      const mockScheduledPosts: ScheduledPost[] = [
        {
          id: "1",
          videoId: "1",
          video: mockVideos[0],
          socialNetwork: "youtube",
          scheduledDate: "2024-01-20T14:00:00Z",
          status: "scheduled",
          customMessage: "Check out this amazing product review!",
          createdAt: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          videoId: "2",
          video: mockVideos[1],
          socialNetwork: "instagram",
          scheduledDate: "2024-01-21T09:00:00Z",
          status: "scheduled",
          customMessage: "Learn to cook perfect pasta! 🍝",
          createdAt: "2024-01-15T11:15:00Z"
        },
        {
          id: "3",
          videoId: "3",
          video: mockVideos[2],
          socialNetwork: "tiktok",
          scheduledDate: "2024-01-19T18:00:00Z",
          status: "published",
          createdAt: "2024-01-15T08:45:00Z"
        }
      ];

      setVideos(mockVideos);
      setScheduledPosts(mockScheduledPosts);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSchedulePost = () => {
    if (!selectedVideo || selectedNetworks.length === 0 || !scheduledDate || !scheduledTime) {
      alert("Please fill in all required fields");
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    
    selectedNetworks.forEach(networkId => {
      const network = socialNetworks.find(n => n.id === networkId);
      if (network) {
        const newPost: ScheduledPost = {
          id: Date.now().toString(),
          videoId: selectedVideo.id,
          video: selectedVideo,
          socialNetwork: networkId,
          scheduledDate: scheduledDateTime,
          status: "scheduled",
          customMessage: customMessage || undefined,
          createdAt: new Date().toISOString()
        };
        
        setScheduledPosts(prev => [...prev, newPost]);
      }
    });

    // Reset form
    setSelectedVideo(null);
    setSelectedNetworks([]);
    setScheduledDate("");
    setScheduledTime("");
    setCustomMessage("");
    setShowScheduler(false);
  };

  const handleCancelPost = (postId: string) => {
    setScheduledPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: "cancelled" as const } : post
    ));
  };

  const handlePublishNow = (postId: string) => {
    setScheduledPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: "published" as const } : post
    ));
  };

  const filteredPosts = scheduledPosts.filter(post => {
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    const matchesNetwork = filterNetwork === "all" || post.socialNetwork === filterNetwork;
    return matchesStatus && matchesNetwork;
  });

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Publication Scheduler</h1>
          <p className="text-foreground-muted mt-2">
            Schedule video publications across social networks
          </p>
        </div>
        <button
          onClick={() => setShowScheduler(true)}
          className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors font-bold"
        >
          + Schedule New Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Social Network
            </label>
            <select
              value={filterNetwork}
              onChange={(e) => setFilterNetwork(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
      <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
            {filteredPosts.map((post) => {
              const network = getNetworkInfo(post.socialNetwork);
              return (
                <div key={post.id} className="p-6 hover:bg-surface/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={post.video.thumbnail}
                        alt={post.video.title}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    </div>

                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            {post.video.title}
                          </h3>
                          
                          {/* Social Network */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${network?.color}`}>
                              {network?.icon} {network?.name}
                            </span>
                            <span className="text-sm text-foreground-muted">
                              • {formatDate(post.scheduledDate)}
                            </span>
                          </div>

                          {/* Custom Message */}
                          {post.customMessage && (
                            <p className="text-sm text-foreground-muted mb-2">
                              "{post.customMessage}"
                            </p>
                          )}

                          {/* Time Info */}
                          <div className="flex items-center space-x-4 text-sm text-foreground-muted">
                            <span>Duration: {post.video.duration}</span>
                            <span>Category: {post.video.category}</span>
                            {post.status === "scheduled" && (
                              <span className="text-blue-600 font-bold">
                                Publishes in: {getTimeUntilPublish(post.scheduledDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end space-y-3">
                          {getStatusBadge(post.status)}
                          
                          {post.status === "scheduled" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handlePublishNow(post.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-bold"
                              >
                                Publish Now
                              </button>
                              <button
                                onClick={() => handleCancelPost(post.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-bold"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Schedule New Post</h2>
                <button
                  onClick={() => setShowScheduler(false)}
                  className="text-foreground-muted hover:text-foreground"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Video Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-3">
                  Select Video *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedVideo?.id === video.id
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-foreground text-sm line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-foreground-muted">
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
                <label className="block text-sm font-bold text-foreground mb-3">
                  Select Social Networks *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {socialNetworks.map((network) => (
                    <label
                      key={network.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{network.icon}</span>
                        <span className="font-bold text-foreground">{network.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Publication Date *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Publication Time *
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a custom message to accompany your video..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <button
                  onClick={() => setShowScheduler(false)}
                  className="px-6 py-3 bg-surface text-foreground rounded-xl hover:bg-surface-elevated transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSchedulePost}
                  className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors font-bold"
                >
                  Schedule Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
