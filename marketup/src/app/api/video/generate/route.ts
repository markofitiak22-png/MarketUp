import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { avatar, language, background, text, title } = body;

    // Validate required fields
    if (!avatar || !language || !background || !text) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: {
            avatar: !avatar ? "Avatar is required" : null,
            language: !language ? "Language is required" : null,
            background: !background ? "Background is required" : null,
            text: !text ? "Text is required" : null
          }
        },
        { status: 400 }
      );
    }

    // Create video job in database
    const videoJob = await prisma.videoJob.create({
      data: {
        userId: (session.user as any).id,
        script: text,
        backgroundImageUrls: [background],
        productImageUrls: [],
        status: "PROCESSING",
        title: title || `Video ${new Date().toLocaleDateString()}`,
        provider: "MOCK",
      }
    });

    // Generate unique video ID
    const videoId = videoJob.id;
    
    // Simulate video generation process
    const generationSteps = [
      { step: 'preparing', progress: 10 },
      { step: 'avatar_animation', progress: 30 },
      { step: 'voice_synthesis', progress: 50 },
      { step: 'background_processing', progress: 70 },
      { step: 'compositing', progress: 90 },
      { step: 'finalizing', progress: 100 }
    ];

    // Return generation ID for tracking
    return NextResponse.json({
      success: true,
      videoId,
      generationId: `gen_${videoId}`,
      estimatedTime: 180, // 3 minutes
      steps: generationSteps
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID required" },
        { status: 400 }
      );
    }

    // Get video job from database
    const videoJob = await prisma.videoJob.findFirst({
      where: {
        id: videoId,
        userId: (session.user as any).id
      }
    });

    if (!videoJob) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Simulate video generation completion after some time
    const timeSinceCreation = Date.now() - videoJob.createdAt.getTime();
    const isComplete = timeSinceCreation > 30000; // Complete after 30 seconds
    
    if (isComplete && videoJob.status === "PROCESSING") {
      // Update video job with completed status and metadata
      const videoUrl = `/videos/${videoId}.mp4`;
      const thumbnailUrl = `/videos/${videoId}_thumb.jpg`;
      
      await prisma.videoJob.update({
        where: { id: videoId },
        data: {
          status: "COMPLETED",
          videoUrl,
          thumbnailUrl,
          duration: 45,
          quality: 'HD',
          format: 'MP4',
          fileSize: 2400000, // 2.4MB
          resolution: '1920x1080'
        }
      });

      // Create a mock video file (in real implementation, this would be the actual generated video)
      const videoDir = join(process.cwd(), 'public', 'videos');
      await mkdir(videoDir, { recursive: true });
      
      // Create a simple mock video file (just a text file for demo)
      const mockVideoContent = `Mock video content for ${videoId}\nGenerated at: ${new Date().toISOString()}\nScript: ${videoJob.script}`;
      await writeFile(join(videoDir, `${videoId}.mp4`), mockVideoContent);
      
      // Create a mock thumbnail
      const mockThumbnailContent = `Mock thumbnail for ${videoId}`;
      await writeFile(join(videoDir, `${videoId}_thumb.jpg`), mockThumbnailContent);

      return NextResponse.json({
        success: true,
        status: 'completed',
        videoUrl,
        thumbnailUrl,
        metadata: {
          duration: 45,
          quality: 'HD',
          format: 'MP4',
          size: '2.4MB',
          resolution: '1920x1080'
        }
      });
    } else {
      const progress = Math.min(95, Math.floor((timeSinceCreation / 30000) * 100));
      return NextResponse.json({
        success: true,
        status: 'processing',
        progress,
        currentStep: progress < 30 ? 'avatar_animation' : progress < 70 ? 'voice_synthesis' : 'compositing',
        estimatedTimeRemaining: Math.max(0, Math.floor((30000 - timeSinceCreation) / 1000))
      });
    }

  } catch (error) {
    console.error("Video status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
