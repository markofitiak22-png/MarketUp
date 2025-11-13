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

    console.log('Raw code received:', code);
    console.log('Code type:', typeof code);

    if (!code) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    // Extract referral code from URL if it's a full URL
    let referralCode = code;
    if (typeof code === 'string' && code.includes('?')) {
      try {
        // Normalize the URL by converting HTTP to http
        const normalizedCode = code.replace(/^HTTP:/i, 'http:');
        console.log('Normalized URL:', normalizedCode);
        
        const url = new URL(normalizedCode);
        // Try both 'ref' and 'REF' parameter names (case insensitive)
        const refParam = url.searchParams.get('ref') || url.searchParams.get('REF');
        if (refParam) {
          referralCode = refParam;
          console.log('Extracted referral code from URL:', referralCode);
        } else {
          console.log('No ref parameter found in URL, using original code');
          console.log('Available parameters:', Array.from(url.searchParams.keys()));
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log('Failed to parse URL, using original code:', e.message);
        } else {
          console.log('Failed to parse URL, using original code: An unknown error occurred');
        }
      }
    } else {
      console.log('Code does not appear to be a URL, using as-is');
    }

    // Find the referral code
    console.log('Looking for referral code:', referralCode.toUpperCase());
    const referralCodeRecord = await prisma.referralCode.findUnique({
      where: { code: referralCode.toUpperCase() },
      include: { 
        owner: true,
        marketer: true
      }
    });

    console.log('Found referral code:', referralCodeRecord);

    if (!referralCodeRecord) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Check if user is trying to use their own code (only for user-owned codes)
    if (referralCodeRecord.ownerId && referralCodeRecord.ownerId === userId) {
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
    if (referralCodeRecord.dailyCap) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayReferrals = await prisma.referralEvent.count({
        where: {
          referralCodeId: referralCodeRecord.id,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      if (todayReferrals >= referralCodeRecord.dailyCap) {
        return NextResponse.json({ error: "Daily referral limit reached for this code" }, { status: 429 });
      }
    }

    // Check total cap
    if (referralCodeRecord.maxRewardsTotal) {
      const totalReferrals = await prisma.referralEvent.count({
        where: {
          referralCodeId: referralCodeRecord.id,
          status: "APPROVED"
        }
      });

      if (totalReferrals >= referralCodeRecord.maxRewardsTotal) {
        return NextResponse.json({ error: "Referral code has reached its maximum usage limit" }, { status: 429 });
      }
    }

    // Get user's IP and fingerprint for anti-abuse
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Get referrer ID (marketer codes use system user as owner)
    const referrerId = referralCodeRecord.ownerId;
    
    if (!referrerId) {
      return NextResponse.json({ 
        error: "Referral code configuration error" 
      }, { status: 500 });
    }

    // Create referral event with automatic approval
    const referralEvent = await prisma.referralEvent.create({
      data: {
        referrerId: referrerId!,
        referredUserId: userId,
        referralCodeId: referralCodeRecord.id,
        referredIpHash: Buffer.from(ip).toString("base64"), // Simple hash for demo
        userAgent,
        status: "APPROVED",
        rewardGranted: 1
      },
      include: {
        referrer: {
          select: { id: true, name: true, email: true }
        },
        referralCode: {
          include: {
            marketer: true
          }
        }
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
