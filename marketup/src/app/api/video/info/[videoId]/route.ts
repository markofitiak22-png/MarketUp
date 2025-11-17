import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveSubscriptionForUser } from "@/lib/subscriptions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const { videoId } = await params;

    // Get video from database
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId
      }
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Get user's subscription
    const subscription = await getActiveSubscriptionForUser(userId);
    const tier = subscription?.tier || null;

    return NextResponse.json({
      success: true,
      editCount: video.editCount || 0,
      published: video.published || false,
      subscriptionTier: tier,
      status: video.status
    });

  } catch (error) {
    console.error('Error getting video info:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

