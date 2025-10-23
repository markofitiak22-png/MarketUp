import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get user's subscription info
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get video statistics
    const [totalVideos, completedVideos, processingVideos, totalViews, totalDownloads] = await Promise.all([
      prisma.videoJob.count({
        where: { userId }
      }),
      prisma.videoJob.count({
        where: { 
          userId,
          status: 'COMPLETED'
        }
      }),
      prisma.videoJob.count({
        where: { 
          userId,
          status: 'PROCESSING'
        }
      }),
      prisma.videoJob.aggregate({
        where: { userId },
        _sum: { views: true }
      }),
      prisma.videoJob.aggregate({
        where: { userId },
        _sum: { downloads: true }
      })
    ]);

    // Get recent videos (last 5)
    const recentVideos = await prisma.videoJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        thumbnailUrl: true,
        views: true,
        downloads: true
      }
    });

    // Calculate storage used (mock calculation based on file sizes)
    const storageUsed = await prisma.videoJob.aggregate({
      where: { userId },
      _sum: { fileSize: true }
    });

    const storageUsedGB = storageUsed._sum.fileSize ? 
      Math.round((storageUsed._sum.fileSize / (1024 * 1024 * 1024)) * 100) / 100 : 0;

    // Get videos created this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const videosThisMonth = await prisma.videoJob.count({
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
              video.status === 'QUEUED' ? 'Queued' : 'Failed',
      createdAt: getTimeAgo(video.createdAt),
      thumbnail: video.thumbnailUrl ? '🎥' : '📹',
      views: video.views,
      downloads: video.downloads
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalVideos,
          completedVideos,
          processingVideos,
          totalViews: totalViews._sum.views || 0,
          totalDownloads: totalDownloads._sum.downloads || 0,
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