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
    // ALWAYS add watermark for download (force it for testing)
    let finalVideoUrl = video.videoUrl;
    
    console.log(`[Download] ==========================================`);
    console.log(`[Download] 🚀 STARTING WATERMARK PROCESS`);
    console.log(`[Download] Video ID: ${videoId}`);
    console.log(`[Download] Export Type: ${exportType}`);
    console.log(`[Download] Original URL: ${video.videoUrl}`);
    console.log(`[Download] ==========================================`);
    
    try {
      // Get user's subscription
      const subscription = await getActiveSubscriptionForUser(userId);
      const tier = subscription?.tier || null;
      console.log(`[Download] User tier: ${tier}`);

      // FORCE watermark for ALL downloads (for testing)
      let watermarkType: "none" | "corner" | "animated" | "full" = "full"; // FORCE FULL for testing
      
      if (exportType === "social_media") {
        watermarkType = "none";
        console.log(`[Download] Social media export - no watermark`);
      } else {
        // FORCE watermark for all downloads
        watermarkType = "full";
        console.log(`[Download] 🔥 FORCING FULL WATERMARK FOR ALL DOWNLOADS`);
      }

      // ALWAYS process watermark if not social_media
      if (watermarkType !== "none") {
        console.log(`[Download] ⚠️ WATERMARK NEEDED: ${watermarkType}`);
        console.log(`[Download] Importing watermark module...`);
        
        const { addWatermarkToVideo } = await import("@/lib/watermark");
        console.log(`[Download] ✅ Module imported`);
        console.log(`[Download] Calling addWatermarkToVideo...`);
        console.log(`[Download] Video URL: ${video.videoUrl}`);
        console.log(`[Download] Video ID: ${videoId}`);
        console.log(`[Download] Watermark Type: ${watermarkType}`);
        
        try {
          finalVideoUrl = await addWatermarkToVideo(video.videoUrl, watermarkType, videoId);
          console.log(`[Download] ✅✅✅ SUCCESS! Watermarked URL: ${finalVideoUrl}`);
        } catch (watermarkError: any) {
          console.error(`[Download] ❌❌❌ WATERMARK PROCESSING FAILED:`);
          console.error(`[Download] Error:`, watermarkError);
          console.error(`[Download] Error message:`, watermarkError?.message);
          console.error(`[Download] Error stack:`, watermarkError?.stack);
          throw watermarkError; // THROW ERROR INSTEAD OF SILENTLY FAILING
        }
      } else {
        console.log(`[Download] No watermark needed (watermarkType: ${watermarkType})`);
      }
    } catch (error: any) {
      console.error(`[Download] ❌❌❌ CRITICAL ERROR:`);
      console.error(`[Download] Error:`, error);
      console.error(`[Download] Error message:`, error?.message);
      console.error(`[Download] Error stack:`, error?.stack);
      // DON'T silently fail - return error
      return NextResponse.json({ 
        error: `Watermark processing failed: ${error?.message || 'Unknown error'}`,
        success: false
      }, { status: 500 });
    }
    
    console.log(`[Download] ==========================================`);
    console.log(`[Download] FINAL RESPONSE:`);
    console.log(`[Download] Original URL: ${video.videoUrl}`);
    console.log(`[Download] Final URL: ${finalVideoUrl}`);
    console.log(`[Download] Is watermarked: ${finalVideoUrl !== video.videoUrl}`);
    console.log(`[Download] ==========================================`);
    
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