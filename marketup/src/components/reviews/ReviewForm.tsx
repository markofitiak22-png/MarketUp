"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import SimpleCaptcha from "./SimpleCaptcha";
import Button from "../ui/Button";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export default function ReviewForm({ onSubmit, isSubmitting = false, className = "" }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string; captcha?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { rating?: string; comment?: string; captcha?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (comment.trim().length < 10) {
      newErrors.comment = "Please write at least 10 characters";
    }
    
    if (comment.trim().length > 1000) {
      newErrors.comment = "Comment must be less than 1000 characters";
    }

    if (!isCaptchaValid) {
      newErrors.captcha = "Please complete the security check";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(rating, comment.trim());
      // Reset form on success
      setRating(0);
      setComment("");
      setIsCaptchaValid(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!session) {
    return (
      <div className={`relative p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-white/70 text-lg">
          Please sign in to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-2xl" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/50 to-purple-600/50 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  Write a Review
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Share your experience with MarketUp
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Rating *
              </label>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  interactive={true}
                  size="lg"
                />
              </div>
              {errors.rating && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Comment Section */}
            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-white mb-3">
                Comment *
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience with MarketUp..."
                  className="w-full px-4 py-3 border border-slate-700/60 rounded-xl bg-slate-800/50 backdrop-blur-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all duration-300"
                  rows={5}
                  maxLength={1000}
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/50 bg-slate-900/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {comment.length}/1000
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                {errors.comment && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.comment}
                  </p>
                )}
                <div className="ml-auto" />
              </div>
            </div>

            {/* Captcha */}
            <div>
              <SimpleCaptcha onVerify={setIsCaptchaValid} />
              {errors.captcha && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.captcha}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || comment.trim().length < 10 || !isCaptchaValid}
                className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
