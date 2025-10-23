import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Admin API - Session:', session);
    
    if (!session || !session.user || !(session.user as any).id) {
      console.log('Admin API - Unauthorized access attempt');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    console.log('Admin API - User ID:', userId);

    // Check if user is admin (in real app, you'd have an admin role system)
    // For now, we'll allow any authenticated user to access admin data
    // TODO: Implement proper admin role checking

    // Test database connection
    try {
      const testUserCount = await prisma.user.count();
      console.log('Database connection test - User count:', testUserCount);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Get current date and previous month for comparisons
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get all metrics
    const [
      totalUsers,
      totalVideos,
      activeUsers,
      usersThisMonth,
      usersLastMonth,
      videosThisMonth,
      videosLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      recentUsers,
      recentVideos
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.videoJob.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),

      // This month metrics
      prisma.user.count({
        where: { createdAt: { gte: thisMonth } }
      }),
      prisma.user.count({
        where: { 
          createdAt: { 
            gte: lastMonth,
            lte: lastMonthEnd
          } 
        }
      }),
      prisma.videoJob.count({
        where: { createdAt: { gte: thisMonth } }
      }),
      prisma.videoJob.count({
        where: { 
          createdAt: { 
            gte: lastMonth,
            lte: lastMonthEnd
          } 
        }
      }),

      // Mock revenue calculations
      prisma.subscription.count({
        where: { 
          status: 'ACTIVE',
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.subscription.count({
        where: { 
          status: 'ACTIVE',
          createdAt: { 
            gte: lastMonth,
            lte: lastMonthEnd
          }
        }
      }),

      // Recent data
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.videoJob.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    // Calculate revenue (mock calculation)
    const basicSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE', tier: 'BASIC' }
    });
    const standardSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE', tier: 'STANDARD' }
    });
    const premiumSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE', tier: 'PREMIUM' }
    });

    const totalRevenue = (basicSubscriptions * 9) + (standardSubscriptions * 29) + (premiumSubscriptions * 99);
    const revenueThisMonthValue = (usersThisMonth * 0.1 * 29); // Mock calculation
    const revenueLastMonthValue = (usersLastMonth * 0.1 * 29); // Mock calculation

    // Debug logging
    console.log('Admin Dashboard Data:', {
      totalUsers,
      totalVideos,
      activeUsers,
      usersThisMonth,
      usersLastMonth,
      videosThisMonth,
      videosLastMonth,
      basicSubscriptions,
      standardSubscriptions,
      premiumSubscriptions,
      totalRevenue
    });

    // Calculate growth percentages
    const userGrowth = usersLastMonth > 0 ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 : 0;
    const videoGrowth = videosLastMonth > 0 ? ((videosThisMonth - videosLastMonth) / videosLastMonth) * 100 : 0;
    const revenueGrowth = revenueLastMonthValue > 0 ? ((revenueThisMonthValue - revenueLastMonthValue) / revenueLastMonthValue) * 100 : 0;

    // Format recent activity
    const activity = [
      ...recentUsers.map(user => ({
        type: 'user_registered',
        title: 'New user registered',
        description: `${user.name || user.email} joined the platform`,
        timestamp: user.createdAt,
        icon: 'user'
      })),
      ...recentVideos.map(video => ({
        type: 'video_created',
        title: 'Video created',
        description: `"${video.title}" by ${video.user?.name || video.user?.email || 'Unknown'}`,
        timestamp: video.createdAt,
        icon: 'video',
        status: video.status
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalRevenue,
          totalVideos,
          activeUsers,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
          userGrowth: Math.round(userGrowth * 10) / 10,
          videoGrowth: Math.round(videoGrowth * 10) / 10
        },
        recentActivity: activity,
        charts: {
          revenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [12000, 15000, 18000, 22000, 25000, totalRevenue / 6]
          },
          users: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [200, 350, 500, 750, 1000, totalUsers / 6]
          }
        }
      }
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
