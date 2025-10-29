"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
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
  stats: {
    averageRating: number;
    totalReviews: number;
  };
}

export default function ReviewsSection() {
  const { data: session } = useSession();
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (page: number = 1, sort: string = "newest") => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort,
        status: "approved",
      });

      const response = await fetch(`/api/reviews?${params}`, {
        credentials: "include", // Include session cookie for consistency
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviewsData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session cookie
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      // Refresh reviews after successful submission
      await fetchReviews(currentPage, sortBy);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
      throw err; // Re-throw to let the form handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReviews(page, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    fetchReviews(1, sort);
  };

  useEffect(() => {
    fetchReviews(currentPage, sortBy);
  }, []);

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
        <button
          onClick={() => fetchReviews(currentPage, sortBy)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-2 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {session && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Reviews List */}
      {reviewsData && (
        <ReviewsList
          reviews={reviewsData.reviews}
          averageRating={reviewsData.stats.averageRating}
          totalReviews={reviewsData.stats.totalReviews}
          currentPage={reviewsData.pagination.page}
          totalPages={reviewsData.pagination.pages}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          isLoading={isLoading}
        />
      )}

      {/* Error Message */}
      {error && reviewsData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
