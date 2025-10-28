import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// GET /api/referrals - Get user's referral data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's referral codes
    const referralCodes = await prisma.referralCode.findMany({
      where: { ownerId: userId },
      include: {
        events: {
          where: { status: "APPROVED" },
          include: {
            referredUser: {
              select: { id: true, name: true, email: true, createdAt: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Get user's referral events (as referrer)
    const referralEvents = await prisma.referralEvent.findMany({
      where: { referrerId: userId },
      include: {
        referralCode: true,
        referredUser: {
          select: { id: true, name: true, email: true, createdAt: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate total referrals
    const totalReferrals = referralEvents.filter(event => event.status === "APPROVED").length;

    // Get user's referral events (as referred user)
    const referredEvents = await prisma.referralEvent.findMany({
      where: { referredUserId: userId },
      include: {
        referralCode: true,
        referrer: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      referralCodes,
      referralEvents,
      referredEvents,
      totalReferrals,
      stats: {
        totalReferrals,
        totalRewards: referralEvents.reduce((sum, event) => sum + event.rewardGranted, 0),
        pendingReferrals: referralEvents.filter(event => event.status === "PENDING").length
      }
    });
  } catch (error) {
    console.error("Error fetching referral data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/referrals - Create new referral code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { maxRewardsTotal, dailyCap } = await request.json();

    // Generate unique referral code
    const code = nanoid(8).toUpperCase();

    // Check if code already exists (very unlikely with nanoid)
    const existingCode = await prisma.referralCode.findUnique({
      where: { code }
    });

    if (existingCode) {
      return NextResponse.json({ error: "Code already exists, please try again" }, { status: 409 });
    }

    // Create referral code
    const referralCode = await prisma.referralCode.create({
      data: {
        code,
        ownerId: userId,
        maxRewardsTotal: maxRewardsTotal || null,
        dailyCap: dailyCap || null
      }
    });

    return NextResponse.json({ referralCode });
  } catch (error) {
    console.error("Error creating referral code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}