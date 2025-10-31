import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { voiceId, avatarId, text } = body;

    if (!voiceId || !avatarId) {
      return NextResponse.json({ error: "voiceId and avatarId are required" }, { status: 400 });
    }

    const heygenApiKey = process.env.HEYGEN_API_KEY;
    if (!heygenApiKey) {
      return NextResponse.json({ error: "HeyGen API key not configured" }, { status: 500 });
    }

    // Generate short audio preview using HeyGen API
    const previewText = text || "Hello! I'm Marcus. I'll be your video presenter today. Let me bring your content to life with my voice.";
    
    const payload = {
      video_inputs: [
        {
          character: {
            type: 'talking_photo',
            talking_photo_id: avatarId,
          },
          voice: {
            type: 'text',
            input_text: previewText,
            voice_id: voiceId,
          },
        },
      ],
      dimension: { width: 854, height: 480 },
      test: false,
    };

    console.log('🎤 Generating voice preview with HeyGen...');
    console.log('   Voice ID:', voiceId);
    console.log('   Avatar ID:', avatarId);

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': heygenApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HeyGen API error:', errorText);
      return NextResponse.json({ 
        error: `HeyGen API error: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }

    const result = await response.json();
    const videoId = result.data?.video_id;

    if (!videoId) {
      return NextResponse.json({ error: "Failed to get video ID from HeyGen" }, { status: 500 });
    }

    console.log('📊 Voice preview generation started:', videoId);

    // Poll for completion (with shorter timeout for preview)
    let attempts = 0;
    const maxAttempts = 30; // 2.5 minutes max for preview

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(
        `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
        {
          headers: {
            'X-Api-Key': heygenApiKey,
          },
        }
      );

      if (!statusResponse.ok) {
        return NextResponse.json({ 
          error: `Failed to check preview status: ${statusResponse.status}` 
        }, { status: 500 });
      }

      const statusResult = await statusResponse.json();
      const status = statusResult.data?.status;
      const videoUrl = statusResult.data?.video_url;
      const error = statusResult.data?.error;

      if (status === 'completed' && videoUrl) {
        console.log('✅ Voice preview generated:', videoUrl);
        return NextResponse.json({
          success: true,
          audioUrl: videoUrl, // HeyGen returns video, but contains audio
          videoUrl: videoUrl,
        });
      } else if (status === 'failed') {
        return NextResponse.json({ 
          error: `Preview generation failed: ${error || 'Unknown error'}` 
        }, { status: 500 });
      }

      attempts++;
    }

    return NextResponse.json({ 
      error: "Preview generation timeout" 
    }, { status: 504 });

  } catch (error: any) {
    console.error('Error generating voice preview:', error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}

