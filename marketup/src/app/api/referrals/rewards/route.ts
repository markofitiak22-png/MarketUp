import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/referrals/rewards - Get reward ladder data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's approved referrals
    const approvedReferrals = await prisma.referralEvent.findMany({
      where: {
        referrerId: userId,
        status: "APPROVED"
      }
    });

    const totalReferrals = approvedReferrals.length;

    // Define reward levels
    const rewardLevels = [
      { id: 1, requirement: 3, reward: "5% discount on next subscription", icon: "💰" },
      { id: 2, requirement: 5, reward: "1 month free plan (Pro Plan)", icon: "📅" },
      { id: 3, requirement: 8, reward: "$15 gift card (Amazon / App Store / Google Play)", icon: "🎁" },
      { id: 4, requirement: 12, reward: "Wireless charging pad", icon: "🔋" },
      { id: 5, requirement: 18, reward: "Small Bluetooth headphones", icon: "🎧" },
      { id: 6, requirement: 25, reward: "Mini Drone", icon: "🚁" },
      { id: 7, requirement: 35, reward: "Mechanical keyboard or gaming mouse", icon: "⌨️" },
      { id: 8, requirement: 50, reward: "AirPods", icon: "🎵" },
      { id: 9, requirement: 75, reward: "Apple Watch", icon: "⌚" },
      { id: 10, requirement: 100, reward: "The new iPhone", icon: "📱" }
    ];

    // Calculate unlocked rewards
    const rewards = rewardLevels.map(level => ({
      ...level,
      unlocked: totalReferrals >= level.requirement,
      isNext: totalReferrals < level.requirement && totalReferrals >= (level.requirement - 3)
    }));

    // Find next reward
    const nextReward = rewards.find(reward => !reward.unlocked);

    return NextResponse.json({
      totalReferrals,
      rewards,
      nextReward,
      stats: {
        totalReferrals,
        unlockedRewards: rewards.filter(r => r.unlocked).length,
        nextRewardRequirement: nextReward?.requirement || 100
      }
    });
  } catch (error) {
    console.error("Error fetching reward data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/referrals/rewards - Claim a reward
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { rewardId } = await request.json();

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID is required" }, { status: 400 });
    }

    // Get user's approved referrals
    const approvedReferrals = await prisma.referralEvent.findMany({
      where: {
        referrerId: userId,
        status: "APPROVED"
      }
    });

    const totalReferrals = approvedReferrals.length;

    // Define reward levels
    const rewardLevels = [
      { id: 1, requirement: 3, reward: "5% discount on next subscription" },
      { id: 2, requirement: 5, reward: "1 month free plan (Pro Plan)" },
      { id: 3, requirement: 8, reward: "$15 gift card (Amazon / App Store / Google Play)" },
      { id: 4, requirement: 12, reward: "Wireless charging pad" },
      { id: 5, requirement: 18, reward: "Small Bluetooth headphones" },
      { id: 6, requirement: 25, reward: "Mini Drone" },
      { id: 7, requirement: 35, reward: "Mechanical keyboard or gaming mouse" },
      { id: 8, requirement: 50, reward: "AirPods" },
      { id: 9, requirement: 75, reward: "Apple Watch" },
      { id: 10, requirement: 100, reward: "The new iPhone" }
    ];

    const reward = rewardLevels.find(r => r.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Invalid reward ID" }, { status: 404 });
    }

    if (totalReferrals < reward.requirement) {
      return NextResponse.json({ error: "You haven't reached this reward level yet" }, { status: 400 });
    }

    // Here you would implement the actual reward claiming logic
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: `Reward "${reward.reward}" has been claimed! You will receive instructions via email.`,
      reward
    });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
