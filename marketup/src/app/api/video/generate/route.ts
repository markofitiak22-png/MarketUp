import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import videoGenerator from "@/lib/video-generator";

// In-memory storage for video generation status (in production, use Redis or database)
const generationStatus = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
  createdAt: Date;
}>();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const body = await request.json();
    
    // Support both old 'background' and new 'backgrounds' format
    const { avatar, language, background, backgrounds, text, title, settings } = body;
    
    // Get background(s) - prefer backgrounds array, fallback to single background
    const bgData = backgrounds && backgrounds.length > 0 ? backgrounds : (background ? [{ image: background }] : null);

    // Validate required fields
    if (!avatar || !language || !bgData || !text) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: {
          avatar: !avatar ? "Avatar is required" : undefined,
          language: !language ? "Language is required" : undefined,
          background: !bgData ? "Background is required" : undefined,
          text: !text ? "Text is required" : undefined,
        }
      }, { status: 400 });
    }

    // Generate unique video ID
    const videoId = nanoid(12);
    
    // Initialize generation status
    generationStatus.set(videoId, {
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    });

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        id: videoId,
        userId: userId,
        title: title || `Video ${new Date().toLocaleDateString()}`,
        status: 'PENDING',
        settings: {
          avatar: typeof avatar === 'object' ? avatar : { name: avatar },
          language: typeof language === 'object' ? language : { name: language },
          backgrounds: bgData,
          background: bgData[0]?.image || '', // Keep old field for compatibility
          text,
          quality: settings?.quality || 'hd',
          format: settings?.format || 'mp4',
          duration: settings?.duration || 0
        }
      }
    });

    // Start video generation process (simulate async processing)
    processVideoGeneration(videoId, userId);

    return NextResponse.json({ 
      success: true, 
      videoId,
      message: "Video generation started"
    });

  } catch (error) {
    console.error('Error starting video generation:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // First check in-memory status
    const memoryStatus = generationStatus.get(videoId);
    if (memoryStatus) {
      return NextResponse.json({
        success: true,
        videoId,
        status: memoryStatus.status,
        progress: memoryStatus.progress,
        videoUrl: memoryStatus.videoUrl,
        error: memoryStatus.error
      });
    }

    // If not in memory, check database (video might be completed)
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Map database status to API response
    const statusMap: { [key: string]: 'pending' | 'processing' | 'completed' | 'failed' } = {
      'PENDING': 'pending',
      'PROCESSING': 'processing',
      'COMPLETED': 'completed',
      'FAILED': 'failed'
    };

    return NextResponse.json({
      success: true,
      videoId,
      status: statusMap[video.status] || 'pending',
      progress: video.status === 'COMPLETED' ? 100 : (video.status === 'PROCESSING' ? 50 : 0),
      videoUrl: video.videoUrl || undefined,
      error: video.status === 'FAILED' ? 'Video generation failed' : undefined
    });

  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// Real video generation process using AI APIs
async function processVideoGeneration(videoId: string, userId: string) {
  try {
    // Get video data from database
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      throw new Error('Video not found');
    }

    const settings = video.settings as any;
    
    // Extract data from settings
    const avatarData = settings.avatar || {};
    const avatarName = typeof avatarData === 'string' ? avatarData : (avatarData.name || '');
    const avatarImage = avatarData.image || '';
    const avatarGender = avatarData.gender || 'neutral';
    
    const languageData = settings.language || {};
    const languageName = typeof languageData === 'string' ? languageData : (languageData.name || '');
    const voiceData = languageData.voice || {};
    const voiceId = voiceData.id || 'default';
    const voiceName = voiceData.name || 'default';
    
    const backgrounds = settings.backgrounds || (settings.background ? [{ image: settings.background, name: '', category: 'Professional' }] : []);
    
    // Ensure all backgrounds have category field
    const backgroundsWithCategory = backgrounds.map((bg: any) => ({
      image: bg.image || '',
      name: bg.name || '',
      category: bg.category || 'Professional'
    }));
    
    console.log('📋 Backgrounds extracted from settings:', {
      count: backgroundsWithCategory.length,
      backgrounds: backgroundsWithCategory.map((bg: any) => ({
        name: bg.name,
        category: bg.category,
        hasImage: !!bg.image
      }))
    });
    const text = settings.text || '';
    const quality = settings.quality || 'hd';
    const duration = settings.duration || 30;

    console.log(`🎬 Starting REAL video generation for ${videoId}`, {
      avatar: avatarName,
      language: languageName,
      voice: voiceName,
      backgrounds: backgrounds.length,
      textLength: text.length,
      duration: duration
    });

    // Update database status
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' }
    });

    // Step 1: Preparing assets (3%)
    console.log(`📦 [${videoId}] Step 1: Preparing assets...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 3,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 2: Preparing request to HeyGen (5%)
    console.log(`🎬 [${videoId}] Step 2: Preparing request to HeyGen...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 5,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Extract language code for translation
    const languageCode = typeof languageData === 'object' && languageData.code 
      ? languageData.code 
      : languageName.toLowerCase().startsWith('english') ? 'en'
      : languageName.toLowerCase().startsWith('arabic') ? 'ar'
      : languageName.toLowerCase().startsWith('french') ? 'fr'
      : languageName.toLowerCase().startsWith('german') ? 'de'
      : languageName.toLowerCase().startsWith('turkish') ? 'tr'
      : languageName.toLowerCase().startsWith('swedish') ? 'sv'
      : 'en';

    console.log(`🌐 Target language code: ${languageCode} (from: ${languageName})`);

    // Use real video generator with target language for translation
    // Pass progress callback to update status during HeyGen polling
    const videoResult = await videoGenerator.generateVideo({
      avatar: {
        name: avatarName,
        image: avatarImage,
        gender: avatarGender,
      },
      voice: {
        id: voiceId,
        name: voiceName,
        language: languageName,
      },
      backgrounds: backgroundsWithCategory,
      text: text,
      quality: quality,
      // Pass language code for reference (not for translation)
      // HeyGen will use voice_id to determine the output language based on selected language
      targetLanguage: languageCode, // Keep for logging/reference, but won't trigger translation
      onProgress: (progress: number) => {
        // Update progress in real-time during HeyGen generation
        // Ensure progress is always increasing and reasonable
        // Allow progress to reach 75% during generation, then finalization takes over
        // Don't clamp too strictly - allow up to 85% if needed before finalization
        const currentProgress = Math.max(20, Math.min(85, progress)); // Clamp between 20-85%
        generationStatus.set(videoId, {
          status: 'processing',
          progress: currentProgress,
          createdAt: new Date()
        });
        console.log(`📊 Progress update: ${currentProgress}%`);
      }
    });

    // Step 6: Processing completed, finalizing output (75-100%)
    console.log(`✨ [${videoId}] Step 6: Finalizing output (${quality.toUpperCase()})...`);
    
    // Check if video generation was successful
    if (!videoResult.success || !videoResult.videoUrl) {
      throw new Error(videoResult.error || 'Video generation failed');
    }

    const videoUrl = videoResult.videoUrl;

    // Get current progress and ensure we start from at least 75%
    const currentStatus = generationStatus.get(videoId);
    const startProgress = Math.max(75, currentStatus?.progress || 75);
    
    // Gradual progress update during finalization - smooth progression from current progress to 98%
    // More steps and longer delays for better visual progress
    console.log(`📈 Starting finalization from ${startProgress}% to 100%`);
    
    // Step 1: Video received from HeyGen (start from current or 77%)
    const step1Progress = Math.max(startProgress + 1, 77);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step1Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step1Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 2: Processing video data (ensure we're progressing)
    const step2Progress = Math.max(step1Progress + 1, 79);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step2Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step2Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 3: Validating video format (ensure we're progressing)
    const step3Progress = Math.max(step2Progress + 1, 81);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step3Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step3Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 4: Preparing metadata (ensure we're progressing)
    const step4Progress = Math.max(step3Progress + 1, 83);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step4Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step4Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 5: Optimizing video (ensure we're progressing past 85%)
    const step5Progress = Math.max(step4Progress + 1, 86);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step5Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step5Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 250));

    // Step 6: Final validation (ensure we're progressing)
    const step6Progress = Math.max(step5Progress + 1, 88);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step6Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step6Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 250));

    // Step 7: Preparing for database save (ensure we're progressing)
    const step7Progress = Math.max(step6Progress + 1, 90);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step7Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step7Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 250));

    // Step 8: Saving to database (ensure we're progressing)
    const step8Progress = Math.max(step7Progress + 1, 92);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step8Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step8Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 250));

    // Update database
    await prisma.video.update({
      where: { id: videoId },
      data: { 
        status: 'COMPLETED',
        videoUrl,
        completedAt: new Date()
      }
    });

    // Step 9: Database updated (ensure we're progressing)
    const step9Progress = Math.max(step8Progress + 1, 94);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step9Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step9Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 10: Finalizing (ensure we're progressing)
    const step10Progress = Math.max(step9Progress + 1, 96);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step10Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step10Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 11: Almost done (ensure we're progressing to 98%)
    const step11Progress = Math.max(step10Progress + 1, 98);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: step11Progress,
      createdAt: new Date()
    });
    console.log(`📊 Progress: ${step11Progress}%`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Complete! (100%)
    console.log(`✅ [${videoId}] Video generation completed successfully!`);
    console.log(`📹 Video URL: ${videoUrl}`);
    console.log(`📊 Stats: Avatar: ${avatarName}, Language: ${languageName}, Duration: ${duration}s, Quality: ${quality}`);
    console.log(`🤖 Generation method: ${videoResult.jobId ? 'AI APIs (ElevenLabs + Replicate)' : 'FFmpeg'}`);
    
    // Set final status to 100%
    generationStatus.set(videoId, {
      status: 'completed',
      progress: 100,
      videoUrl,
      createdAt: new Date()
    });

    console.log(`🎉 Video ${videoId} is ready for preview!`);
    return;

  } catch (error) {
    console.error(`Video generation failed for ${videoId}:`, error);
    
    // Update status to failed
    generationStatus.set(videoId, {
      status: 'failed',
      progress: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      createdAt: new Date()
    });

    // Update database
    await prisma.video.update({
      where: { id: videoId },
      data: { 
        status: 'FAILED',
        completedAt: new Date()
      }
    });
  }
}