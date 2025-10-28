import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    if (video.status !== 'COMPLETED') {
      return NextResponse.json({ error: "Video not ready" }, { status: 400 });
    }

    // Return the actual video URL from D-ID
    if (!video.videoUrl) {
      return NextResponse.json({ error: "Video URL not available" }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      downloadUrl: video.videoUrl,
      filename: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`
    });

  } catch (error) {
    console.error('Error getting download URL:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}