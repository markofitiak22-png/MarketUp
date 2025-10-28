import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/referrals - Get all referral events for admin review
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can implement proper admin check here)
    // For now, we'll just check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referralEvents = await prisma.referralEvent.findMany({
      include: {
        referrer: {
          select: { id: true, name: true, email: true }
        },
        referredUser: {
          select: { id: true, name: true, email: true, createdAt: true }
        },
        referralCode: {
          select: { id: true, code: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ referralEvents });
  } catch (error) {
    console.error("Error fetching referral events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/referrals - Update referral event status
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, status, reviewReason } = await request.json();

    if (!eventId || !status) {
      return NextResponse.json({ error: "Event ID and status are required" }, { status: 400 });
    }

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update referral event
    const updatedEvent = await prisma.referralEvent.update({
      where: { id: eventId },
      data: {
        status,
        reviewReason: reviewReason || null,
        rewardGranted: status === "APPROVED" ? 1 : 0 // Grant 1 reward point for approved referrals
      },
      include: {
        referrer: {
          select: { id: true, name: true, email: true }
        },
        referredUser: {
          select: { id: true, name: true, email: true }
        },
        referralCode: {
          select: { id: true, code: true }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      referralEvent: updatedEvent,
      message: `Referral ${status.toLowerCase()} successfully`
    });
  } catch (error) {
    console.error("Error updating referral event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
