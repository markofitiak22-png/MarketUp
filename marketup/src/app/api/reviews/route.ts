import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "crypto";

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).optional(),
});

const getReviewsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  sort: z.enum(["newest", "oldest", "highest", "lowest"]).optional().default("newest"),
  status: z.enum(["all", "approved", "pending"]).optional().default("approved"),
});

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ipHash: string, userId?: string): string {
  return userId ? `user:${userId}` : `ip:${ipHash}`;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3; // Max 3 reviews per 15 minutes

  const current = rateLimitMap.get(key);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// GET /api/reviews - Get reviews with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = getReviewsSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sort: searchParams.get("sort"),
      status: searchParams.get("status"),
    });

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (params.status === "approved") {
      where.status = "APPROVED";
    } else if (params.status === "pending") {
      where.status = "PENDING";
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (params.sort) {
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
    }

    // Get session to check if user has already submitted a review
    const session = await getServerSession(authOptions);
    let userHasReview = false;
    
    if ((session as any)?.user?.id) {
      const userReview = await prisma.review.findFirst({
        where: { userId: (session as any).user.id },
      });
      userHasReview = !!userReview;
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
          createdAt: true,
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

    // Calculate average rating for approved reviews only
    const avgRatingResult = await prisma.review.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      stats: {
        averageRating: avgRatingResult._avg.rating || 0,
        totalReviews: avgRatingResult._count.rating || 0,
      },
      userHasReview,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!((session as any)?.user?.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = createReviewSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
    }

    const { rating, comment } = parsed.data;

    // Get client IP and user agent for rate limiting and anti-abuse
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "";
    const ipHash = hashString(ip);

    // Check rate limiting
    const rateLimitKey = getRateLimitKey(ipHash, (session as any).user.id);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    // Check if user already has a review
    const existingReview = await prisma.review.findFirst({
      where: { userId: (session as any).user.id },
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already submitted a review" }, { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: (session as any).user.id,
        rating,
        comment,
        ipHash,
        userAgent,
        status: "PENDING", // All reviews start as pending for moderation
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
