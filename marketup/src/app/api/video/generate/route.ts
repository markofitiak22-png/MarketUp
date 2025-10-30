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
    
    const backgrounds = settings.backgrounds || (settings.background ? [{ image: settings.background }] : []);
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

    // Step 1: Preparing assets (10%)
    console.log(`📦 [${videoId}] Step 1: Preparing assets...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 10,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Generating voice with AI (30%)
    console.log(`🎙️ [${videoId}] Step 2: Synthesizing voice with AI (${voiceName})...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 30,
      createdAt: new Date()
    });
    
    // Try to generate voice audio (this will use real APIs if configured)
    const audioUrl = await videoGenerator.generateVoiceAudio(text, voiceId);
    
    // Step 3: Generating avatar animation (50%)
    console.log(`👤 [${videoId}] Step 3: Generating avatar animation...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 50,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Processing backgrounds (70%)
    console.log(`🖼️ [${videoId}] Step 4: Processing ${backgrounds.length} background(s)...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 70,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 5: Compositing video with AI (85%)
    console.log(`🎨 [${videoId}] Step 5: Compositing video layers...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 85,
      createdAt: new Date()
    });
    
    // Use real video generator
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
      backgrounds: backgrounds,
      text: text,
      quality: quality,
    });

    // Step 6: Finalizing output (95%)
    console.log(`✨ [${videoId}] Step 6: Finalizing output (${quality.toUpperCase()})...`);
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 95,
      createdAt: new Date()
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if video generation was successful
    if (!videoResult.success || !videoResult.videoUrl) {
      throw new Error(videoResult.error || 'Video generation failed');
    }

    const videoUrl = videoResult.videoUrl;

    // Complete!
    console.log(`✅ [${videoId}] Video generation completed successfully!`);
    console.log(`📹 Video URL: ${videoUrl}`);
    console.log(`📊 Stats: Avatar: ${avatarName}, Language: ${languageName}, Duration: ${duration}s, Quality: ${quality}`);
    console.log(`🤖 AI APIs used: ${audioUrl ? 'Voice AI ✓' : 'Voice AI ✗'} | Video AI: ${videoResult.jobId ? '✓' : 'Fallback'}`);
    
    generationStatus.set(videoId, {
      status: 'completed',
      progress: 100,
      videoUrl,
      createdAt: new Date()
    });

    // Update database
    await prisma.video.update({
      where: { id: videoId },
      data: { 
        status: 'COMPLETED',
        videoUrl,
        completedAt: new Date()
      }
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