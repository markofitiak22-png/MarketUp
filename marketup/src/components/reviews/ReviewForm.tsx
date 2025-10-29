"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import SimpleCaptcha from "./SimpleCaptcha";
import Card from "../ui/Card";
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
      <Card variant="elevated" className={`p-6 text-center ${className}`}>
        <p className="text-foreground-muted">
          Please sign in to leave a review.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={`p-6 ${className}`}>
      <h3 className="text-xl font-bold text-foreground mb-4">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rating *
          </label>
          <div className="mb-2">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
              size="lg"
            />
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
            Comment *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with MarketUp..."
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
            <p className="text-sm text-foreground-muted ml-auto">
              {comment.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Captcha */}
        <SimpleCaptcha onVerify={setIsCaptchaValid} />
        {errors.captcha && (
          <p className="text-red-500 text-sm">{errors.captcha}</p>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10 || !isCaptchaValid}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
