import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveSubscriptionForUser } from "@/lib/subscriptions";
import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

// Set FFmpeg path
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

const isVercel = process.env.VERCEL === "1";

/**
 * Add watermark to video based on subscription plan and export type
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const body = await request.json();
    const { videoId, exportType } = body; // exportType: 'download' | 'social_media'

    if (!videoId || !exportType) {
      return NextResponse.json(
        { error: "videoId and exportType are required" },
        { status: 400 }
      );
    }

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
    const watermarkedVideoUrl = await addWatermarkToVideo(
      video.videoUrl,
      watermarkType,
      videoId
    );

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

/**
 * Add watermark to video using FFmpeg
 */
async function addWatermarkToVideo(
  videoUrl: string,
  watermarkType: "corner" | "animated" | "full",
  videoId: string
): Promise<string> {
  const tempDir = path.join(process.cwd(), "temp", `watermark_${Date.now()}`);
  const publicVideosDir = path.join(process.cwd(), "public", "videos");
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(publicVideosDir, { recursive: true });

  try {
    console.log(`[Watermark] Starting watermark process for type: ${watermarkType}`);
    console.log(`[Watermark] Video URL: ${videoUrl}`);
    
    // Download original video
    console.log(`[Watermark] Downloading video from: ${videoUrl}`);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.status} ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const inputVideoPath = path.join(tempDir, "input.mp4");
    await fs.writeFile(inputVideoPath, Buffer.from(videoBuffer));
    console.log(`[Watermark] Video downloaded, size: ${videoBuffer.byteLength} bytes`);

    // Download logo (if available)
    const logoPath = path.join(process.cwd(), "public", "logo.jpeg");
    let hasLogo = false;
    try {
      await fs.access(logoPath);
      hasLogo = true;
      console.log(`[Watermark] Logo found at: ${logoPath}`);
    } catch {
      console.log(`[Watermark] Logo not found, will use text only`);
      // Logo not found, will use text only
    }

    const outputFilename = `watermarked_${videoId}_${Date.now()}.mp4`;
    const outputPath = path.join(publicVideosDir, outputFilename);

    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(inputVideoPath);

      // Build filter complex based on watermark type
      let filterComplex = "";

      if (watermarkType === "corner") {
        // Small corner watermark (Pro plan - download)
        if (hasLogo) {
          command = command.input(logoPath);
          // Scale logo to small size and overlay in corner
          filterComplex = `[1:v]scale=120:-1[logo];[0:v][logo]overlay=W-w-20:20[out]`;
          console.log(`[Watermark] Using logo overlay in corner`);
        } else {
          // Text watermark if no logo
          filterComplex = `[0:v]drawtext=text='MarketUp':fontcolor=white@0.7:fontsize=24:x=W-tw-20:y=20[out]`;
          console.log(`[Watermark] Using text watermark in corner`);
        }
      } else if (watermarkType === "animated") {
        // Animated watermark that fades in/out (Premium plan - download)
        if (hasLogo) {
          command = command.input(logoPath);
          // Scale logo and show/hide at intervals
          filterComplex = `[1:v]scale=120:-1[logo];[0:v][logo]overlay=W-w-20:20:enable='between(t,0,2)+between(t,6,8)+between(t,12,14)'[out]`;
          console.log(`[Watermark] Using animated logo overlay`);
        } else {
          // Text with fade effect - simpler approach: show/hide
          filterComplex = `[0:v]drawtext=text='MarketUp':fontcolor=white@0.7:fontsize=24:x=W-tw-20:y=20:enable='between(t,0,2)+between(t,6,8)+between(t,12,14)'[out]`;
          console.log(`[Watermark] Using animated text watermark`);
        }
      } else if (watermarkType === "full") {
        // Full watermark with logo and name appearing/disappearing (Free plan)
        if (hasLogo) {
          command = command.input(logoPath);
          // Scale logo to medium size and position in center
          // Logo and text appear at different times
          filterComplex = `[1:v]scale=200:-1[logo];[0:v][logo]overlay=(W-w)/2:(H-h)/2-40:enable='between(t,0,3)+between(t,8,11)+between(t,16,19)'[v1];[v1]drawtext=text='MarketUp':fontcolor=white@0.9:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2+60:enable='between(t,0,3)+between(t,8,11)+between(t,16,19)'[out]`;
          console.log(`[Watermark] Using full logo + text watermark`);
        } else {
          // Text only - appearing at different positions
          filterComplex = `[0:v]drawtext=text='MarketUp':fontcolor=white@0.9:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,0,3)+between(t,8,11)+between(t,16,19)'[out]`;
          console.log(`[Watermark] Using full text watermark`);
        }
      } else {
        // No watermark - just pass through
        filterComplex = `[0:v]copy[out]`;
        console.log(`[Watermark] No watermark needed`);
      }
      
      console.log(`[Watermark] FFmpeg filter: ${filterComplex}`);

      // Use video filter if complex filter is not needed, otherwise use complexFilter
      if (filterComplex.includes("[out]")) {
        command
          .complexFilter(filterComplex)
          .outputOptions(["-map", "[out]", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p"])
          .output(outputPath)
          .on("start", (commandLine) => {
            console.log(`[Watermark] FFmpeg command: ${commandLine}`);
          })
          .on("end", () => {
            console.log(`[Watermark] Watermark added successfully to ${outputPath}`);
            resolve();
          })
          .on("error", (err) => {
            console.error(`[Watermark] FFmpeg error:`, err);
            reject(err);
          })
          .on("progress", (progress) => {
            console.log(`[Watermark] FFmpeg progress: ${JSON.stringify(progress)}`);
          })
          .run();
      } else {
        command
          .complexFilter(filterComplex)
          .outputOptions(["-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p"])
          .output(outputPath)
          .on("start", (commandLine) => {
            console.log(`[Watermark] FFmpeg command: ${commandLine}`);
          })
          .on("end", () => {
            console.log(`[Watermark] Watermark added successfully to ${outputPath}`);
            resolve();
          })
          .on("error", (err) => {
            console.error(`[Watermark] FFmpeg error:`, err);
            reject(err);
          })
          .on("progress", (progress) => {
            console.log(`[Watermark] FFmpeg progress: ${JSON.stringify(progress)}`);
          })
          .run();
      }
    });

    // Return public URL - ensure it's accessible
    const publicUrl = `/videos/${outputFilename}`;
    console.log(`[Watermark] Watermarked video saved to: ${outputPath}`);
    console.log(`[Watermark] Public URL: ${publicUrl}`);
    
    // Verify file exists
    try {
      const stats = await fs.stat(outputPath);
      console.log(`[Watermark] File verified, size: ${stats.size} bytes`);
    } catch (error) {
      console.error(`[Watermark] File verification failed:`, error);
      throw new Error("Watermarked video file not found after processing");
    }
    
    return publicUrl;
  } catch (error) {
    console.error("Error adding watermark:", error);
    throw error;
  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error("Error cleaning up temp directory:", error);
    }
  }
}

