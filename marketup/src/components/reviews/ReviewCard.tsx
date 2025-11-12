"use client";

import StarRating from "./StarRating";

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
    <div className={`group relative ${className}`}>
      {/* Outer glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Main card */}
      <div className="relative p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/60 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {showUser && (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex-shrink-0">
                  {getInitials(review.user.name, review.user.email)}
                </div>
              )}
              <div>
                {showUser && (
                  <h4 className="font-semibold text-white mb-1.5">
                    {getDisplayName(review.user.name, review.user.email)}
                  </h4>
                )}
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-white/50">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {review.comment && (
            <p className="text-white/80 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
