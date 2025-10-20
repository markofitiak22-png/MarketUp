import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock data - replace with actual database queries
    const overview = {
      totalVideos: 12,
      videosThisMonth: 3,
      currentPlan: {
        name: "Pro Plan",
        price: 29,
        period: "month",
        status: "active"
      },
      storageUsed: 2.4,
      storageLimit: 10,
      recentVideos: [
        {
          id: 1,
          title: "Coffee Shop Promo",
          status: "Completed",
          createdAt: "2 hours ago",
          thumbnail: "☕"
        },
        {
          id: 2,
          title: "Restaurant Menu",
          status: "Processing",
          createdAt: "1 day ago",
          thumbnail: "🍽️"
        },
        {
          id: 3,
          title: "Product Launch",
          status: "Completed",
          createdAt: "3 days ago",
          thumbnail: "🚀"
        }
      ]
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
