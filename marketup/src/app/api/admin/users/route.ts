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
    console.log('Admin Users API - User ID:', userId);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const subscription = searchParams.get('subscription') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Map frontend sortBy to actual database field names
    const sortByMapping: { [key: string]: string } = {
      'joinDate': 'createdAt',
      'lastActive': 'createdAt', // We'll handle this differently since it's calculated
      'name': 'name',
      'email': 'email',
      'createdAt': 'createdAt'
    };
    
    const actualSortBy = sortByMapping[sortBy] || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users with related data
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          videoJobs: {
            select: {
              id: true,
              createdAt: true,
              status: true
            }
          },
          sessions: {
            orderBy: { expires: 'desc' },
            take: 1,
            select: {
              expires: true
            }
          }
        },
        orderBy: sortBy === 'lastActive' ? { createdAt: 'desc' } : {
          [actualSortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Transform users data
    const transformedUsers = users.map(user => {
      // Calculate user stats
      const videosCreated = user.videoJobs.length;
      const completedVideos = user.videoJobs.filter(v => v.status === 'COMPLETED').length;
      
      // Get subscription info
      const activeSubscription = user.subscriptions[0];
      const subscriptionTier = activeSubscription?.tier || 'FREE';
      const subscriptionName = subscriptionTier === 'BASIC' ? 'Basic' :
                              subscriptionTier === 'STANDARD' ? 'Premium' :
                              subscriptionTier === 'PREMIUM' ? 'Enterprise' : 'Free';

      // Calculate total spent (mock calculation)
      const totalSpent = activeSubscription ? 
        (subscriptionTier === 'BASIC' ? 9 * 12 : 
         subscriptionTier === 'STANDARD' ? 29 * 12 : 
         subscriptionTier === 'PREMIUM' ? 99 * 12 : 0) : 0;

      // Determine user status
      let userStatus = 'active';
      if (user.sessions.length === 0) {
        userStatus = 'inactive';
      } else {
        const lastSession = user.sessions[0];
        const daysSinceLastSession = Math.floor((Date.now() - lastSession.expires.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastSession > 30) {
          userStatus = 'inactive';
        }
      }

      // Get last active date
      const lastActive = user.sessions.length > 0 ? 
        user.sessions[0].expires.toISOString().split('T')[0] : 
        user.createdAt.toISOString().split('T')[0];

      return {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'No email',
        role: 'user', // Default role, in real app this would be stored in DB
        status: userStatus,
        joinDate: user.createdAt.toISOString().split('T')[0],
        lastActive,
        subscription: subscriptionName,
        videosCreated,
        totalSpent,
        avatar: null,
        // Additional data for admin
        locale: user.locale,
        country: user.country,
        createdAt: user.createdAt,
        hasActiveSubscription: !!activeSubscription,
        subscriptionStatus: activeSubscription?.status || 'NONE'
      };
    });

    // Apply additional filters
    let filteredUsers = transformedUsers;

    if (status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    if (subscription !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.subscription === subscription);
    }

    // Handle sorting for calculated fields
    if (sortBy === 'lastActive') {
      filteredUsers.sort((a, b) => {
        const dateA = new Date(a.lastActive);
        const dateB = new Date(b.lastActive);
        return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
    }

    console.log('Admin Users API - Found users:', filteredUsers.length);

    return NextResponse.json({
      success: true,
      data: {
        users: filteredUsers,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        },
        filters: {
          search,
          status,
          subscription,
          sortBy,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error("Admin users API error:", error);
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
    const { userId, updates } = body;

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: updates.name,
        email: updates.email,
        locale: updates.locale,
        country: updates.country
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !((session as any).user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userIds } = body;

    // Delete users (cascade will handle related data)
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds }
      }
    });

    return NextResponse.json({
      success: true,
      message: `${userIds.length} users deleted successfully`
    });

  } catch (error) {
    console.error("Delete users error:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
