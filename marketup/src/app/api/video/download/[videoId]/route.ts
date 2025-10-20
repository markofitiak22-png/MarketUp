import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = params;

    // In a real implementation, you would:
    // 1. Verify the user owns this video
    // 2. Get the video file from storage
    // 3. Stream the file to the client
    
    // For now, return a mock response
    return NextResponse.json({
      success: true,
      videoId,
      downloadUrl: `/api/video/stream/${videoId}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      metadata: {
        filename: `video_${videoId}.mp4`,
        size: '2.4MB',
        format: 'MP4',
        quality: 'HD'
      }
    });

  } catch (error) {
    console.error("Video download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
