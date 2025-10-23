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
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Status filter - map frontend status to database status
    if (status !== 'all') {
      switch (status) {
        case 'pending':
          where.status = 'QUEUED';
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

    // Get videos with related data
    const [videos, totalCount] = await Promise.all([
      prisma.videoJob.findMany({
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
      prisma.videoJob.count({ where })
    ]);

    // Transform videos data to match frontend interface
    const transformedVideos = videos.map(video => {
      // Map database status to frontend status
      let frontendStatus: 'pending' | 'approved' | 'rejected';
      switch (video.status) {
        case 'QUEUED':
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

      // Generate thumbnail URL (using a placeholder for now)
      const thumbnailUrl = video.thumbnailUrl || `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop&sig=${video.id}`;

      return {
        id: video.id,
        title: video.title || 'Untitled Video',
        description: video.description || 'No description provided',
        thumbnail: thumbnailUrl,
        duration: video.duration ? formatDuration(video.duration) : '0:00',
        uploadDate: video.createdAt.toISOString(),
        uploader: {
          id: video.user?.id || 'unknown',
          name: video.user?.name || 'Unknown User',
          email: video.user?.email || 'No email',
          avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&sig=${video.user?.id || 'default'}`
        },
        status: frontendStatus,
        category: 'Generated Video', // Default category
        tags: ['ai-generated', 'video'], // Default tags
        views: video.views || 0,
        likes: Math.floor((video.views || 0) * 0.1), // Estimate likes as 10% of views
        flags: Math.floor(Math.random() * 3), // Random flags for demo
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
        video.uploader.name.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    console.log('Admin Videos API - Found videos:', filteredVideos.length);

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
    const updatedVideo = await prisma.videoJob.update({
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
