"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import StarRating from "@/components/reviews/StarRating";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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

interface ReviewsData {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: Record<string, number>;
}

export default function AdminReviewsPage() {
  const { translations } = useTranslations();
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModerating, setIsModerating] = useState(false);

  const fetchReviews = async (page: number = 1, status: string = "all", sort: string = "newest") => {
    try {
      setIsLoading(true);
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
      setReviewsData(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchReviews(currentPage, statusFilter, sortBy);
  }, [currentPage, statusFilter, sortBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
      case "HIDDEN":
        return "text-foreground-muted bg-surface";
      default:
        return "text-foreground-muted bg-surface";
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

  if (isLoading && !reviewsData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-foreground-muted mt-2">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error && !reviewsData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">Error Loading Reviews</h4>
        <p className="text-foreground-muted mb-4">{error}</p>
        <Button onClick={() => fetchReviews(currentPage, statusFilter, sortBy)}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Review Management</h1>
          <p className="text-foreground-muted">Moderate and manage user reviews</p>
        </div>
        
        {/* Stats */}
        {reviewsData?.stats && (
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-foreground">{reviewsData.stats.PENDING || 0}</div>
              <div className="text-foreground-muted">Pending</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">{reviewsData.stats.APPROVED || 0}</div>
              <div className="text-foreground-muted">Approved</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">{reviewsData.stats.REJECTED || 0}</div>
              <div className="text-foreground-muted">Rejected</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
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
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData?.reviews.length === 0 ? (
          <Card variant="elevated" className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
              <svg className="w-8 h-8 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">No reviews found</h4>
            <p className="text-foreground-muted">No reviews match your current filters.</p>
          </Card>
        ) : (
          reviewsData?.reviews.map((review) => (
            <Card key={review.id} variant="elevated" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(review.user.name, review.user.email)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {getDisplayName(review.user.name, review.user.email)}
                    </h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-foreground-muted">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      Moderate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              
              {review.comment && (
                <p className="text-foreground-muted leading-relaxed mb-4">
                  {review.comment}
                </p>
              )}
              
              {review.moderationNote && (
                <div className="bg-surface border border-border rounded-lg p-3">
                  <p className="text-sm text-foreground-muted">
                    <strong>Moderation Note:</strong> {review.moderationNote}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {reviewsData && reviewsData.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, reviewsData.pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === reviewsData.pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Moderation Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Moderate Review</h3>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={selectedReview.rating} size="sm" />
                  <span className="text-sm text-foreground-muted">
                    by {getDisplayName(selectedReview.user.name, selectedReview.user.email)}
                  </span>
                </div>
                {selectedReview.comment && (
                  <p className="text-sm text-foreground-muted bg-surface p-3 rounded-lg border border-border">
                    "{selectedReview.comment}"
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Action
                  </label>
                  <select
                    id="moderation-status"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    defaultValue={selectedReview.status}
                  >
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                    <option value="HIDDEN">Hide</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="moderation-note" className="block text-sm font-medium text-foreground mb-2">
                    Moderation Note (Optional)
                  </label>
                  <textarea
                    id="moderation-note"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    rows={3}
                    placeholder="Add a note about this moderation decision..."
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => {
                    const status = (document.getElementById('moderation-status') as HTMLSelectElement).value;
                    const note = (document.getElementById('moderation-note') as HTMLTextAreaElement).value;
                    handleModerateReview(selectedReview.id, status, note);
                  }}
                  disabled={isModerating}
                  className="flex-1"
                >
                  {isModerating ? "Processing..." : "Moderate"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReview(null)}
                  disabled={isModerating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
