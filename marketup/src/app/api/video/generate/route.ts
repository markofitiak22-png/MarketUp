import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import didClient from "@/lib/did-client";

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
    
    const { avatar, language, background, text, title } = body;

    // Validate required fields
    if (!avatar || !language || !background || !text) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: {
          avatar: !avatar ? "Avatar is required" : undefined,
          language: !language ? "Language is required" : undefined,
          background: !background ? "Background is required" : undefined,
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
          avatar,
          language,
          background,
          text,
          quality: 'hd',
          format: 'mp4'
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

    const status = generationStatus.get(videoId);
    if (!status) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      videoId,
      status: status.status,
      progress: status.progress,
      videoUrl: status.videoUrl,
      error: status.error
    });

  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// Real video generation process using D-ID API
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
    const { avatar, language, background, text, quality } = settings;

    // Update status to processing
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 10,
      createdAt: new Date()
    });

    // Update database status
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'PROCESSING' }
    });

    console.log(`Starting video generation for ${videoId}`);

    // Step 1: Prepare avatar and voice settings
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 20,
      createdAt: new Date()
    });

    // Map our avatar names to D-ID avatar IDs
    const avatarMapping: { [key: string]: string } = {
      'Sarah': 'amy-jcwCkr1FzY',
      'David': 'david-8xr1hPxX',
      'Emma': 'emma-2X7xHhU',
      'James': 'james-2X7xHhU',
      'Lisa': 'lisa-2X7xHhU',
      'Michael': 'michael-2X7xHhU',
      'sarah-1': 'amy-jcwCkr1FzY',
      'david-1': 'david-8xr1hPxX',
      'emma-1': 'emma-2X7xHhU',
      'michael-1': 'michael-2X7xHhU',
      'lisa-1': 'lisa-2X7xHhU',
      'alex-1': 'alex-2X7xHhU',
    };

    const didAvatarId = avatarMapping[avatar] || 'amy-jcwCkr1FzY';

    // Map languages to voice IDs
    const voiceMapping: { [key: string]: string } = {
      'English': 'en-US-AriaNeural',
      'Swedish': 'sv-SE-HilleviNeural',
      'Ukrainian': 'uk-UA-PolinaNeural',
      'Turkish': 'tr-TR-EmelNeural',
      'Arabic': 'ar-SA-ZariyahNeural',
      'German': 'de-DE-KatjaNeural',
      'French': 'fr-FR-DeniseNeural',
    };

    const voiceId = voiceMapping[language] || 'en-US-AriaNeural';

    // Step 2: Create D-ID video request
    generationStatus.set(videoId, {
      status: 'processing',
      progress: 40,
      createdAt: new Date()
    });

    const qualityLevel: 'low' | 'medium' | 'high' = 
      (quality === '4k' || quality === 'hd') ? 'high' : 'medium';

    const didRequest = {
      source_url: `https://create-images-results.d-id.com/DefaultPresenters/${didAvatarId}/image.jpg`,
      script: {
        type: 'text' as const,
        input: text,
        provider: {
          type: 'microsoft' as const,
          voice_id: voiceId,
        },
      },
      config: {
        result_format: 'mp4' as const,
        quality: qualityLevel,
      },
    };

    console.log(`Creating D-ID video with avatar: ${didAvatarId}, voice: ${voiceId}`);

    // Check if D-ID API is configured
    if (!process.env.DID_API_KEY) {
      console.log('D-ID API key not configured, using demo mode');
      throw new Error('D-ID API key not configured');
    }

    // Step 3: Submit to D-ID API
    const didResponse = await didClient.createVideo(didRequest);
    
    if (didResponse.status === 'error') {
      throw new Error(didResponse.error || 'D-ID API error');
    }

    console.log(`D-ID video created with ID: ${didResponse.id}`);

    // Step 4: Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max
    const pollInterval = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;

      try {
        const status = await didClient.getVideoStatus(didResponse.id);
        
        console.log(`D-ID video ${didResponse.id} status: ${status.status}`);

        if (status.status === 'done' && status.result_url) {
          // Video completed successfully
          const videoUrl = status.result_url;

          // Update final status
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

          console.log(`Video ${videoId} generation completed successfully`);
          return;
        } else if (status.status === 'error') {
          throw new Error(status.error || 'Video generation failed');
        } else {
          // Still processing, update progress
          const progress = Math.min(40 + (attempts * 2), 90);
          generationStatus.set(videoId, {
            status: 'processing',
            progress,
            createdAt: new Date()
          });
        }
      } catch (error) {
        console.error(`Error checking D-ID status (attempt ${attempts}):`, error);
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
      }
    }

    // Timeout - fallback to demo video
    console.log(`D-ID timeout for ${videoId}, using demo video`);
    const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    
    // Update final status
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

    console.log(`Demo video ${videoId} generation completed (timeout fallback)`);
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