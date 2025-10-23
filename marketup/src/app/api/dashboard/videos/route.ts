import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
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
      userId: session.user.id
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { script: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get videos with pagination
    const [videos, total] = await Promise.all([
      prisma.videoJob.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          duration: true,
          thumbnailUrl: true,
          views: true,
          downloads: true,
          videoUrl: true,
          quality: true,
          format: true,
          fileSize: true,
          resolution: true
        }
      }),
      prisma.videoJob.count({ where })
    ]);

    // Format videos for frontend
    const formattedVideos = videos.map(video => ({
      id: video.id,
      title: video.title || `Video ${video.id.slice(-8)}`,
      status: video.status === 'COMPLETED' ? 'Completed' : 
              video.status === 'PROCESSING' ? 'Processing' : 
              video.status === 'QUEUED' ? 'Queued' : 'Failed',
      createdAt: video.createdAt.toISOString().split('T')[0],
      duration: video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00',
      thumbnail: video.thumbnailUrl ? '🎥' : '📹',
      views: video.views,
      downloads: video.downloads,
      videoUrl: video.videoUrl,
      metadata: {
        quality: video.quality,
        format: video.format,
        fileSize: video.fileSize,
        resolution: video.resolution
      }
    }));

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