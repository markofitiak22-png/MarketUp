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
    console.log('Admin Scheduler API - User ID:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const network = searchParams.get('network') || 'all';

    // Build where clause for scheduled posts
    const where: any = {};

    // Status filter
    if (status !== 'all') {
      switch (status) {
        case 'scheduled':
          where.status = 'SCHEDULED';
          break;
        case 'published':
          where.status = 'PUBLISHED';
          break;
        case 'failed':
          where.status = 'FAILED';
          break;
        case 'cancelled':
          where.status = 'CANCELLED';
          break;
      }
    }

    // Network filter
    if (network !== 'all') {
      where.socialNetwork = network;
    }

    // Get approved videos (only completed videos can be scheduled)
    const approvedVideos = await prisma.videoJob.findMany({
      where: {
        status: 'COMPLETED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get scheduled posts
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where,
      include: {
        videoJob: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    });

    // Transform approved videos to match frontend interface
    const transformedVideos = approvedVideos.map(video => {
      // Format duration from seconds to MM:SS
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      // Generate thumbnail URL
      const thumbnailUrl = video.thumbnailUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${video.id}&backgroundColor=gradient`;

      return {
        id: video.id,
        title: video.title || 'Untitled Video',
        thumbnail: thumbnailUrl,
        duration: video.duration ? formatDuration(video.duration) : '0:00',
        status: 'approved' as const,
        category: 'Generated Video',
        tags: ['ai-generated', 'video']
      };
    });

    // Transform scheduled posts to match frontend interface
    const transformedPosts = scheduledPosts.map(post => {
      const video = post.videoJob;
      
      // Format duration from seconds to MM:SS
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      // Generate thumbnail URL
      const thumbnailUrl = video.thumbnailUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${video.id}&backgroundColor=gradient`;

      // Map database status to frontend status
      let frontendStatus: 'scheduled' | 'published' | 'failed' | 'cancelled';
      switch (post.status) {
        case 'SCHEDULED':
          frontendStatus = 'scheduled';
          break;
        case 'PUBLISHED':
          frontendStatus = 'published';
          break;
        case 'FAILED':
          frontendStatus = 'failed';
          break;
        case 'CANCELLED':
          frontendStatus = 'cancelled';
          break;
        default:
          frontendStatus = 'scheduled';
      }

      return {
        id: post.id,
        videoId: post.videoJobId,
        video: {
          id: video.id,
          title: video.title || 'Untitled Video',
          thumbnail: thumbnailUrl,
          duration: video.duration ? formatDuration(video.duration) : '0:00',
          status: 'approved' as const,
          category: 'Generated Video',
          tags: ['ai-generated', 'video']
        },
        socialNetwork: post.socialNetwork,
        scheduledDate: post.scheduledDate.toISOString(),
        status: frontendStatus,
        customMessage: post.customMessage || undefined,
        createdAt: post.createdAt.toISOString()
      };
    });

    console.log('Admin Scheduler API - Found videos:', transformedVideos.length, 'Scheduled posts:', transformedPosts.length);

    return NextResponse.json({
      success: true,
      data: {
        videos: transformedVideos,
        scheduledPosts: transformedPosts,
        filters: {
          status,
          network
        }
      }
    });

  } catch (error) {
    console.error("Admin scheduler API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, socialNetworks, scheduledDate, customMessage } = body;

    // Validate required fields
    if (!videoId || !socialNetworks || !scheduledDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create scheduled posts for each social network
    const scheduledPosts = await Promise.all(
      socialNetworks.map((network: string) =>
        prisma.scheduledPost.create({
          data: {
            videoJobId: videoId,
            socialNetwork: network,
            scheduledDate: new Date(scheduledDate),
            status: 'SCHEDULED',
            customMessage: customMessage || null
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: scheduledPosts
    });

  } catch (error) {
    console.error("Create scheduled post error:", error);
    return NextResponse.json(
      { error: "Failed to create scheduled post" },
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
    const { postId, action } = body;

    let newStatus: 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
    
    switch (action) {
      case 'publish':
        newStatus = 'PUBLISHED';
        break;
      case 'cancel':
        newStatus = 'CANCELLED';
        break;
      case 'fail':
        newStatus = 'FAILED';
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update scheduled post status
    const updatedPost = await prisma.scheduledPost.update({
      where: { id: postId },
      data: {
        status: newStatus
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedPost
    });

  } catch (error) {
    console.error("Update scheduled post error:", error);
    return NextResponse.json(
      { error: "Failed to update scheduled post" },
      { status: 500 }
    );
  }
}
