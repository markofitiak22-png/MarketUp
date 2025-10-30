import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import avatarService from "@/lib/avatar-service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Try to get avatars from Character AI style service
      const avatars = await avatarService.getAvatars();
      
      console.log('Character AI avatars loaded:', avatars.length);
      
      return NextResponse.json({
        success: true,
        avatars: avatars
      });
    } catch (error) {
      console.log('Avatar service failed, using fallback avatars:', error);
      
      // Fallback to Character AI style avatars
      const fallbackAvatars = avatarService.getFallbackAvatars();
      
      return NextResponse.json({
        success: true,
        avatars: fallbackAvatars
      });
    }

  } catch (error) {
    console.error('Error fetching avatars:', error);
    
    // Final fallback
    const fallbackAvatars = avatarService.getFallbackAvatars();
    
    return NextResponse.json({
      success: true,
      avatars: fallbackAvatars
    });
  }
}