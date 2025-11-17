import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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

    // Mark video as published
    await prisma.video.update({
      where: { id: videoId },
      data: { published: true }
    });

    return NextResponse.json({
      success: true,
      message: "Video marked as published"
    });

  } catch (error) {
    console.error('Error publishing video:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

