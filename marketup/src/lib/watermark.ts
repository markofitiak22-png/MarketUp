import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

// Set FFmpeg path - use system FFmpeg (more reliable)
// System FFmpeg path for macOS
const systemFfmpegPath = '/opt/homebrew/bin/ffmpeg';

// Try to use system FFmpeg first (more reliable)
try {
  if (fsSync.existsSync(systemFfmpegPath)) {
    ffmpeg.setFfmpegPath(systemFfmpegPath);
    console.log(`[Watermark] ✅ Using system FFmpeg: ${systemFfmpegPath}`);
  } else if (ffmpegPath && fsSync.existsSync(ffmpegPath)) {
    // Fallback to static if system doesn't exist
    ffmpeg.setFfmpegPath(ffmpegPath);
    console.log(`[Watermark] ✅ Using ffmpeg-static: ${ffmpegPath}`);
  } else {
    // Last resort: try 'ffmpeg' from PATH
    ffmpeg.setFfmpegPath('ffmpeg');
    console.log(`[Watermark] ✅ Using FFmpeg from PATH`);
  }
} catch {
  // Fallback to 'ffmpeg' command
  ffmpeg.setFfmpegPath('ffmpeg');
  console.log(`[Watermark] ✅ Using FFmpeg from PATH (fallback)`);
}

/**
 * Add watermark to video using FFmpeg
 */
export async function addWatermarkToVideo(
  videoUrl: string,
  watermarkType: "corner" | "animated" | "full",
  videoId: string
): Promise<string> {
  console.log(`[Watermark] ==========================================`);
  console.log(`[Watermark] 🎬 addWatermarkToVideo CALLED`);
  console.log(`[Watermark] Type: ${watermarkType}`);
  console.log(`[Watermark] Video URL: ${videoUrl}`);
  console.log(`[Watermark] Video ID: ${videoId}`);
  console.log(`[Watermark] ==========================================`);
  const tempDir = path.join(process.cwd(), "temp", `watermark_${Date.now()}`);
  const publicVideosDir = path.join(process.cwd(), "public", "videos");
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(publicVideosDir, { recursive: true });
  console.log(`[Watermark] Created directories: temp=${tempDir}, public=${publicVideosDir}`);

  try {
    console.log(`[Watermark] Starting watermark process for type: ${watermarkType}`);
    console.log(`[Watermark] Video URL: ${videoUrl}`);
    
    // Download original video
    console.log(`[Watermark] Downloading video from: ${videoUrl}`);
    let videoResponse: Response;
    try {
      videoResponse = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
    } catch (fetchError: unknown) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      console.error(`[Watermark] Fetch error:`, fetchError);
      throw new Error(`Failed to fetch video: ${errorMessage}`);
    }
    
    if (!videoResponse.ok) {
      const errorText = await videoResponse.text().catch(() => 'Unknown error');
      console.error(`[Watermark] Video download failed: ${videoResponse.status} ${videoResponse.statusText}`, errorText);
      throw new Error(`Failed to download video: ${videoResponse.status} ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    if (videoBuffer.byteLength === 0) {
      throw new Error('Downloaded video is empty');
    }
    
    const inputVideoPath = path.join(tempDir, "input.mp4");
    await fs.writeFile(inputVideoPath, Buffer.from(videoBuffer));
    console.log(`[Watermark] Video downloaded, size: ${videoBuffer.byteLength} bytes`);
    
    // Verify file was written
    const stats = await fs.stat(inputVideoPath);
    console.log(`[Watermark] Input video file size: ${stats.size} bytes`);

    const outputFilename = `watermarked_${videoId}_${Date.now()}.mp4`;
    const outputPath = path.join(publicVideosDir, outputFilename);

    await new Promise<void>((resolve, reject) => {
      const command = ffmpeg(inputVideoPath);

      // SIMPLEST POSSIBLE WATERMARK - BLACK text with white background for visibility
      // Use videoFilters (simpler than complexFilter)
      let videoFilter = "";
      
      if (watermarkType === "corner" || watermarkType === "animated") {
        // Black text with white box background in corner
        videoFilter = `drawtext=text='MarketUp':fontcolor=black:fontsize=30:box=1:boxcolor=white@0.8:boxborderw=5:x=w-tw-10:y=10`;
        console.log(`[Watermark] Using BLACK text watermark in corner with white background`);
      } else if (watermarkType === "full") {
        // Black text with white box background in center
        videoFilter = `drawtext=text='MarketUp':fontcolor=black:fontsize=60:box=1:boxcolor=white@0.8:boxborderw=10:x=(w-text_w)/2:y=(h-text_h)/2`;
        console.log(`[Watermark] Using BLACK text watermark in center with white background`);
      }
      
      console.log(`[Watermark] FFmpeg video filter: ${videoFilter}`);

      // Use videoFilters for simple operations
      if (videoFilter) {
        command
          .videoFilters(videoFilter)
          .outputOptions(["-c:v", "libx264", "-preset", "fast", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "copy"])
          .output(outputPath)
          .on("start", (commandLine) => {
            console.log(`[Watermark] FFmpeg command: ${commandLine}`);
          })
          .on("end", () => {
            console.log(`[Watermark] ✅ Watermark added successfully to ${outputPath}`);
            resolve();
          })
          .on("error", (err, stdout, stderr) => {
            console.error(`[Watermark] ❌ FFmpeg error:`, err);
            console.error(`[Watermark] FFmpeg stdout:`, stdout);
            console.error(`[Watermark] FFmpeg stderr:`, stderr);
            reject(new Error(`FFmpeg error: ${err.message || 'Unknown error'}. Stderr: ${stderr}`));
          })
          .on("progress", (progress) => {
            if (progress.percent) {
              console.log(`[Watermark] FFmpeg progress: ${Math.round(progress.percent)}%`);
            }
          })
          .run();
      } else {
        // No watermark - just copy
        console.log(`[Watermark] No watermark needed, copying file`);
        fs.copyFile(inputVideoPath, outputPath)
          .then(() => {
            console.log(`[Watermark] File copied successfully`);
            resolve();
          })
          .catch((err) => {
            console.error(`[Watermark] Error copying file:`, err);
            reject(err);
          });
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
      console.log(`[Watermark] Cleaned up temp directory: ${tempDir}`);
    } catch (cleanupError) {
      console.warn(`[Watermark] Failed to cleanup temp directory:`, cleanupError);
    }
  }
}

