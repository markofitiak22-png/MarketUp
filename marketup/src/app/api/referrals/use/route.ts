import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/referrals/use - Test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: "Referral use endpoint is working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

// POST /api/referrals/use - Use a referral code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    // Find the referral code
    console.log('Looking for referral code:', code.toUpperCase());
    const referralCode = await prisma.referralCode.findUnique({
      where: { code: code.toUpperCase() },
      include: { owner: true }
    });

    console.log('Found referral code:', referralCode);

    if (!referralCode) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Check if user is trying to use their own code
    if (referralCode.ownerId === userId) {
      return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
    }

    // Check if user has already used a referral code
    const existingReferral = await prisma.referralEvent.findFirst({
      where: { referredUserId: userId }
    });

    if (existingReferral) {
      return NextResponse.json({ error: "You have already used a referral code" }, { status: 400 });
    }

    // Check daily cap
    if (referralCode.dailyCap) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayReferrals = await prisma.referralEvent.count({
        where: {
          referralCodeId: referralCode.id,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      if (todayReferrals >= referralCode.dailyCap) {
        return NextResponse.json({ error: "Daily referral limit reached for this code" }, { status: 429 });
      }
    }

    // Check total cap
    if (referralCode.maxRewardsTotal) {
      const totalReferrals = await prisma.referralEvent.count({
        where: {
          referralCodeId: referralCode.id,
          status: "APPROVED"
        }
      });

      if (totalReferrals >= referralCode.maxRewardsTotal) {
        return NextResponse.json({ error: "Referral code has reached its maximum usage limit" }, { status: 429 });
      }
    }

    // Get user's IP and fingerprint for anti-abuse
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create referral event with automatic approval
    const referralEvent = await prisma.referralEvent.create({
      data: {
        referrerId: referralCode.ownerId,
        referredUserId: userId,
        referralCodeId: referralCode.id,
        referredIpHash: Buffer.from(ip).toString("base64"), // Simple hash for demo
        userAgent,
        status: "APPROVED",
        rewardGranted: 1
      },
      include: {
        referrer: {
          select: { id: true, name: true, email: true }
        },
        referralCode: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      referralEvent,
      message: "Referral code used successfully! Your referral has been approved and your friend will receive rewards."
    });
  } catch (error) {
    console.error("Error using referral code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
