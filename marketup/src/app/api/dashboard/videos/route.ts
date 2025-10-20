import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";

    // Mock data - replace with actual database queries
    const allVideos = [
      {
        id: 1,
        title: "Coffee Shop Promo",
        status: "Completed",
        createdAt: "2024-01-15",
        duration: "0:30",
        thumbnail: "☕",
        views: 1250,
        downloads: 45
      },
      {
        id: 2,
        title: "Restaurant Menu Showcase",
        status: "Processing",
        createdAt: "2024-01-14",
        duration: "1:15",
        thumbnail: "🍽️",
        views: 0,
        downloads: 0
      },
      {
        id: 3,
        title: "Product Launch Video",
        status: "Completed",
        createdAt: "2024-01-12",
        duration: "0:45",
        thumbnail: "🚀",
        views: 2100,
        downloads: 78
      },
      {
        id: 4,
        title: "Brand Story",
        status: "Draft",
        createdAt: "2024-01-10",
        duration: "2:30",
        thumbnail: "📖",
        views: 0,
        downloads: 0
      },
      {
        id: 5,
        title: "Holiday Special",
        status: "Completed",
        createdAt: "2024-01-08",
        duration: "1:00",
        thumbnail: "🎄",
        views: 3400,
        downloads: 120
      }
    ];

    // Filter videos
    let filteredVideos = allVideos;
    
    if (filter !== "all") {
      filteredVideos = allVideos.filter(video => 
        video.status.toLowerCase() === filter
      );
    }
    
    if (search) {
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    return NextResponse.json({
      videos: paginatedVideos,
      pagination: {
        page,
        limit,
        total: filteredVideos.length,
        totalPages: Math.ceil(filteredVideos.length / limit)
      }
    });
  } catch (error) {
    console.error("Dashboard videos error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
