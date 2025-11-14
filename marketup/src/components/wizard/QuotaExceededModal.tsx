"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  videosUsed: number;
  videoLimit: number;
}

export default function QuotaExceededModal({
  isOpen,
  onClose,
  planName,
  videosUsed,
  videoLimit,
}: QuotaExceededModalProps) {
  const router = useRouter();
  const { translations } = useTranslations();

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Block scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll on unmount
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push("/dashboard/subscription");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-slate-900/95 backdrop-blur-sm border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700/60 bg-slate-800/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {translations.monthlyVideoLimitReached}
              </h2>
              <p className="text-sm text-white/60">
                {planName} {translations.planLimitExceeded}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Explanation */}
          <div className="space-y-3">
            <p className="text-white/90 leading-relaxed">
              {translations.youveReachedMonthlyLimit}{" "}
              <span className="font-semibold text-indigo-400">{planName}</span>{" "}
              plan.
            </p>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">{translations.videosCreated}</span>
                <span className="text-sm font-semibold text-white">
                  {videosUsed} / {videoLimit}
                </span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {translations.toCreateMoreVideos}
            </p>
          </div>

          {/* Benefits of upgrading */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">
              {translations.upgradeBenefits}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>{translations.pricingPro}:</strong> {translations.proPlanBenefits}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  <strong>{translations.pricingPremium}:</strong> {translations.premiumPlanBenefits}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/60 bg-slate-800/40 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-slate-800/60 hover:bg-slate-800/80 text-white rounded-lg transition-all duration-300 border border-slate-700/60"
          >
            {translations.close}
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
          >
            {translations.upgradePlan}
          </button>
        </div>
      </div>
    </div>
  );
}

