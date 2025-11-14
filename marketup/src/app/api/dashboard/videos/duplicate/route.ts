import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { 
  getActiveSubscriptionForUser, 
  getMonthlyVideoLimit, 
  getVideosThisMonth,
  getAllowedQuality,
  areSubtitlesAllowed
} from "@/lib/subscriptions";
import videoGenerator from "@/lib/video-generator";

// In-memory storage for video generation status (same as in generate route)
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
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ 
        error: "Video ID is required" 
      }, { status: 400 });
    }

    // Get the original video
    const originalVideo = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: userId
      }
    });

    if (!originalVideo) {
      return NextResponse.json({ 
        error: "Video not found" 
      }, { status: 404 });
    }

    // Check subscription limits
    const subscription = await getActiveSubscriptionForUser(userId);
    const tier = subscription?.tier || null;
    
    // Check monthly video quota
    const videosThisMonth = await getVideosThisMonth(userId);
    const monthlyLimit = getMonthlyVideoLimit(tier);
    
    if (videosThisMonth >= monthlyLimit) {
      const planName = !tier ? "Free" : tier === "STANDARD" ? "Pro" : tier === "PREMIUM" ? "Premium" : "Free";
      return NextResponse.json({ 
        error: "Monthly video limit reached",
        message: `You have reached your monthly limit of ${monthlyLimit} video${monthlyLimit > 1 ? 's' : ''} for the ${planName} plan. Please upgrade your plan to create more videos.`,
        limit: monthlyLimit,
        used: videosThisMonth,
        plan: planName
      }, { status: 403 });
    }

    // Extract settings from original video
    const settings = originalVideo.settings as any || {};
    const avatar = settings.avatar;
    const language = settings.language;
    const backgrounds = settings.backgrounds || (settings.background ? [{ image: settings.background }] : null);
    const text = settings.text;
    const quality = settings.quality || 'hd';
    const format = settings.format || 'mp4';
    const duration = settings.duration || 30;
    const subtitles = settings.subtitles || false;

    // Validate required fields
    if (!avatar || !language || !backgrounds || !text) {
      return NextResponse.json({ 
        error: "Original video is missing required settings",
        details: "Cannot duplicate video with incomplete settings"
      }, { status: 400 });
    }

    // Check quality limits and adjust if needed
    const allowedQuality = getAllowedQuality(tier);
    const qualityLevels: Record<string, number> = {
      'standard': 1,
      'hd': 2,
      '4k': 3
    };
    
    let finalQuality = quality;
    if (qualityLevels[quality] > qualityLevels[allowedQuality]) {
      finalQuality = allowedQuality;
    }

    // Check subtitles permission
    const subtitlesAllowed = areSubtitlesAllowed(tier);
    const finalSubtitles = subtitlesAllowed && subtitles;

    if (subtitles && !subtitlesAllowed) {
      // Just disable subtitles, don't block duplication
      console.log("Subtitles disabled for duplicate video (not available in current plan)");
    }

    // Generate unique video ID
    const newVideoId = nanoid(12);
    
    // Initialize generation status
    generationStatus.set(newVideoId, {
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    });

    // Create new video record with duplicated settings
    const newVideo = await prisma.video.create({
      data: {
        id: newVideoId,
        userId: userId,
        title: `${originalVideo.title} (Copy)`,
        status: 'PENDING',
        settings: {
          avatar: typeof avatar === 'object' ? avatar : { name: avatar },
          language: typeof language === 'object' ? language : { name: language },
          backgrounds: backgrounds,
          background: backgrounds[0]?.image || '', // Keep old field for compatibility
          text,
          quality: finalQuality,
          format: format,
          duration: duration,
          subtitles: finalSubtitles
        }
      }
    });

    // Start video generation process
    processVideoGeneration(newVideoId, userId);

    return NextResponse.json({ 
      success: true, 
      videoId: newVideoId,
      message: "Video duplication started"
    });

  } catch (error) {
    console.error('Error duplicating video:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Failed to duplicate video"
    }, { status: 500 });
  }
}

// Real video generation process using AI APIs (same as in generate route)
async function processVideoGeneration(videoId: string, userId: string) {
  try {
    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video) {
      console.error(`Video ${videoId} not found`);
      return;
    }

    const settings = video.settings as any;
    
    // Update status to processing
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' }
    });

    generationStatus.set(videoId, {
      status: 'processing',
      progress: 10,
      createdAt: new Date()
    });

    // Extract data from settings (same as in generate route)
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
    
    const text = settings.text || '';
    const quality = settings.quality || 'hd';
    const duration = settings.duration || 30;
    const subtitles = settings.subtitles || false;

    console.log(`🎬 Starting duplicate video generation for ${videoId}`, {
      avatar: avatarName,
      language: languageName,
      backgrounds: backgroundsWithCategory.length,
      textLength: text.length,
      quality,
      duration
    });

    // Extract language code for translation (same as in generate route)
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

    // Use the same video generator as the main generate route
    const result = await videoGenerator.generateVideo({
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
      targetLanguage: languageCode,
      onProgress: (progress: number) => {
        // Update progress in real-time during HeyGen generation
        const currentProgress = Math.max(20, Math.min(85, progress));
        generationStatus.set(videoId, {
          status: 'processing',
          progress: currentProgress,
          createdAt: new Date()
        });
        console.log(`📊 Progress update: ${currentProgress}%`);
      }
    });

    if (result.success && result.videoUrl) {
      // Update database
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'COMPLETED',
          videoUrl: result.videoUrl,
          completedAt: new Date()
        }
      });

      generationStatus.set(videoId, {
        status: 'completed',
        progress: 100,
        videoUrl: result.videoUrl,
        createdAt: new Date()
      });
    } else {
      throw new Error(result.error || 'Video generation failed');
    }

  } catch (error) {
    console.error(`Error generating duplicate video ${videoId}:`, error);
    
    // Update status to failed
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'FAILED' }
    });

    generationStatus.set(videoId, {
      status: 'failed',
      progress: 0,
      error: error instanceof Error ? error.message : 'Video generation failed',
      createdAt: new Date()
    });
  }
}

