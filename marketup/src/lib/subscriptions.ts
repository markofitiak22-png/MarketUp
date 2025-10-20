import { prisma } from "@/lib/prisma";
import type { PlanTier, Subscription } from "@prisma/client";

export type Feature =
  | "video.backgrounds"
  | "video.products"
  | "video.logo"
  | "video.monthlyQuota";

export const planFeatures: Record<PlanTier, Record<Feature, number | boolean>> = {
  BASIC: {
    "video.backgrounds": 2,
    "video.products": 2,
    "video.logo": false,
    "video.monthlyQuota": 1,
  },
  STANDARD: {
    "video.backgrounds": 4,
    "video.products": 6,
    "video.logo": true,
    "video.monthlyQuota": 10,
  },
  PREMIUM: {
    "video.backgrounds": 6,
    "video.products": 12,
    "video.logo": true,
    "video.monthlyQuota": 9999,
  },
};

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


