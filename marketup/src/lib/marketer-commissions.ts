import { prisma } from "@/lib/prisma";

interface TieredCommission {
  userCount: number;
  percentage: number;
}

// Subscription tier pricing (in cents per month)
const TIER_PRICING: Record<string, number> = {
  BASIC: 0, // Free tier
  STANDARD: 2900, // $29/month
  PREMIUM: 7900, // $79/month
};

/**
 * Calculate and update commission for a marketer when a user subscribes
 */
export async function calculateMarketerCommission(
  userId: string,
  subscriptionTier: "BASIC" | "STANDARD" | "PREMIUM",
  subscriptionAmountCents: number
) {
  try {
    // Find referral event for this user
    const referralEvent = await prisma.referralEvent.findFirst({
      where: {
        referredUserId: userId,
        status: "APPROVED",
      },
      include: {
        referralCode: {
          include: {
            marketer: true,
          },
        },
      },
    });

    if (!referralEvent || !referralEvent.referralCode?.marketer) {
      // No marketer referral found
      return null;
    }

    const marketer = referralEvent.referralCode.marketer;

    if (!marketer.isActive) {
      // Marketer is inactive
      return null;
    }

    // Get subscription amount (use provided amount or calculate from tier)
    const amountCents =
      subscriptionAmountCents || TIER_PRICING[subscriptionTier] || 0;

    if (amountCents === 0) {
      // No commission for free tier
      return null;
    }

    // Count total approved referrals for this marketer
    const totalReferrals = await prisma.referralEvent.count({
      where: {
        referralCode: {
          marketerId: marketer.id,
        },
        status: "APPROVED",
      },
    });

    // Determine commission percentage
    let commissionPercentage = marketer.baseCommissionPercentage;

    // Check tiered commissions
    if (marketer.tieredCommissions) {
      const tiers = marketer.tieredCommissions as unknown as TieredCommission[];
      // Sort by userCount descending to find the highest applicable tier
      const sortedTiers = [...tiers].sort(
        (a, b) => b.userCount - a.userCount
      );

      for (const tier of sortedTiers) {
        if (totalReferrals >= tier.userCount) {
          commissionPercentage = tier.percentage;
          break; // Use the highest applicable tier
        }
      }
    }

    // Calculate commission amount
    const commissionAmountCents = Math.round(
      (amountCents * commissionPercentage) / 100
    );

    // Update referral event with commission information
    await prisma.referralEvent.update({
      where: { id: referralEvent.id },
      data: {
        commissionPercentage,
        commissionAmountCents,
        commissionPaid: false, // Will be marked as paid when admin processes payment
      },
    });

    return {
      marketerId: marketer.id,
      marketerName: marketer.name,
      commissionPercentage,
      commissionAmountCents,
      totalReferrals,
    };
  } catch (error) {
    console.error("Error calculating marketer commission:", error);
    return null;
  }
}

