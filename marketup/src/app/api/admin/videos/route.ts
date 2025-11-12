import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = ((session as any).user as any).id;
    console.log('Admin Videos API - User ID:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Status filter - map frontend status to database status
    if (status !== 'all') {
      switch (status) {
        case 'pending':
          where.status = { in: ['PENDING', 'PROCESSING'] };
          break;
        case 'approved':
          where.status = 'COMPLETED';
          break;
        case 'rejected':
          where.status = 'FAILED';
          break;
      }
    }

    // Map frontend sortBy to actual database field names
    const sortByMapping: { [key: string]: string } = {
      'uploadDate': 'createdAt',
      'title': 'title',
      'uploader': 'user',
      'flags': 'views', // Using views as proxy for flags since we don't have flags in schema
      'createdAt': 'createdAt'
    };
    
    const actualSortBy = sortByMapping[sortBy] || 'createdAt';

    // Get videos with related data for current page
    const [videos, totalCount, allVideosForStats] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: sortBy === 'uploader' ? { user: { name: sortOrder as 'asc' | 'desc' } } : {
          [actualSortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.video.count({ where }),
      // Get all videos for statistics (without pagination)
      prisma.video.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    // Transform videos data to match frontend interface
    const transformedVideos = videos.map(video => {
      // Parse settings JSON
      const settings = video.settings as any || {};
      
      // Map database status to frontend status
      let frontendStatus: 'pending' | 'approved' | 'rejected';
      switch (video.status) {
        case 'PENDING':
        case 'PROCESSING':
          frontendStatus = 'pending';
          break;
        case 'COMPLETED':
          frontendStatus = 'approved';
          break;
        case 'FAILED':
          frontendStatus = 'rejected';
          break;
        default:
          frontendStatus = 'pending';
      }

      // Format duration from seconds to MM:SS
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      // Get duration from settings or use default
      const duration = settings.duration || 30;

      // Generate thumbnail URL (using a placeholder for now)
      const thumbnailUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${video.id}&backgroundColor=gradient`;

      return {
        id: video.id,
        title: video.title || 'Untitled Video',
        description: settings.text || 'No description provided',
        thumbnail: thumbnailUrl,
        duration: formatDuration(duration),
        uploadDate: video.createdAt.toISOString(),
        uploader: {
          id: video.user?.id || 'unknown',
          name: video.user?.name || 'Unknown User',
          email: video.user?.email || 'No email',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user?.email || video.user?.id || 'default'}&backgroundColor=c0aede`
        },
        status: frontendStatus,
        category: 'Generated Video', // Default category
        tags: ['ai-generated', 'video'], // Default tags
        views: 0,
        likes: 0,
        flags: 0,
        reason: video.status === 'FAILED' ? 'Processing failed' : undefined
      };
    });

    // Apply client-side filtering for status and search (since we're using calculated fields)
    let filteredVideos = transformedVideos;

    if (status !== 'all') {
      filteredVideos = filteredVideos.filter(video => video.status === status);
    }

    if (search) {
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.uploader.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('Admin Videos API - Found videos:', filteredVideos.length);

    // Calculate statistics for all videos
    const stats = allVideosForStats.reduce((acc, video) => {
      acc.totalVideos++;
      
      // Map database status to frontend status
      if (video.status === 'PENDING' || video.status === 'PROCESSING') {
        acc.pendingVideos++;
      } else if (video.status === 'COMPLETED') {
        acc.approvedVideos++;
      } else if (video.status === 'FAILED') {
        acc.rejectedVideos++;
      }
      
      return acc;
    }, {
      totalVideos: 0,
      pendingVideos: 0,
      approvedVideos: 0,
      rejectedVideos: 0
    });

    return NextResponse.json({
      success: true,
      data: {
        videos: filteredVideos,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        stats: {
          totalVideos: stats.totalVideos,
          pendingVideos: stats.pendingVideos,
          approvedVideos: stats.approvedVideos,
          rejectedVideos: stats.rejectedVideos
        },
        filters: {
          search,
          status,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error("Admin videos API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, action, reason } = body;

    let newStatus: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    
    switch (action) {
      case 'approve':
        newStatus = 'COMPLETED';
        break;
      case 'reject':
        newStatus = 'FAILED';
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update video status
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status: newStatus
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedVideo
    });

  } catch (error) {
    console.error("Update video error:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
