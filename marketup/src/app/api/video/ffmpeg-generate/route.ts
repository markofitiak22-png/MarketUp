import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

// Set FFmpeg path
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
  console.log('✅ FFmpeg configured at:', ffmpegPath);
} else {
  throw new Error('FFmpeg binary not found');
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is called internally by the video generation service
    // Authentication is already verified by the calling endpoint
    
    const body = await request.json();
    const { avatar, voice, backgrounds, text, quality } = body;

    console.log('🎥 FFmpeg: Starting REAL video generation...');
    console.log('📋 USER SELECTED DATA:');
    console.log('   👤 Avatar:', avatar?.name, avatar?.gender);
    console.log('   🗣️ Voice:', voice?.name, voice?.language);
    console.log('   🌄 Background:', backgrounds?.[0]?.name || 'None');
    console.log('   📝 Script:', text?.substring(0, 100) + '...');
    console.log('   ⚙️ Quality:', quality);
    console.log('✅ FFmpeg is ready at:', ffmpegPath);

    // Create directories
    const tempDir = path.join(process.cwd(), 'temp', `video_${Date.now()}`);
    const publicVideosDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(publicVideosDir, { recursive: true });

    try {
      console.log('📁 Created temp directory:', tempDir);

      // Calculate duration based on text length (~ 150 words per minute = 2.5 words per second)
      const wordCount = text.split(' ').length;
      const duration = Math.max(5, Math.ceil(wordCount / 2.5));
      console.log(`⏱️ Estimated duration: ${duration}s (${wordCount} words)`);

      // Step 1: Download avatar image
      console.log(`🖼️ Downloading avatar image: ${avatar?.name}...`);
      console.log(`   Image URL: ${avatar?.image}`);
      const avatarPath = path.join(tempDir, 'avatar.png');
      
      if (avatar?.image) {
        try {
          const avatarResponse = await fetch(avatar.image);
          const avatarBuffer = await avatarResponse.arrayBuffer();
          await fs.writeFile(avatarPath, Buffer.from(avatarBuffer));
          console.log(`✅ Avatar image saved: ${avatar.name} (${avatarBuffer.byteLength} bytes)`);
        } catch (error) {
          console.log('⚠️ Avatar download failed, skipping avatar overlay');
        }
      }

      // Step 2: Download background image
      console.log(`🌄 Downloading background image: ${backgrounds?.[0]?.name}...`);
      console.log(`   Image URL: ${backgrounds?.[0]?.image}`);
      const bgPath = path.join(tempDir, 'background.jpg');
      
      if (backgrounds && backgrounds[0]?.image) {
        try {
          const bgResponse = await fetch(backgrounds[0].image);
          const bgBuffer = await bgResponse.arrayBuffer();
          await fs.writeFile(bgPath, Buffer.from(bgBuffer));
          console.log(`✅ Background image saved: ${backgrounds[0].name} (${bgBuffer.byteLength} bytes)`);
        } catch (error) {
          console.log('⚠️ Background download failed, will use color');
        }
      }

      // Step 3: Generate video with FFmpeg
      console.log('🎬 Generating video with fluent-ffmpeg...');
      const outputFilename = `generated_${Date.now()}.mp4`;
      const outputPath = path.join(publicVideosDir, outputFilename);

      // Check if we have files
      const hasBg = await fs.access(bgPath).then(() => true).catch(() => false);
      const hasAvatar = await fs.access(avatarPath).then(() => true).catch(() => false);
      
      console.log(`📋 Assets: Background=${hasBg}, Avatar=${hasAvatar}`);

      await new Promise<void>((resolve, reject) => {
        let command = ffmpeg();

        if (hasBg) {
          // Use background image
          command = command.input(bgPath).loop(duration);
        } else {
          // Use gradient background
          command = command.input('color=c=#4338ca:s=1920x1080:d=' + duration).inputFormat('lavfi');
        }

        // Add avatar overlay if available
        if (hasAvatar) {
          command = command.input(avatarPath).loop(duration);
        }

        // Build filter complex
        let filterStr = '[0:v]scale=1920:1080,setsar=1';
        
        if (hasAvatar) {
          filterStr += '[bg];[1:v]scale=400:400[avatar];[bg][avatar]overlay=50:50';
        }
        
        // Clean text for FFmpeg (remove special characters that can break the filter)
        const cleanText = text.replace(/['\\":\[\]]/g, '').substring(0, 200); // Limit length
        const avatarInfo = `Avatar: ${avatar?.name || 'Unknown'} | Voice: ${voice?.name || 'Unknown'}`;
        
        // Add text overlay with avatar info at top and script at bottom
        filterStr += `[v];[v]drawtext=text='${avatarInfo}':fontcolor=white:fontsize=32:box=1:boxcolor=blue@0.8:boxborderw=10:x=50:y=50`;
        filterStr += `,drawtext=text='${cleanText}':fontcolor=white:fontsize=36:box=1:boxcolor=black@0.8:boxborderw=15:x=(w-text_w)/2:y=h-200[out]`;
        
        console.log('📝 Text overlay:', cleanText.substring(0, 50) + '...');

        command
          .complexFilter(filterStr)
          .outputOptions([
            '-map', '[out]',
            '-c:v', 'libx264',
            '-preset', quality === '4k' ? 'slow' : 'fast',
            '-crf', quality === '4k' ? '18' : '23',
            '-pix_fmt', 'yuv420p',
            '-t', String(duration),
            '-movflags', '+faststart'
          ])
          .output(outputPath)
          .on('start', (cmd) => {
            console.log('⚙️ FFmpeg command:', cmd);
          })
          .on('progress', (progress) => {
            console.log(`📊 Progress: ${Math.round(progress.percent || 0)}%`);
          })
          .on('end', () => {
            console.log('✅ Video generated successfully!');
            resolve();
          })
          .on('error', (err) => {
            console.error('❌ FFmpeg error:', err);
            reject(err);
          })
          .run();
      });

      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
      console.log('🧹 Cleaned up temp files');

      // Return video URL
      const videoUrl = `/videos/${outputFilename}`;
      console.log('═══════════════════════════════════════════════════════');
      console.log('🎉 REAL VIDEO GENERATED WITH YOUR DATA!');
      console.log('═══════════════════════════════════════════════════════');
      console.log('   👤 Avatar:', avatar?.name, avatar?.gender);
      console.log('   🗣️ Voice:', voice?.name, voice?.language);
      console.log('   🌄 Background:', backgrounds?.[0]?.name);
      console.log('   📝 Script length:', text?.length, 'characters');
      console.log('   ⏱️ Duration:', duration, 'seconds');
      console.log('   ⚙️ Quality:', quality);
      console.log('   📹 Video URL:', videoUrl);
      console.log('═══════════════════════════════════════════════════════');

      return NextResponse.json({
        success: true,
        videoUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${videoUrl}`,
        duration,
        message: `✅ REAL video generated with YOUR data: ${avatar?.name} + ${backgrounds?.[0]?.name} + your script!`
      });

    } catch (error) {
      // Clean up on error
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }

  } catch (error) {
    console.error('❌ FFmpeg generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Video generation failed'
    }, { status: 500 });
  }
}

