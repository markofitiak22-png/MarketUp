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
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get("exportType") || "download"; // 'download' or 'social_media'

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

    // Add watermark based on export type
    // Call watermark API to process video
    let finalVideoUrl = video.videoUrl;
    
    try {
      console.log(`[Download] Processing watermark for video ${videoId}, exportType: ${exportType}`);
      const watermarkResponse = await fetch(`${request.nextUrl.origin}/api/video/watermark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify({
          videoId: videoId,
          exportType: exportType
        })
      });

      if (watermarkResponse.ok) {
        const watermarkData = await watermarkResponse.json();
        console.log(`[Download] Watermark response:`, watermarkData);
        if (watermarkData.success && watermarkData.videoUrl) {
          finalVideoUrl = watermarkData.videoUrl;
          console.log(`[Download] Using watermarked video: ${finalVideoUrl}`);
        } else {
          console.warn(`[Download] Watermark API returned success but no videoUrl, using original`);
        }
      } else {
        const errorData = await watermarkResponse.json().catch(() => ({}));
        console.error(`[Download] Watermark API failed:`, watermarkResponse.status, errorData);
        // Continue with original video if watermark fails
      }
    } catch (error) {
      console.error(`[Download] Error calling watermark API:`, error);
      // Continue with original video if watermark fails
    }
    
    return NextResponse.json({
      success: true,
      downloadUrl: finalVideoUrl,
      filename: `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`,
      exportType: exportType
    });

  } catch (error) {
    console.error('Error getting download URL:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}