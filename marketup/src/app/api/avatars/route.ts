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
      // Try to get avatars from Ready Player Me
      const avatars = await avatarService.getAvatars();
      
      console.log('Ready Player Me avatars loaded:', avatars.length);
      
      return NextResponse.json({
        success: true,
        avatars: avatars
      });
    } catch (rpmError) {
      console.log('Ready Player Me failed, using fallback avatars:', rpmError);
      
      // Fallback to high-quality professional photos
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