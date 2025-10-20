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
    const profile = {
      name: session.user?.name || "",
      email: session.user?.email || "",
      bio: "Creative professional passionate about video marketing",
      company: "TechCorp",
      website: "https://example.com",
      avatar: null,
      preferences: {
        notifications: {
          email: true,
          push: false,
          marketing: true,
          updates: true
        },
        privacy: {
          profile: "public",
          analytics: true,
          dataSharing: false
        },
        settings: {
          theme: "dark",
          language: "en",
          timezone: "UTC",
          dateFormat: "MM/DD/YYYY"
        }
      }
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Dashboard profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // TODO: Implement profile update logic
    // - Validate input data
    // - Update database
    // - Handle file uploads (avatar)
    // - Send confirmation email if email changed

    console.log("Profile update:", updates);

    return NextResponse.json({ 
      message: "Profile updated successfully",
      profile: updates 
    });
  } catch (error) {
    console.error("Dashboard profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
