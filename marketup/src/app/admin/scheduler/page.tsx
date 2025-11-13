"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { translations } = useTranslations();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
    cancelledPosts: 0
  });

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
  const fetchData = async (page: number = currentPage) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          status: filterStatus,
        network: filterNetwork,
        page: page.toString(),
        limit: '10'
        });
        
        const response = await fetch(`/api/admin/scheduler?${params}`, {
          credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data.videos);
          setScheduledPosts(data.data.scheduledPosts);
        setPagination(data.data.pagination);
        setCurrentPage(data.data.pagination.page);
        if (data.data.stats) {
          setStats(data.data.stats);
        }
        } else {
          console.error('Failed to fetch scheduler data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching scheduler data:', error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchData(1);
  }, [filterStatus, filterNetwork]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showScheduler) {
        setShowScheduler(false);
      }
    };

    if (showScheduler) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      document.addEventListener('keydown', handleEscape);

    return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', handleEscape);
    };
    }
  }, [showScheduler]);

  const handleSchedulePost = async () => {
    if (!selectedVideo) {
      alert(translations.adminSchedulerPleaseSelectVideo);
      return;
    }
    if (selectedNetworks.length === 0) {
      alert(translations.adminSchedulerPleaseSelectNetwork);
      return;
    }
    if (!scheduledDate) {
      alert(translations.adminSchedulerPleaseSelectDate);
      return;
    }
    if (!scheduledTime) {
      alert(translations.adminSchedulerPleaseSelectTime);
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
        credentials: "include",
        body: JSON.stringify({
          videoId: selectedVideo.id,
          socialNetworks: selectedNetworks,
          scheduledDate: scheduledDateTime,
          customMessage: customMessage || undefined
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setSelectedVideo(null);
        setSelectedNetworks([]);
        setScheduledDate("");
        setScheduledTime("");
        setCustomMessage("");
        setShowScheduler(false);
        alert(translations.adminSchedulerPostScheduledSuccessfully);
        fetchData(currentPage); // Refresh current page
      } else {
        console.error('Failed to schedule post:', data.error);
        alert(translations.adminSchedulerFailedToSchedulePost);
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert(translations.adminSchedulerErrorSchedulingPost);
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
        credentials: "include",
        body: JSON.stringify({
          postId,
          action: 'cancel'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchData(currentPage); // Refresh current page
      } else {
        console.error('Failed to cancel post:', data.error);
        alert(translations.adminSchedulerFailedToCancelPost);
      }
    } catch (error) {
      console.error('Error cancelling post:', error);
      alert(translations.adminSchedulerErrorCancellingPost);
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          postId,
          action: 'publish'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchData(currentPage); // Refresh current page
      } else {
        console.error('Failed to publish post:', data.error);
        alert(translations.adminSchedulerFailedToPublishPost);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert(translations.adminSchedulerErrorPublishingPost);
    }
  };

  // Posts are already filtered by the API
  const filteredPosts = scheduledPosts;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-1.5 sm:mr-2"></div>
            {translations.adminSchedulerScheduled || "Scheduled"}
          </span>
        );
      case "published":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {translations.adminSchedulerPublished || "Published"}
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminSchedulerFailed || "Failed"}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {translations.adminSchedulerCancelled || "Cancelled"}
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
    
    if (diff <= 0) return translations.adminSchedulerOverdue || "Overdue";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading && scheduledPosts.length === 0) {
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
              <span>{translations.adminSchedulerPublicationScheduler || "Publication Scheduler"}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              {translations.adminSchedulerPublicationScheduler || "Publication Scheduler"}
          </h1>
            <p className="text-sm sm:text-base text-white/60">
              {translations.adminSchedulerScheduleVideoPublications || "Schedule video publications"}
          </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Posts */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminTotalPosts || "Total Posts"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.totalPosts}
              </p>
            </div>
        </div>

          {/* Scheduled Posts */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminScheduledPosts || "Scheduled"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.scheduledPosts}
              </p>
            </div>
          </div>
          
          {/* Published Posts */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminPublishedPosts || "Published"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.publishedPosts}
              </p>
            </div>
        </div>

          {/* Failed Posts */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminFailedPosts || "Failed"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.failedPosts}
              </p>
            </div>
          </div>
          
          {/* Cancelled Posts */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-slate-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-500/10 to-slate-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">{translations.adminCancelledPosts || "Cancelled"}</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.cancelledPosts}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Filters and Table (2/3 width) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Action Button and Filters */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminFilters || "Filters"}</h2>
                  </div>
                  <button
                    onClick={() => setShowScheduler(true)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {translations.adminSchedulerScheduleNewPost || "Schedule New Post"}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  >
                    <option value="all">{translations.adminSchedulerAllStatus || "All Status"}</option>
                    <option value="scheduled">{translations.adminSchedulerScheduled || "Scheduled"}</option>
                    <option value="published">{translations.adminSchedulerPublished || "Published"}</option>
                    <option value="failed">{translations.adminSchedulerFailed || "Failed"}</option>
                    <option value="cancelled">{translations.adminSchedulerCancelled || "Cancelled"}</option>
              </select>

              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
              >
                    <option value="all">{translations.adminSchedulerAllNetworks || "All Networks"}</option>
                {socialNetworks.map(network => (
                  <option key={network.id} value={network.id}>
                    {network.icon} {network.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

            {/* Scheduled Posts Table */}
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
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 lg:py-20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">{translations.adminNoScheduledPosts || "No scheduled posts"}</h3>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60 mb-4 sm:mb-6">{translations.adminScheduleYourFirstPost || "Schedule your first post to get started"}</p>
                    <button
                      onClick={() => setShowScheduler(true)}
                      className="inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 gap-2"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {translations.adminSchedulerScheduleNewPost || "Schedule New Post"}
                    </button>
            </div>
          ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[200px]">{translations.adminVideo || "Video"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[150px]">{translations.adminSchedulerSocialNetwork || "Network"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden lg:table-cell min-w-[180px]">{translations.adminSchedulerScheduledDate || "Scheduled Date"}</th>
                          <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell min-w-[100px]">{translations.adminSchedulerStatus || "Status"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
              {filteredPosts.map((post) => {
                const network = getNetworkInfo(post.socialNetwork);
                return (
                            <tr key={post.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                              <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-[200px]">
                                <div className="flex items-center gap-3 sm:gap-4">
                                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-slate-800/40 flex-shrink-0">
                        <img
                          src={post.video.thumbnail}
                          alt={post.video.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    {/* Video Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                      </div>
                                    </div>
                      </div>
                          <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{post.video.title}</p>
                                    <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{post.video.duration}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[150px]">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold text-white ${network?.color || 'bg-slate-500'}`}>
                                {network?.icon} {network?.name}
                              </span>
                            </div>
                              </td>
                              <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden lg:table-cell min-w-[180px]">
                                <div className="space-y-1">
                                  <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{formatDate(post.scheduledDate)}</span>
                              {post.status === "scheduled" && (
                                    <span className="text-xs sm:text-sm text-blue-400 font-semibold block">
                                      {translations.adminSchedulerPublishesIn || "Publishes in"}: {getTimeUntilPublish(post.scheduledDate)}
                                </span>
                              )}
                            </div>
                              </td>
                              <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 hidden md:table-cell min-w-[100px]">
                                <div className="flex flex-col items-start gap-2">
                              {getStatusBadge(post.status)}
                            {post.status === "scheduled" && (
                                    <div className="flex gap-2">
                                <button
                                  onClick={() => handlePublishNow(post.id)}
                                        className="px-2 sm:px-3 py-1 sm:py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs sm:text-sm font-semibold rounded-lg border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
                                >
                                        {translations.adminSchedulerPublishNow || "Publish"}
                                </button>
                                <button
                                  onClick={() => handleCancelPost(post.id)}
                                        className="px-2 sm:px-3 py-1 sm:py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                                >
                                        {translations.adminSchedulerCancel || "Cancel"}
                                </button>
                              </div>
                            )}
                          </div>
                              </td>
                            </tr>
                          );
                        })}
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
                  {translations.adminShowingPosts || "Showing"} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {translations.adminOfPosts || "of"} {pagination.total} {translations.adminPosts || "posts"}
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

          {/* Right Column - Quick Actions (1/3 width) */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">{translations.adminQuickActions || "Quick Actions"}</h3>
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => fetchData(currentPage)}
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

        {/* Scheduler Modal */}
        {showScheduler && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-end z-50 p-4 sm:p-6 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowScheduler(false);
              }
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-y-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/60">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{translations.adminSchedulerScheduleNewPost || "Schedule New Post"}</h2>
                  <button
                    onClick={() => setShowScheduler(false)}
                      className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(85vh-100px)]">
                {/* Video Selection */}
                <div>
                    <label className="block text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4">
                      {translations.adminSchedulerSelectVideo || "Select Video"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedVideo?.id === video.id
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-700/60 hover:border-indigo-500/50 bg-slate-800/40"
                        }`}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="relative w-10 h-7 sm:w-12 sm:h-9 rounded-lg overflow-hidden bg-slate-800/40 flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                  <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white text-xs sm:text-sm lg:text-base line-clamp-1">
                              {video.title}
                            </h4>
                              <p className="text-[10px] sm:text-xs lg:text-sm text-white/60">
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
                    <label className="block text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4">
                      {translations.adminSchedulerSelectSocialNetworks || "Select Social Networks"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
                    {socialNetworks.map((network) => (
                      <label
                        key={network.id}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedNetworks.includes(network.id)
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-700/60 hover:border-indigo-500/50 bg-slate-800/40"
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
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-lg sm:text-xl">{network.icon}</span>
                            <span className="font-bold text-white text-xs sm:text-sm lg:text-base">{network.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                      <label className="block text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
                        {translations.adminSchedulerPublicationDate || "Publication Date"}
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                      <label className="block text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
                        {translations.adminSchedulerPublicationTime || "Publication Time"}
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Custom Message */}
                <div>
                    <label className="block text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">
                      {translations.adminSchedulerCustomMessageOptional || "Custom Message (Optional)"}
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder={translations.adminSchedulerCustomMessagePlaceholder || "Enter a custom message..."}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700/60">
                  <button
                    onClick={() => setShowScheduler(false)}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105 flex-1 sm:flex-none"
                  >
                      {translations.adminSchedulerCancel || "Cancel"}
                  </button>
                  <button
                    onClick={handleSchedulePost}
                    disabled={isSubmitting}
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105 flex-1 sm:flex-none ${
                      isSubmitting 
                          ? 'bg-indigo-500/50 text-white cursor-not-allowed' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                      {isSubmitting ? translations.adminSchedulerScheduling || "Scheduling..." : translations.adminSchedulerSchedulePost || "Schedule Post"}
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
