import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Generate background images based on atmosphere/category
 * Uses Replicate's Stable Diffusion model for image generation via API
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as any).user || !(session as any).user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, count = 4, seed } = body;

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateApiToken) {
      console.warn('REPLICATE_API_TOKEN not set, using placeholder backgrounds');
      // Return placeholder backgrounds
      return NextResponse.json({
        success: true,
        backgrounds: Array.from({ length: count }, (_, i) => ({
          id: `placeholder-${category.toLowerCase()}-${Date.now()}-${i}`,
          name: `${category} Background ${i + 1}`,
          image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=1920&q=80`,
          type: 'image' as const,
          category: category,
          description: `${category.toLowerCase()} background scene`,
          generated: false
        }))
      });
    }

    // Map category to prompt descriptions
    const categoryPrompts: { [key: string]: string } = {
      'Professional': 'modern professional office environment, sleek corporate interior, business meeting room, clean modern workspace, city view backdrop, minimalist office design, executive workspace, professional ambiance, high-quality photography, natural lighting',
      'Casual': 'cozy comfortable space, warm home office, casual coffee shop atmosphere, relaxed modern interior, comfortable seating area, friendly welcoming environment, soft natural lighting, casual contemporary design, inviting space, comfortable ambiance',
      'Creative': 'artistic creative studio space, colorful modern interior, innovative design environment, vibrant creative workspace, artistic backdrop, modern futuristic space, creative atmosphere, unique interior design, inspiring workspace, dynamic lighting'
    };

    const basePrompt = categoryPrompts[category] || categoryPrompts['Professional'];

    // Generate multiple variations
    const backgrounds = [];
    const modelVersion = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"; // SDXL version

    // Helper function to generate a single background with retry
    const generateSingleBackground = async (i: number, retries = 3): Promise<any> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const prompt = `${basePrompt}, wide angle view, 16:9 aspect ratio, high resolution, cinematic lighting, professional photography style`;
          const negativePrompt = "people, faces, text, logos, watermarks, low quality, blurry, distorted";

          // Call Replicate API with correct format (version instead of model)
          const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${replicateApiToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              version: modelVersion,
              input: {
                prompt,
                negative_prompt: negativePrompt,
                width: 1920,
                height: 1080,
                num_outputs: 1,
                guidance_scale: 7.5,
                num_inference_steps: 25,
                seed: seed ? seed + i : undefined,
              },
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || `HTTP ${response.status}`;
            
            // Handle rate limiting with exponential backoff
            if (response.status === 429) {
              const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
              console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${retries}`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            
            throw new Error(`Replicate API error (${response.status}): ${errorMessage}`);
          }

          const prediction = await response.json();
          
          if (!prediction.id) {
            throw new Error('No prediction ID returned from API');
          }

          // Poll for completion with timeout (max 60 seconds)
          let result = prediction;
          let pollAttempts = 0;
          const maxPollAttempts = 60;
          
          while ((result.status === 'starting' || result.status === 'processing') && pollAttempts < maxPollAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Poll every 2 seconds
            pollAttempts++;
            
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
              headers: {
                'Authorization': `Token ${replicateApiToken}`,
              },
            });
            
            if (!statusResponse.ok) {
              throw new Error(`Failed to check status: ${statusResponse.status}`);
            }
            
            result = await statusResponse.json();
          }

          if (result.status === 'succeeded' && result.output && result.output[0]) {
            return {
              id: `generated-${category.toLowerCase()}-${Date.now()}-${i}`,
              name: `${category} Background ${i + 1}`,
              image: result.output[0],
              type: 'image' as const,
              category: category,
              description: `AI-generated ${category.toLowerCase()} background scene`,
              generated: true
            };
          } else if (result.status === 'failed') {
            throw new Error(`Generation failed: ${result.error || 'Unknown error'}`);
          } else if (pollAttempts >= maxPollAttempts) {
            throw new Error('Generation timeout - took too long');
          } else {
            throw new Error(`Unexpected status: ${result.status}`);
          }
        } catch (error) {
          const isLastAttempt = attempt === retries - 1;
          if (isLastAttempt) {
            console.error(`Error generating background ${i + 1} (all retries exhausted):`, error);
            return null;
          } else {
            console.warn(`Error generating background ${i + 1} (attempt ${attempt + 1}/${retries}), retrying...`, error);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Wait before retry
          }
        }
      }
      return null;
    };

    // Generate backgrounds sequentially to avoid rate limiting (but with small delay between requests)
    const validBackgrounds = [];
    for (let i = 0; i < count; i++) {
      const result = await generateSingleBackground(i);
      if (result) {
        validBackgrounds.push(result);
      }
      // Small delay between requests to avoid rate limiting
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // If no backgrounds generated, return at least placeholder or partial success
    if (validBackgrounds.length === 0) {
      console.error('Failed to generate any backgrounds');
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to generate any backgrounds. Please check your Replicate API token and try again.",
          backgrounds: []
        },
        { status: 500 }
      );
    }

    // Return partial success if some backgrounds failed
    return NextResponse.json({
      success: true,
      backgrounds: validBackgrounds,
      generated: validBackgrounds.length,
      requested: count
    });

  } catch (error) {
    console.error('Error in background generation:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate backgrounds"
    }, { status: 500 });
  }
}

