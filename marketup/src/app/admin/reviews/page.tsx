"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  createdAt: string;
  moderatedAt?: string;
  moderationNote?: string;
  user: {
    id: string;
    name?: string;
    email?: string;
  };
}

export default function AdminReviewsPage() {
  const { translations } = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    hiddenReviews: 0,
    averageRating: 0
  });

  const fetchReviews = async (page: number = currentPage, status: string = statusFilter, sort: string = sortBy) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sort,
        status,
      });

      const response = await fetch(`/api/admin/reviews?${params}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.page);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchReviews(1, statusFilter, sortBy);
  }, [statusFilter, sortBy]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
      fetchReviews(page, statusFilter, sortBy);
    }
  };

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setSelectedReview(null);
      }
    };

    if (showModal) {
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
  }, [showModal]);

  const handleModerateReview = async (reviewId: string, status: string, note?: string) => {
    try {
      setIsModerating(true);
      
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status, moderationNote: note }),
      });

      if (!response.ok) {
        throw new Error("Failed to moderate review");
      }

      // Refresh reviews
      await fetchReviews(currentPage, statusFilter, sortBy);
      setShowModal(false);
      setSelectedReview(null);
    } catch (err) {
      console.error("Error moderating review:", err);
      setError(err instanceof Error ? err.message : "Failed to moderate review");
    } finally {
      setIsModerating(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Refresh reviews
      await fetchReviews(currentPage, statusFilter, sortBy);
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Rejected
          </span>
        );
      case "HIDDEN":
        return (
          <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            Hidden
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (name?: string, email?: string) => {
    if (name) return name;
    if (email) {
      const [localPart] = email.split("@");
      return localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }
    return "Anonymous User";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= rating ? 'text-yellow-400' : 'text-white/20'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs sm:text-sm text-white/60">({rating})</span>
      </div>
    );
  };

  if (loading && reviews.length === 0) {
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
              <span>Review Management</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mb-3 sm:mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              Review Management
            </h1>
            <p className="text-sm sm:text-base text-white/60">
              Moderate and manage user reviews
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          {/* Total Reviews */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Total</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.totalReviews}
              </p>
            </div>
          </div>

          {/* Pending Reviews */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Pending</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.pendingReviews}
              </p>
            </div>
          </div>

          {/* Approved Reviews */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Approved</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.approvedReviews}
              </p>
            </div>
          </div>

          {/* Rejected Reviews */}
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
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Rejected</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.rejectedReviews}
              </p>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">Avg Rating</h3>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                {loading ? "..." : stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Full Width Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Filters and Search */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="hidden">Hidden</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent transition-all duration-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="status">By Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-lg animate-pulse">
                      <div className="w-12 h-12 bg-slate-700/60 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-700/60 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-6 bg-slate-700/60 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">No reviews found</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/60">No reviews match your current filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/60 border-b-2 border-slate-700/80 sticky top-0 z-20">
                      <tr>
                        <th className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[200px]">User</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[100px]">Rating</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[300px]">Comment</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[100px]">Status</th>
                        <th className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-slate-800/60 backdrop-blur-sm text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider min-w-[180px]">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-slate-800/60 transition-all duration-200 group border-b border-slate-700/60">
                          <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 min-w-[200px]">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs sm:text-sm font-bold">
                                  {getInitials(review.user.name, review.user.email)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate mb-0.5">{getDisplayName(review.user.name, review.user.email)}</p>
                                <p className="text-xs sm:text-sm lg:text-base text-white/70 truncate">{review.user.email || "No email"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[100px]">
                            {renderStars(review.rating)}
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[300px]">
                            <p className="text-xs sm:text-sm lg:text-base text-white/80 line-clamp-2">{review.comment || "No comment"}</p>
                            {review.moderationNote && (
                              <p className="text-xs sm:text-sm text-white/50 mt-1 italic">Note: {review.moderationNote}</p>
                            )}
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[100px]">
                            <div className="flex flex-col items-start gap-2">
                              {getStatusBadge(review.status)}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedReview(review);
                                    setShowModal(true);
                                  }}
                                  className="px-2 sm:px-3 py-1 sm:py-1 bg-slate-800/40 hover:bg-slate-800/60 text-white text-xs sm:text-sm font-semibold rounded-lg border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300"
                                >
                                  Moderate
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="px-2 sm:px-3 py-1 sm:py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs sm:text-sm font-semibold rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 min-w-[180px]">
                            <span className="text-xs sm:text-sm lg:text-base text-white/70 block">{formatDate(review.createdAt)}</span>
                            {review.moderatedAt && (
                              <span className="text-xs sm:text-sm text-white/50 block mt-1">Moderated: {formatDate(review.moderatedAt)}</span>
                            )}
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
                Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
              </p>
              {pagination.pages > 1 && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white hover:bg-slate-800/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Previous
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
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Moderation Modal */}
        {showModal && selectedReview && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4 sm:p-6 lg:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setSelectedReview(null);
              }
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Moderate Review</h3>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedReview(null);
                      }}
                      className="p-2 text-white/60 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(selectedReview.rating)}
                      <span className="text-xs sm:text-sm text-white/60">
                        by {getDisplayName(selectedReview.user.name, selectedReview.user.email)}
                      </span>
                    </div>
                    {selectedReview.comment && (
                      <p className="text-xs sm:text-sm text-white/80 bg-slate-800/40 p-3 rounded-lg border border-slate-700/60">
                        "{selectedReview.comment}"
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                        Action
                      </label>
                      <select
                        id="moderation-status"
                        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                        defaultValue={selectedReview.status}
                      >
                        <option value="APPROVED">Approve</option>
                        <option value="REJECTED">Reject</option>
                        <option value="HIDDEN">Hide</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="moderation-note" className="block text-xs sm:text-sm font-medium text-white mb-2">
                        Moderation Note (Optional)
                      </label>
                      <textarea
                        id="moderation-note"
                        className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-800/40 border border-slate-700/60 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Add a note about this moderation decision..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-700/60">
                    <button
                      onClick={() => {
                        const status = (document.getElementById('moderation-status') as HTMLSelectElement).value;
                        const note = (document.getElementById('moderation-note') as HTMLTextAreaElement).value;
                        handleModerateReview(selectedReview.id, status, note);
                      }}
                      disabled={isModerating}
                      className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                    >
                      {isModerating ? "Processing..." : "Moderate"}
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedReview(null);
                      }}
                      disabled={isModerating}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800/40 hover:bg-slate-800/60 text-white rounded-lg sm:rounded-xl border border-slate-700/60 hover:border-slate-600/60 transition-all duration-300 text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
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
