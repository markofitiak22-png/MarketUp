"use client";

import StarRating from "./StarRating";
import Card from "../ui/Card";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  };
  showUser?: boolean;
  className?: string;
}

export default function ReviewCard({ review, showUser = true, className = "" }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  return (
    <Card variant="elevated" className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {showUser && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(review.user.name, review.user.email)}
            </div>
          )}
          <div>
            {showUser && (
              <h4 className="font-semibold text-foreground">
                {getDisplayName(review.user.name, review.user.email)}
              </h4>
            )}
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-foreground-muted">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {review.comment && (
        <p className="text-foreground-muted leading-relaxed">
          {review.comment}
        </p>
      )}
    </Card>
  );
}
