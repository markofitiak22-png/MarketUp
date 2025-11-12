"use client";

import { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import Button from "../ui/Button";

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

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  isLoading = false,
  className = "",
}: ReviewsListProps) {
  const [sortBy, setSortBy] = useState("newest");

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    onSortChange(newSort);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                : "text-white/20 fill-white/10"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500/30 border-t-indigo-500 mx-auto"></div>
          <p className="text-white/60 mt-4">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Summary */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50" />
        <div className="relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-8 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-white/60">
                  Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white">
          Reviews ({totalReviews})
        </h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/70 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-slate-700/60 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">No reviews yet</h4>
          <p className="text-white/60">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
