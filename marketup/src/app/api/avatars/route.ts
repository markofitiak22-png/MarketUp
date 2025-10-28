import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import didClient from "@/lib/did-client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if D-ID API key is configured
    if (!process.env.DID_API_KEY) {
      console.log('D-ID API key not configured, using fallback avatars');
      throw new Error('D-ID API key not configured');
    }

    // Get avatars from D-ID API
    const avatars = await didClient.getAvatars();

    // Transform to our format
    const transformedAvatars = avatars.map(avatar => ({
      id: avatar.id,
      name: avatar.name,
      image: `https://create-images-results.d-id.com/DefaultPresenters/${avatar.id}/image.jpg`,
      gender: avatar.gender,
      language: avatar.language,
      voice: avatar.voice
    }));

    return NextResponse.json({
      success: true,
      avatars: transformedAvatars
    });

  } catch (error) {
    console.error('Error fetching avatars:', error);
    
    // Fallback to static avatars if D-ID API fails
    const fallbackAvatars = [
      {
        id: 'sarah-1',
        name: 'Sarah',
        image: '/avatars/sarah.jpg',
        gender: 'female' as const,
        language: 'English',
        voice: {
          id: 'en-US-AriaNeural',
          name: 'Aria',
          gender: 'female' as const,
          language: 'English'
        }
      },
      {
        id: 'david-1',
        name: 'David',
        image: '/avatars/david.jpg',
        gender: 'male' as const,
        language: 'English',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male' as const,
          language: 'English'
        }
      },
      {
        id: 'emma-1',
        name: 'Emma',
        image: '/avatars/emma.jpg',
        gender: 'female' as const,
        language: 'English',
        voice: {
          id: 'en-US-JennyNeural',
          name: 'Jenny',
          gender: 'female' as const,
          language: 'English'
        }
      },
      {
        id: 'michael-1',
        name: 'Michael',
        image: '/avatars/michael.jpg',
        gender: 'male' as const,
        language: 'English',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male' as const,
          language: 'English'
        }
      },
      {
        id: 'lisa-1',
        name: 'Lisa',
        image: '/avatars/lisa.jpg',
        gender: 'female' as const,
        language: 'English',
        voice: {
          id: 'en-US-JennyNeural',
          name: 'Jenny',
          gender: 'female' as const,
          language: 'English'
        }
      },
      {
        id: 'alex-1',
        name: 'Alex',
        image: '/avatars/alex.jpg',
        gender: 'male' as const,
        language: 'English',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male' as const,
          language: 'English'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      avatars: fallbackAvatars
    });
  }
}
