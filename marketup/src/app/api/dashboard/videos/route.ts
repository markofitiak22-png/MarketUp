import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      userId: (session as any).user.id
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    // Get videos with pagination from Video table
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          videoUrl: true,
          completedAt: true,
          settings: true
        }
      }),
      prisma.video.count({ where })
    ]);

    // Format videos for frontend
    const formattedVideos = videos.map(video => {
      const settings = video.settings as any || {};
      const duration = settings.duration || 30;
      
      return {
        id: video.id,
        title: video.title || `Video ${video.id.slice(-8)}`,
        status: video.status === 'COMPLETED' ? 'Completed' : 
                video.status === 'PROCESSING' ? 'Processing' : 
                video.status === 'PENDING' ? 'Queued' : 'Failed',
        createdAt: video.createdAt.toISOString().split('T')[0],
        duration: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
        thumbnail: '🎥',
        views: 0,
        downloads: 0,
        videoUrl: video.videoUrl,
        metadata: {
          quality: settings.quality || 'HD',
          format: settings.format || 'MP4',
          fileSize: null,
          resolution: null
        }
      };
    });

    return NextResponse.json({
      success: true,
      videos: formattedVideos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Get videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}