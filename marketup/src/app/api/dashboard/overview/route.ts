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

    // Get user's subscription info
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get video statistics
    const [totalVideos, completedVideos, processingVideos] = await Promise.all([
      prisma.video.count({
        where: { userId }
      }),
      prisma.video.count({
        where: { 
          userId,
          status: 'COMPLETED'
        }
      }),
      prisma.video.count({
        where: { 
          userId,
          status: 'PROCESSING'
        }
      })
    ]);

    // Get recent videos (last 5)
    const recentVideos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        videoUrl: true
      }
    });

    // Mock storage calculation (since we don't store fileSize)
    const storageUsedGB = totalVideos * 0.05; // Assume ~50MB per video

    // Get videos created this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const videosThisMonth = await prisma.video.count({
      where: {
        userId,
        createdAt: {
          gte: thisMonth
        }
      }
    });

    // Format recent videos
    const formattedRecentVideos = recentVideos.map(video => ({
      id: video.id,
      title: video.title || `Video ${video.id.slice(-8)}`,
      status: video.status === 'COMPLETED' ? 'Completed' : 
              video.status === 'PROCESSING' ? 'Processing' : 
              video.status === 'PENDING' ? 'Queued' : 'Failed',
      createdAt: getTimeAgo(video.createdAt),
      thumbnail: video.videoUrl ? '🎥' : '📹',
      views: 0,
      downloads: 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalVideos,
          completedVideos,
          processingVideos,
          totalViews: 0,
          totalDownloads: 0,
          videosThisMonth,
          storageUsed: storageUsedGB,
          storageLimit: 10, // 10GB limit
          storagePercentage: Math.round((storageUsedGB / 10) * 100)
        },
        subscription: subscription ? {
          tier: subscription.tier,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
        } : null,
        recentVideos: formattedRecentVideos
      }
    });

  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}