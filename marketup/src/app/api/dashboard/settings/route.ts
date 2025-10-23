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

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
        country: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Default settings structure
    const defaultSettings = {
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
      preferences: {
        theme: "dark",
        language: user.locale || "en",
        timezone: "UTC",
        dateFormat: "MM/DD/YYYY"
      }
    };

    // In a real app, you would store these settings in the database
    // For now, we'll return default settings with user data
    const settings = {
      ...defaultSettings,
      preferences: {
        ...defaultSettings.preferences,
        language: user.locale || "en"
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          locale: user.locale,
          country: user.country,
          createdAt: user.createdAt,
          memberSince: user.createdAt.toISOString().split('T')[0]
        },
        settings
      }
    });

  } catch (error) {
    console.error("Settings data error:", error);
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

    const userId = ((session as any).user as any).id;
    const body = await request.json();
    const { settings, userData } = body;

    // Update user data if provided
    if (userData) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: userData.name,
          locale: userData.locale,
          country: userData.country
        }
      });
    }

    // In a real app, you would save settings to the database
    // For now, we'll just return success
    // TODO: Implement settings storage in database

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully"
    });

  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
