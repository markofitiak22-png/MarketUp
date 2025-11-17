import { prisma } from "@/lib/prisma";
import type { PlanTier, Subscription } from "@prisma/client";

export type Feature =
  | "video.backgrounds"
  | "video.products"
  | "video.logo"
  | "video.monthlyQuota"
  | "video.quality"
  | "video.subtitles"
  | "video.edits";

export const planFeatures: Record<PlanTier, Record<Feature, number | boolean | string>> = {
  BASIC: {
    "video.backgrounds": 2,
    "video.products": 2,
    "video.logo": false,
    "video.monthlyQuota": 1,
    "video.quality": "standard", // Free Plan: Standard quality
    "video.subtitles": false, // Free Plan: No subtitles
    "video.edits": 0, // Free Plan: 0 edits - only preview, no editing
  },
  STANDARD: {
    "video.backgrounds": 4,
    "video.products": 6,
    "video.logo": true,
    "video.monthlyQuota": 4,
    "video.quality": "hd", // Pro Plan: HD quality
    "video.subtitles": false, // Pro Plan: No subtitles (not mentioned)
    "video.edits": 1, // Pro Plan: 1 edit allowed
  },
  PREMIUM: {
    "video.backgrounds": 6,
    "video.products": 12,
    "video.logo": true,
    "video.monthlyQuota": 7,
    "video.quality": "4k", // Premium Plan: HD/4K quality
    "video.subtitles": true, // Premium Plan: Subtitles included
    "video.edits": 2, // Premium Plan: 2 edits allowed
  },
};

// Video duration limits per plan (in seconds)
// Only max duration is enforced, min is always 1 second
export const planDurationLimits: Record<PlanTier | "FREE", { min: number; max: number }> = {
  FREE: { min: 1, max: 20 }, // Free Plan: up to 20 seconds
  BASIC: { min: 1, max: 20 }, // Same as Free
  STANDARD: { min: 1, max: 180 }, // Pro Plan: up to 180 seconds
  PREMIUM: { min: 1, max: 180 }, // Premium Plan: up to 180 seconds
};

// Get monthly video quota limit for a plan
export function getMonthlyVideoLimit(tier: PlanTier | null): number {
  if (!tier) return 1; // Free plan
  return planFeatures[tier]["video.monthlyQuota"] as number;
}

// Get duration limits for a plan
export function getDurationLimits(tier: PlanTier | null): { min: number; max: number } {
  if (!tier) return planDurationLimits.FREE;
  return planDurationLimits[tier];
}

export async function getActiveSubscriptionForUser(userId: string): Promise<Subscription | null> {
  const now = new Date();
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: { gt: now },
    },
    orderBy: { currentPeriodEnd: "desc" },
  });
}

export function isFeatureAllowed(tier: PlanTier, feature: Feature): boolean {
  const value = planFeatures[tier][feature];
  return typeof value === "boolean" ? (value as boolean) : (value as number) > 0;
}

// Get videos created this month for a user
export async function getVideosThisMonth(userId: string): Promise<number> {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  return prisma.video.count({
    where: {
      userId,
      createdAt: {
        gte: thisMonth,
      },
    },
  });
}

// Calculate video duration from text (words per second: ~2.5)
export function calculateDurationFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  return Math.max(1, Math.ceil(wordCount / 2.5));
}

// Get allowed video quality for a plan
export function getAllowedQuality(tier: PlanTier | null): "standard" | "hd" | "4k" {
  if (!tier) return "standard"; // Free plan
  const quality = planFeatures[tier]["video.quality"];
  if (typeof quality === "string") {
    return quality as "standard" | "hd" | "4k";
  }
  return "standard";
}

// Check if subtitles are allowed for a plan
export function areSubtitlesAllowed(tier: PlanTier | null): boolean {
  if (!tier) return false; // Free plan: no subtitles
  const subtitles = planFeatures[tier]["video.subtitles"];
  return typeof subtitles === "boolean" ? subtitles : false;
}

// Get allowed video edits for a plan
export function getAllowedEdits(tier: PlanTier | null): number {
  if (!tier) return 0; // Free plan: 0 edits
  const edits = planFeatures[tier]["video.edits"];
  return typeof edits === "number" ? edits : 0;
}


