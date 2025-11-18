import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveSubscriptionForUser } from "@/lib/subscriptions";
import { addWatermarkToVideo } from "@/lib/watermark";

/**
 * Add watermark to video based on subscription plan and export type
 */
export async function POST(request: NextRequest) {
  console.log(`[Watermark] ===== WATERMARK API CALLED =====`);
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      console.error(`[Watermark] Unauthorized - no session`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    console.log(`[Watermark] User ID: ${userId}`);
    
    const body = await request.json();
    console.log(`[Watermark] Request body:`, body);
    const { videoId, exportType } = body; // exportType: 'download' | 'social_media'

    if (!videoId || !exportType) {
      console.error(`[Watermark] Missing required fields: videoId=${videoId}, exportType=${exportType}`);
      return NextResponse.json(
        { error: "videoId and exportType are required" },
        { status: 400 }
      );
    }
    
    console.log(`[Watermark] Processing watermark for videoId: ${videoId}, exportType: ${exportType}`);

    // Get video from database
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId,
      },
    });

    if (!video || !video.videoUrl) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Get user's subscription
    const subscription = await getActiveSubscriptionForUser(userId);
    const tier = subscription?.tier || null;

    console.log(`[Watermark] User ${userId}, tier: ${tier}, exportType: ${exportType}`);

    // Determine watermark type based on plan and export type
    let watermarkType: "none" | "corner" | "animated" | "full" = "none";

    if (exportType === "social_media") {
      // No watermark for social media export (Pro and Premium)
      watermarkType = "none";
      console.log(`[Watermark] Social media export - no watermark`);
    } else {
      // Download export - apply watermarks based on plan
      if (!tier || tier === "BASIC") {
        // Free plan: Full watermark (logo + name, appearing/disappearing)
        watermarkType = "full";
        console.log(`[Watermark] Free plan - full watermark`);
      } else if (tier === "STANDARD") {
        // Pro plan: Small corner watermark
        watermarkType = "corner";
        console.log(`[Watermark] Pro plan - corner watermark`);
      } else if (tier === "PREMIUM") {
        // Premium plan: Small watermark that fades in/out
        watermarkType = "animated";
        console.log(`[Watermark] Premium plan - animated watermark`);
      }
    }

    // If no watermark needed, return original video URL
    if (watermarkType === "none") {
      // Update export type in database
      await prisma.video.update({
        where: { id: videoId },
        data: { exportType: exportType },
      });

      return NextResponse.json({
        success: true,
        videoUrl: video.videoUrl,
        watermarkType: "none",
      });
    }

    // Process video with watermark
    let watermarkedVideoUrl: string;
    try {
      console.log(`[Watermark] Starting watermark processing...`);
      watermarkedVideoUrl = await addWatermarkToVideo(
        video.videoUrl,
        watermarkType,
        videoId
      );
      console.log(`[Watermark] Watermarked video URL: ${watermarkedVideoUrl}`);
      
      // Verify the watermarked file exists
      if (watermarkedVideoUrl.startsWith('/videos/')) {
        const fs = await import("fs/promises");
        const pathModule = await import("path");
        const fullPath = pathModule.join(process.cwd(), 'public', watermarkedVideoUrl);
        try {
          const stats = await fs.stat(fullPath);
          console.log(`[Watermark] Verified watermarked file exists: ${stats.size} bytes`);
        } catch (statError) {
          console.error(`[Watermark] Watermarked file not found at: ${fullPath}`);
          throw new Error(`Watermarked file was not created`);
        }
      }
    } catch (error: any) {
      console.error(`[Watermark] Failed to add watermark:`, error);
      console.error(`[Watermark] Error message:`, error.message);
      console.error(`[Watermark] Error stack:`, error.stack);
      // For now, return original video but log the error
      // TODO: In production, you might want to return an error or retry
      console.warn(`[Watermark] Falling back to original video due to watermark error`);
      watermarkedVideoUrl = video.videoUrl;
    }

    // Update export type in database
    await prisma.video.update({
      where: { id: videoId },
      data: { exportType: exportType },
    });

    return NextResponse.json({
      success: true,
      videoUrl: watermarkedVideoUrl,
      watermarkType: watermarkType,
    });
  } catch (error: any) {
    console.error("Watermark error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add watermark" },
      { status: 500 }
    );
  }
}


