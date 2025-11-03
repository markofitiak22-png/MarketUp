import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// In-memory cache for preview URLs (in production, use Redis or database)
const previewCache = new Map<string, string>();

// Generate cache key from voiceId and avatarId
function getCacheKey(voiceId: string, avatarId: string): string {
  return `${voiceId}_${avatarId}`;
}

// Fallback: Generate preview using full video (slower but more reliable)
async function generateVideoPreview(
  heygenApiKey: string,
  voiceId: string,
  avatarId: string,
  previewText: string,
  cacheKey: string
) {
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
    throw new Error(`HeyGen API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const videoId = result.data?.video_id;

  if (!videoId) {
    throw new Error("Failed to get video ID from HeyGen");
  }

  // Poll for completion with shorter intervals and timeout
  let attempts = 0;
  const maxAttempts = 20; // Reduced to 20 attempts (100 seconds max)

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
      throw new Error(`Failed to check preview status: ${statusResponse.status}`);
    }

    const statusResult = await statusResponse.json();
    const status = statusResult.data?.status;
    const videoUrl = statusResult.data?.video_url;
    const error = statusResult.data?.error;

    if (status === 'completed' && videoUrl) {
      // Download and save
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error("Failed to download preview video");
      }

      const videoBuffer = await videoResponse.arrayBuffer();
      const previewDir = path.join(process.cwd(), 'public', 'voice-previews');
      await fs.mkdir(previewDir, { recursive: true });
      
      const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
      const filename = `preview_${hash}.mp4`;
      const filePath = path.join(previewDir, filename);
      
      await fs.writeFile(filePath, Buffer.from(videoBuffer));
      
      const publicUrl = `/voice-previews/${filename}`;
      previewCache.set(cacheKey, publicUrl);
      
      return NextResponse.json({
        success: true,
        audioUrl: publicUrl,
        videoUrl: publicUrl,
        cached: false
      });
    } else if (status === 'failed') {
      throw new Error(`Preview generation failed: ${error || 'Unknown error'}`);
    }

    attempts++;
  }

  throw new Error("Preview generation timeout");
}

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

    // Check cache first
    const cacheKey = getCacheKey(voiceId, avatarId);
    const cachedUrl = previewCache.get(cacheKey);
    
    if (cachedUrl) {
      // Verify file still exists
      try {
        const filePath = path.join(process.cwd(), 'public', cachedUrl.replace(/^\//, ''));
        await fs.access(filePath);
        console.log('✅ Using cached preview:', cachedUrl);
        return NextResponse.json({
          success: true,
          audioUrl: cachedUrl,
          videoUrl: cachedUrl,
          cached: true
        });
      } catch (error) {
        // File doesn't exist, remove from cache
        previewCache.delete(cacheKey);
      }
    }

    const heygenApiKey = process.env.HEYGEN_API_KEY;
    if (!heygenApiKey) {
      return NextResponse.json({ error: "HeyGen API key not configured" }, { status: 500 });
    }

    // Generate short audio preview using HeyGen Voice API (faster than full video)
    const previewText = text || "Hello! I'm Marcus. I'll be your video presenter today. Let me bring your content to life with my voice.";
    
    console.log('🎤 Generating voice preview with HeyGen Voice API (faster method)...');
    console.log('   Voice ID:', voiceId);
    console.log('   Avatar ID:', avatarId);

    // Use voice.generate endpoint for faster audio generation
    const voiceResponse = await fetch('https://api.heygen.com/v1/voice.generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': heygenApiKey,
      },
      body: JSON.stringify({
        voice_id: voiceId,
        text: previewText,
      }),
    });

    if (!voiceResponse.ok) {
      const errorText = await voiceResponse.text();
      console.error('❌ HeyGen Voice API error:', errorText);
      
      // Fallback to video generation if voice API fails
      console.log('⚠️ Falling back to video generation...');
      return await generateVideoPreview(heygenApiKey, voiceId, avatarId, previewText, cacheKey);
    }

    const voiceResult = await voiceResponse.json();
    const audioUrl = voiceResult.data?.audio_url;

    if (!audioUrl) {
      console.error('❌ No audio URL in response:', voiceResult);
      // Fallback to video generation
      return await generateVideoPreview(heygenApiKey, voiceId, avatarId, previewText, cacheKey);
    }

    console.log('✅ Voice preview generated, downloading and saving locally...');
    
    // Download audio and save locally
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      return NextResponse.json({ 
        error: "Failed to download preview audio" 
      }, { status: 500 });
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Create preview directory
    const previewDir = path.join(process.cwd(), 'public', 'voice-previews');
    await fs.mkdir(previewDir, { recursive: true });
    
    // Generate filename from voiceId and avatarId
    const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
    const filename = `preview_${hash}.mp3`; // Voice API returns MP3
    const filePath = path.join(previewDir, filename);
    
    // Save file
    await fs.writeFile(filePath, Buffer.from(audioBuffer));
    
    // Create public URL
    const publicUrl = `/voice-previews/${filename}`;
    
    // Cache the URL
    previewCache.set(cacheKey, publicUrl);
    
    console.log('✅ Preview saved locally:', publicUrl);
    
    return NextResponse.json({
      success: true,
      audioUrl: publicUrl,
      videoUrl: publicUrl,
      cached: false
    });

  } catch (error: any) {
    console.error('Error generating voice preview:', error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}

