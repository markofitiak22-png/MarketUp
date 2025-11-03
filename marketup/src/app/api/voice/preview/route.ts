import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// Check if we're on Vercel (read-only file system)
const isVercel = !!process.env.VERCEL;

// Generate cache key from voiceId and avatarId
function getCacheKey(voiceId: string, avatarId: string): string {
  return `${voiceId}_${avatarId}`;
}

// Save preview file (local or Vercel Blob Storage)
async function savePreviewFile(buffer: Buffer, filename: string): Promise<string> {
  if (isVercel) {
    // On Vercel: use Blob Storage (filename can include path like "voice-previews/preview_xxx.mp3")
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
    });
    return blob.url;
  } else {
    // Local: save to public directory (extract just filename from path)
    const previewDir = path.join(process.cwd(), 'public', 'voice-previews');
    await fs.mkdir(previewDir, { recursive: true });
    const justFilename = filename.includes('/') ? filename.split('/').pop()! : filename;
    const filePath = path.join(previewDir, justFilename);
    await fs.writeFile(filePath, buffer);
    return `/voice-previews/${justFilename}`;
  }
}

// Check if file exists (only for local storage)
async function checkFileExists(fileUrl: string): Promise<boolean> {
  if (isVercel) {
    // On Vercel: assume URL from Blob Storage is always accessible
    return fileUrl.startsWith('https://');
  } else {
    // Local: check file system
    try {
      const filePath = path.join(process.cwd(), 'public', fileUrl.replace(/^\//, ''));
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
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
      
      const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
      const filename = `voice-previews/preview_${hash}.mp4`;
      
      const publicUrl = await savePreviewFile(Buffer.from(videoBuffer), filename);
      
      // Save to database
      await prisma.voicePreview.upsert({
        where: {
          voiceId_avatarId: {
            voiceId: voiceId,
            avatarId: avatarId
          }
        },
        create: {
          voiceId: voiceId,
          avatarId: avatarId,
          previewUrl: publicUrl,
          previewText: previewText
        },
        update: {
          previewUrl: publicUrl,
          previewText: previewText,
          updatedAt: new Date()
        }
      });
      
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

    // Marcus/Markus uses a specific preview file
    const MARCUS_AVATAR_ID = '285f8a71dcd14421a7e4ecda88d78610';
    const MARCUS_VOICE_ID = 'Ak9WvlDj5TXD6zyDtpXG';
    const MARCUS_PREVIEW_FILE = 'preview_ae0e03ac53b03461f8a93887c2c617d4.mp4';
    
    if (avatarId === MARCUS_AVATAR_ID && voiceId === MARCUS_VOICE_ID) {
      const marcusPreviewUrl = `/voice-previews/${MARCUS_PREVIEW_FILE}`;
      
      // Verify file exists locally
      if (!isVercel) {
        const fileExists = await checkFileExists(marcusPreviewUrl);
        if (!fileExists) {
          console.error('⚠️ Marcus preview file not found:', marcusPreviewUrl);
        }
      }
      
      // Ensure it's saved in database for consistency
      await prisma.voicePreview.upsert({
        where: {
          voiceId_avatarId: {
            voiceId: voiceId,
            avatarId: avatarId
          }
        },
        create: {
          voiceId: voiceId,
          avatarId: avatarId,
          previewUrl: marcusPreviewUrl,
          previewText: text || "Hello! I'm Marcus. I'll be your video presenter today. Let me bring your content to life with my voice."
        },
        update: {
          previewUrl: marcusPreviewUrl,
          previewText: text || "Hello! I'm Marcus. I'll be your video presenter today. Let me bring your content to life with my voice.",
          updatedAt: new Date()
        }
      });
      
      console.log('✅ Using predefined Marcus preview:', marcusPreviewUrl);
      return NextResponse.json({
        success: true,
        audioUrl: marcusPreviewUrl,
        videoUrl: marcusPreviewUrl,
        cached: true
      });
    }

    // Bob uses a specific preview file
    const BOB_AVATAR_ID = '8fb979fae61f487297620072ff19e6b5';
    const BOB_VOICE_ID = '2yPUSv5lTtXwpjGQBuZO';
    const BOB_PREVIEW_FILE = 'preview_12eaa678a955d685be5d4734eb5fa094.mp4';
    
    if (avatarId === BOB_AVATAR_ID && voiceId === BOB_VOICE_ID) {
      const bobPreviewUrl = `/voice-previews/${BOB_PREVIEW_FILE}`;
      
      // Verify file exists locally
      if (!isVercel) {
        const fileExists = await checkFileExists(bobPreviewUrl);
        if (!fileExists) {
          console.error('⚠️ Bob preview file not found:', bobPreviewUrl);
        }
      }
      
      // Ensure it's saved in database for consistency
      await prisma.voicePreview.upsert({
        where: {
          voiceId_avatarId: {
            voiceId: voiceId,
            avatarId: avatarId
          }
        },
        create: {
          voiceId: voiceId,
          avatarId: avatarId,
          previewUrl: bobPreviewUrl,
          previewText: text || "Hello! I'm Bob. I'll be your video presenter today. Let me bring your content to life with my voice."
        },
        update: {
          previewUrl: bobPreviewUrl,
          previewText: text || "Hello! I'm Bob. I'll be your video presenter today. Let me bring your content to life with my voice.",
          updatedAt: new Date()
        }
      });
      
      console.log('✅ Using predefined Bob preview:', bobPreviewUrl);
      return NextResponse.json({
        success: true,
        audioUrl: bobPreviewUrl,
        videoUrl: bobPreviewUrl,
        cached: true
      });
    }

    // Check database for existing preview
    const existingPreview = await prisma.voicePreview.findUnique({
      where: {
        voiceId_avatarId: {
          voiceId: voiceId,
          avatarId: avatarId
        }
      }
    });

    if (existingPreview) {
      // Verify file still exists (only check on local, Blob Storage URLs are always accessible)
      const fileExists = await checkFileExists(existingPreview.previewUrl);
      if (fileExists) {
        console.log('✅ Using preview from database:', existingPreview.previewUrl);
        return NextResponse.json({
          success: true,
          audioUrl: existingPreview.previewUrl,
          videoUrl: existingPreview.previewUrl,
          cached: true
        });
      } else {
        // File doesn't exist, delete from database
        await prisma.voicePreview.delete({
          where: { id: existingPreview.id }
        });
        console.log('⚠️ Preview file not found, regenerating...');
      }
    }

    const heygenApiKey = process.env.HEYGEN_API_KEY;
    if (!heygenApiKey) {
      return NextResponse.json({ error: "HeyGen API key not configured" }, { status: 500 });
    }

    // Generate cache key for filename
    const cacheKey = getCacheKey(voiceId, avatarId);
    
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
    
    // Generate filename from voiceId and avatarId
    const hash = crypto.createHash('md5').update(cacheKey).digest('hex');
    const filename = `voice-previews/preview_${hash}.mp3`; // Voice API returns MP3
    
    // Save file (local or Vercel Blob Storage)
    const publicUrl = await savePreviewFile(Buffer.from(audioBuffer), filename);
    
    // Save to database
    await prisma.voicePreview.upsert({
      where: {
        voiceId_avatarId: {
          voiceId: voiceId,
          avatarId: avatarId
        }
      },
      create: {
        voiceId: voiceId,
        avatarId: avatarId,
        previewUrl: publicUrl,
        previewText: previewText
      },
      update: {
        previewUrl: publicUrl,
        previewText: previewText,
        updatedAt: new Date()
      }
    });
    
    console.log('✅ Preview saved:', publicUrl, isVercel ? '(Vercel Blob Storage)' : '(local file)');
    
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

