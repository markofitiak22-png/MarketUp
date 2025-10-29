import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth/next"; // Fix: getServerSession is typically imported from 'next-auth/next' in API routes
import { authOptions } from "@/lib/auth";

const updateReviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "HIDDEN"]),
  moderationNote: z.string().optional(),
});

// GET /api/admin/reviews - Get all reviews for admin management
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Ensure session exists and has a user with an ID for authorization
    // Ensure session exists and has a user with an ID for authorization.
    // Using optional chaining for robust access to nested properties,
    // which correctly handles cases where 'session', 'session.user', or 'session.user.id' might be null or undefined.
    // A type assertion is used here to address a TypeScript inference issue where 'session' might be typed as '{}'
    // instead of 'Session | null' from 'next-auth'. This assumes the runtime object will have the 'user' property.
    if (!((session as any)?.user?.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you might want to add a proper admin check)
    // For now, we'll assume any authenticated user can access admin routes
    // In production, add proper role-based access control

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all";
    const sort = searchParams.get("sort") || "newest";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status !== "all") {
      where.status = status.toUpperCase();
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "highest":
        orderBy = { rating: "desc" };
        break;
      case "lowest":
        orderBy = { rating: "asc" };
        break;
      case "status":
        orderBy = { status: "asc" };
        break;
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          rating: true,
          comment: true,
          status: true,
          createdAt: true,
          moderatedAt: true,
          moderationNote: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Get statistics
    const stats = await prisma.review.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      stats: statusCounts,
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
