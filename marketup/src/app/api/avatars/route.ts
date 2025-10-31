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

    // Use local avatar images and HeyGen IDs for video generation
    const marcusId = '285f8a71dcd14421a7e4ecda88d78610'; // Marcus avatar ID for HeyGen
    const bobId = '8fb979fae61f487297620072ff19e6b5'; // Bob avatar ID for HeyGen

    // Create avatars with local images
    const avatars = [
      {
        id: marcusId,
        name: 'Marcus',
        image: '/avatars/Marcus.png', // Use local image file
        gender: 'male' as const,
        language: 'en',
        personality: 'Confident & Charismatic',
        description: 'A cheerful Man in a professional kitchen',
        voice: {
          id: 'Ak9WvlDj5TXD6zyDtpXG', // HeyGen voice ID
          name: 'Marcus Voice',
          gender: 'male' as const,
          language: 'English'
        }
      },
      {
        id: bobId,
        name: 'Bob',
        image: '/avatars/Bob.png',
        gender: 'male' as const,
        language: 'en',
        personality: 'Professional & Friendly',
        description: 'A professional presenter',
        voice: {
          id: '2yPUSv5lTtXwpjGQBuZO', // HeyGen voice ID
          name: 'Bob Voice',
          gender: 'male' as const,
          language: 'English'
        }
      }
    ];

    console.log('✅ Avatars loaded:', avatars.length);
    
    return NextResponse.json({
      success: true,
      avatars: avatars
    });
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