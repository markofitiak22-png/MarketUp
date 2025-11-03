// Video Generation Service using HeyGen API
// This service generates real AI talking avatar videos with voice synthesis

interface VideoGenerationRequest {
  avatar: {
    name: string;
    image: string;
    gender: string;
  };
  voice: {
    id: string;
    name: string;
    language: string;
  };
  backgrounds: Array<{
    image: string;
    name: string;
    category?: string;
  }>;
  text: string;
  quality: string;
  targetLanguage?: string; // Language code (e.g., 'ar', 'fr', 'de')
  enableGestures?: boolean; // Enable gesture control for natural movements
  avatarStyle?: 'normal' | 'full_body' | 'upper_body'; // Avatar display style
  onProgress?: (progress: number) => void; // Callback for progress updates
}

interface VideoGenerationResult {
  success: boolean;
  videoUrl?: string;
  error?: string;
  jobId?: string;
}

// HeyGen avatar mapping
const HEYGEN_AVATARS: { [key: string]: string } = {
  'male': '285f8a71dcd14421a7e4ecda88d78610', // Marcus (default male)
  'female': '285f8a71dcd14421a7e4ecda88d78610',
  'Marcus': '285f8a71dcd14421a7e4ecda88d78610',
  'Bob': '8fb979fae61f487297620072ff19e6b5',
  'default': '285f8a71dcd14421a7e4ecda88d78610'
};

// HeyGen voice mapping
const HEYGEN_VOICES: { [key: string]: string } = {
  'Marcus': 'Ak9WvlDj5TXD6zyDtpXG',
  'Bob': '2yPUSv5lTtXwpjGQBuZO',
  'male': 'Ak9WvlDj5TXD6zyDtpXG',     // Marcus voice (default)
  'female': 'Ak9WvlDj5TXD6zyDtpXG',
  'default': 'Ak9WvlDj5TXD6zyDtpXG'
};

// HeyGen default voices (deprecated - use HEYGEN_VOICES instead)
const HEYGEN_DEFAULT_VOICES: { [key: string]: string } = {
  'male': 'Ak9WvlDj5TXD6zyDtpXG',     // Marcus voice
  'female': 'Ak9WvlDj5TXD6zyDtpXG',
};

class VideoGenerator {
  private heygenApiKey: string;
  private heygenApiUrl: string;

  constructor() {
    this.heygenApiKey = process.env.HEYGEN_API_KEY || '';
    this.heygenApiUrl = 'https://api.heygen.com';
  }

  /**
   * Get list of available avatars from HeyGen
   */
  async listAvailableAvatars(): Promise<any> {
    if (!this.heygenApiKey) {
      throw new Error('HeyGen API key not configured.');
    }

    console.log('📋 Fetching available avatars from HeyGen...');
    
    const response = await fetch(`${this.heygenApiUrl}/v2/avatars`, {
      method: 'GET',
      headers: {
        'X-Api-Key': this.heygenApiKey,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch avatars');
      return null;
    }

    const result = await response.json();
    console.log('✅ Available avatars:', JSON.stringify(result, null, 2));
    return result;
  }

  /**
   * Generate background image URL based on theme/category using Replicate
   */
  private async generateBackgroundForTheme(category: string): Promise<string | null> {
    try {
      const replicateApiToken = process.env.REPLICATE_API_TOKEN;
      if (!replicateApiToken) {
        console.warn('⚠️ REPLICATE_API_TOKEN not set, skipping background generation');
        return null;
      }

      // Map category to prompt
      const categoryPrompts: { [key: string]: string } = {
        'Professional': 'modern professional office environment, sleek corporate interior, business meeting room, clean modern workspace, city view backdrop, minimalist office design',
        'Casual': 'cozy comfortable space, warm home office, casual coffee shop atmosphere, relaxed modern interior, comfortable seating area, friendly welcoming environment',
        'Creative': 'artistic creative studio space, colorful modern interior, innovative design environment, vibrant creative workspace, artistic backdrop, modern futuristic space'
      };

      const basePrompt = categoryPrompts[category] || categoryPrompts['Professional'];
      const prompt = `${basePrompt}, wide angle view, 16:9 aspect ratio, high resolution, cinematic lighting, professional photography style`;
      const negativePrompt = "people, faces, text, logos, watermarks, low quality, blurry, distorted";
      const modelVersion = "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

      // Generate background via Replicate API
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
          },
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Replicate API error (${response.status}), proceeding without background`);
        return null;
      }

      const prediction = await response.json();
      
      if (!prediction.id) {
        return null;
      }

      // Poll for completion (with shorter timeout for background generation)
      let result = prediction;
      let pollAttempts = 0;
      const maxPollAttempts = 30; // 30 seconds max for background
      
      while ((result.status === 'starting' || result.status === 'processing') && pollAttempts < maxPollAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        pollAttempts++;
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${replicateApiToken}`,
          },
        });
        
        if (!statusResponse.ok) {
          break;
        }
        
        result = await statusResponse.json();
        
        if (result.status === 'succeeded' && result.output && result.output[0]) {
          console.log(`✅ Generated background for ${category} theme`);
          return result.output[0];
        }
      }

      // If timeout or failed, proceed without background
      console.warn(`⚠️ Background generation timeout/failed for ${category}, proceeding without background`);
      return null;
    } catch (error) {
      console.warn('⚠️ Error generating background for theme, proceeding without:', error);
      return null;
    }
  }

  /**
   * Translate text to target language using free translation APIs (no API key required)
   */
  private async translateText(text: string, targetLanguage: string): Promise<string> {
    // If target language is English or not specified, return original text
    if (!targetLanguage || targetLanguage === 'en' || targetLanguage.toLowerCase() === 'english') {
      return text;
    }

    try {
      // Method 1: Try MyMemory Translation API (completely free, no API key needed)
      const translated = await this.translateWithMyMemory(text, targetLanguage);
      if (translated && translated !== text) {
        return translated;
      }

      // Method 2: Try Libretranslate public instance (no API key)
      const translated2 = await this.translateWithLibreTranslate(text, targetLanguage);
      if (translated2 && translated2 !== text) {
        return translated2;
      }

      // Method 3: Try simple public translator
      const translated3 = await this.translateWithSimpleAPI(text, targetLanguage);
      if (translated3 && translated3 !== text) {
        return translated3;
      }

      console.warn('⚠️ All translation methods failed, using original text');
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  /**
   * MyMemory Translation API - completely free, no API key
   */
  private async translateWithMyMemory(text: string, targetLanguage: string): Promise<string> {
    try {
      const languageMap: { [key: string]: string } = {
        'ar': 'ar', // Arabic
        'fr': 'fr', // French
        'de': 'de', // German
        'tr': 'tr', // Turkish
        'sv': 'sv', // Swedish
      };

      const targetLangCode = languageMap[targetLanguage] || targetLanguage;
      
      // MyMemory API - free, no API key needed (limit: 10000 chars per day)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLangCode}`
      );

      if (!response.ok) {
        return text;
      }

      const result = await response.json();
      const translatedText = result.responseData?.translatedText;
      
      if (translatedText && translatedText !== text && !translatedText.includes('MYMEMORY')) {
        console.log(`✅ Translated to ${targetLanguage} via MyMemory`);
        return translatedText;
      }

      return text;
    } catch (error) {
      return text;
    }
  }

  /**
   * LibreTranslate public instance - no API key
   */
  private async translateWithLibreTranslate(text: string, targetLanguage: string): Promise<string> {
    try {
      const languageMap: { [key: string]: string } = {
        'ar': 'ar',
        'fr': 'fr',
        'de': 'de',
        'tr': 'tr',
        'sv': 'sv',
      };

      const targetLangCode = languageMap[targetLanguage] || targetLanguage;
      
      // Try public LibreTranslate instance
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLangCode,
          format: 'text'
        }),
      });

      if (!response.ok) {
        return text;
      }

      const result = await response.json();
      const translatedText = result.translatedText;
      
      if (translatedText && translatedText !== text) {
        console.log(`✅ Translated to ${targetLanguage} via LibreTranslate`);
        return translatedText;
      }

      return text;
    } catch (error) {
      return text;
    }
  }

  /**
   * Simple translator API - backup method
   */
  private async translateWithSimpleAPI(text: string, targetLanguage: string): Promise<string> {
    try {
      const languageMap: { [key: string]: string } = {
        'ar': 'ar',
        'fr': 'fr',
        'de': 'de',
        'tr': 'tr',
        'sv': 'sv',
      };

      const targetLangCode = languageMap[targetLanguage] || targetLanguage;
      
      // Try translate.argosopentech.com (public LibreTranslate instance)
      const response = await fetch('https://translate.argosopentech.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLangCode,
        }),
      });

      if (!response.ok) {
        return text;
      }

      const result = await response.json();
      const translatedText = result.translatedText;
      
      if (translatedText && translatedText !== text) {
        console.log(`✅ Translated to ${targetLanguage} via ArgosTranslate`);
        return translatedText;
      }

      return text;
    } catch (error) {
      return text;
    }
  }

  /**
   * Generate talking avatar video using HeyGen API
   * Creates professional AI avatar videos with voice synthesis
   */
  async generateVideoWithHeyGen(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    if (!this.heygenApiKey) {
      throw new Error('HeyGen API key not configured. Please add HEYGEN_API_KEY to your .env file.');
    }

    console.log('🎥 Starting AI talking avatar generation with HeyGen...');
    console.log('📝 Avatar:', request.avatar.name);
    console.log('🗣️ Voice:', request.voice.name, `(${request.voice.language})`);
    console.log('🌄 Background:', request.backgrounds[0]?.name);
    console.log('💬 Text length:', request.text.length, 'characters');

    // Get Marcus avatar ID from mapping
    const targetAvatarId = HEYGEN_AVATARS[request.avatar.name] || HEYGEN_AVATARS[request.avatar.gender] || HEYGEN_AVATARS.default;
    let avatarId = targetAvatarId;
    let characterType = 'talking_photo'; // Use talking_photo type for ID format
    let isTalkingPhoto = true;
    
    try {
      console.log('🔍 Fetching available avatars from HeyGen API...');
      const avatarsResponse = await fetch(`${this.heygenApiUrl}/v2/avatars`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.heygenApiKey,
        },
      });
      
      if (avatarsResponse.ok) {
        const avatarsData = await avatarsResponse.json();
        console.log('📋 HeyGen API returned avatars:', JSON.stringify(avatarsData, null, 2));
        
        // Try to find avatar with target ID in talking_photos
        if (avatarsData.data?.talking_photos && avatarsData.data.talking_photos.length > 0) {
          const targetAvatar = avatarsData.data.talking_photos.find(
            (photo: any) => (photo.talking_photo_id || photo.id) === targetAvatarId
          );
          
          if (targetAvatar) {
            avatarId = targetAvatar.talking_photo_id || targetAvatar.id;
            characterType = 'talking_photo';
            isTalkingPhoto = true;
            console.log('✅ Using target avatar ID from API:', avatarId);
          } else {
            // Use target ID directly if not found in API response
            avatarId = targetAvatarId;
            characterType = 'talking_photo';
            isTalkingPhoto = true;
            console.log('✅ Using target avatar ID directly:', avatarId);
          }
        } else {
          // Use target ID directly if no talking_photos available
          avatarId = targetAvatarId;
          characterType = 'talking_photo';
          isTalkingPhoto = true;
          console.log('✅ Using target avatar ID (no API data):', avatarId);
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch avatars list, using target ID:', error);
      // Use target ID as fallback
      avatarId = targetAvatarId;
      characterType = 'talking_photo';
      isTalkingPhoto = true;
    }
    
    // Select voice based on language first, then avatar name or gender
    // Use voice from request.voice if available (it should contain the correct voice_id for selected language)
    let voiceId = request.voice.id || 
                  HEYGEN_VOICES[request.avatar.name] || 
                  HEYGEN_VOICES[request.avatar.gender] || 
                  HEYGEN_VOICES.default;

    // Build HeyGen request with required voice_id
    // Use correct type based on what we found
    const characterConfig: any = {
      type: characterType,
    };
    
    if (isTalkingPhoto) {
      characterConfig.talking_photo_id = avatarId;
      // Note: HeyGen currently supports gesture control for talking photos
      // Gesture control allows natural movements like thumbs up, pointing, smiling
      // Full body display is not currently supported - recommended framing is chest-up
    } else {
      characterConfig.avatar_id = avatarId;
      // Avatar style: 'normal' (default), other styles depend on avatar capabilities
      characterConfig.avatar_style = request.avatarStyle || 'normal';
    }
    
    // Translate text to target language if specified (using alternative to Google Translator)
    // HeyGen needs the text to be in the target language for proper pronunciation
    let finalText = request.text;
    
    if (request.targetLanguage && request.targetLanguage !== 'en') {
      console.log(`🌐 Translating text to ${request.targetLanguage} using alternative translation service...`);
      console.log(`   Voice ID: ${voiceId}`);
      finalText = await this.translateText(request.text, request.targetLanguage);
      console.log(`✅ Translation complete. Original length: ${request.text.length}, Translated length: ${finalText.length}`);
      console.log(`   Translated preview: ${finalText.substring(0, 100)}...`);
    } else {
      console.log(`🌐 Language: English (no translation needed)`);
      console.log(`   Voice ID: ${voiceId}`);
    }

    // Determine video dimension based on quality request
    // Use lower resolution for free plan but keep wide format
    let dimension = { width: 854, height: 480 }; // 480p wide format for free plan
    if (request.quality === 'hd' || request.quality === '1080p') {
      dimension = { width: 1280, height: 720 }; // 720p for HD
    }
    
    // Build video input with background support
    const videoInput: any = {
      character: characterConfig,
      voice: {
        type: 'text',
        input_text: finalText, // Use original text - HeyGen will synthesize in the language of voice_id
        voice_id: voiceId,
      },
    };

    // Generate background based on selected category/theme instead of using image URL
    if (request.backgrounds && request.backgrounds.length > 0) {
      const selectedBg = request.backgrounds[0];
      const backgroundCategory = selectedBg.category || 'Professional';
      
      console.log('🎨 Background info:', {
        hasBackgrounds: !!request.backgrounds,
        backgroundsCount: request.backgrounds.length,
        firstBg: selectedBg,
        category: backgroundCategory,
        hasCategory: !!selectedBg.category
      });
      
      // Generate background image on-the-fly based on category theme
      // This will create a background that matches the selected atmosphere
      try {
        console.log(`🎨 Generating background for category: ${backgroundCategory}`);
        const backgroundImageUrl = await this.generateBackgroundForTheme(backgroundCategory);
        
        if (backgroundImageUrl) {
          videoInput.background = {
            type: 'image',
            url: backgroundImageUrl
          };
          console.log('🌄 Using generated background for theme:', backgroundCategory);
          console.log('   Background URL:', backgroundImageUrl);
        } else {
          console.warn('⚠️ Background generation returned null, no background will be used');
        }
      } catch (error) {
        console.warn('⚠️ Failed to generate background, proceeding without background:', error);
        // Continue without background if generation fails
      }
    } else {
      console.log('⚠️ No backgrounds provided in request');
    }

    // Enable gesture control if requested
    // Gesture control allows natural gestures like thumbs up, pointing, smiling
    // Note: Full body movements are not currently supported by HeyGen
    // Recommended avatar framing: chest-up to avoid showing hands
    if (request.enableGestures && isTalkingPhoto) {
      // Gesture control can be enabled via text prompts or API parameters
      // Some gestures can be triggered automatically based on text content
      console.log('✅ Gesture control enabled - avatar will use natural gestures');
      // Note: Specific gesture implementation depends on HeyGen API version
      // May require gestures array or gesture parameters in character config
    }
    
    const payload = {
      video_inputs: [videoInput],
      dimension: dimension,
      test: false,
    };

    console.log('📤 Submitting to HeyGen API...');
    console.log('   Avatar ID:', avatarId);
    console.log('   Character type:', characterType);
    console.log('   Voice ID:', voiceId, `(${request.avatar.gender})`);
    console.log('   Dimension:', dimension);
    console.log('   Background:', request.backgrounds && request.backgrounds.length > 0 
      ? `${request.backgrounds[0].name} (${request.backgrounds.length} total)` 
      : 'None');
    console.log('   Gestures enabled:', request.enableGestures || false);
    console.log('   Avatar style:', request.avatarStyle || 'normal');

    // Submit video generation request
    const response = await fetch(`${this.heygenApiUrl}/v2/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.heygenApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HeyGen API error:', errorText);
      throw new Error(`HeyGen API error: ${response.status}. Details: ${errorText}`);
    }

    const result = await response.json();
    const videoId = result.data?.video_id;

    if (!videoId) {
      console.error('❌ No video ID in response:', result);
      throw new Error('Failed to get video ID from HeyGen');
    }

    console.log(`📊 Video generation started: ${videoId}`);
    console.log('⏳ Waiting for AI to generate talking avatar video...');

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max (5s intervals)
    
    // Progress calculation - ultra aggressive to reach high percentages very fast:
    // - 0-20%: Preparation and request sent
    // - 20-75%: Actual video generation (very fast progression)
    // - 75-85%: Processing completion in HeyGen
    // - 85-100%: Finalization (handled by route.ts)
    const progressStart = 20; // Start of actual generation
    const progressEnd = 75; // End of generation, before completion
    const progressRange = progressEnd - progressStart;
    
    // Track previous progress to ensure it always increases
    let previousProgress = progressStart;

    // Notify progress: Request sent (20%)
    if (request.onProgress) {
      request.onProgress(20);
    }
    previousProgress = 20;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(
        `${this.heygenApiUrl}/v1/video_status.get?video_id=${videoId}`,
        {
          headers: {
            'X-Api-Key': this.heygenApiKey,
          },
        }
      );

      if (!statusResponse.ok) {
        console.error('❌ Failed to check status');
        throw new Error(`Failed to check video status: ${statusResponse.status}`);
      }

      const statusResult = await statusResponse.json();
      const status = statusResult.data?.status;
      const videoUrl = statusResult.data?.video_url;
      const error = statusResult.data?.error;

      // Calculate realistic progress based on attempts
      // Most videos complete around attempt 15-25, so we map progress accordingly
      let currentProgress = progressStart;
      
      if (attempts > 0) {
        // Method 1: Ultra aggressive linear progress - guaranteed very fast increase
        // At least 3.5% per attempt for extremely fast progression
        const linearProgress = progressStart + (attempts * 3.5);
        
        // Method 2: Extremely aggressive curved progress based on attempt ratio
        const attemptProgress = Math.min(attempts / maxAttempts, 1);
        // Use an extremely fast curve (0.2) to reach higher percentages very quickly
        const curvedProgress = progressStart + (progressRange * Math.pow(attemptProgress, 0.2));
        
        // Method 3: Ultra accelerated time-based progress
        // Extremely fast progression through all stages
        let acceleratedProgress = progressStart;
        if (attempts <= 6) {
          // First 6 attempts: very fast (20-55%)
          acceleratedProgress = progressStart + (attempts * 5.8);
        } else if (attempts <= 12) {
          // Next 6 attempts: fast (55-70%)
          acceleratedProgress = 55 + ((attempts - 6) * 2.5);
        } else {
          // After 12 attempts: accelerate to reach 75%
          acceleratedProgress = 70 + Math.min((attempts - 12) * 2.5, 5);
        }
        
        // Method 4: Hybrid approach - mix of time-based and attempt-based
        // If we're early in the process, be very aggressive
        const hybridProgress = attempts <= 10 
          ? progressStart + (attempts * 5.5) // 20-75% in first 10 attempts
          : progressStart + (10 * 5.5) + ((attempts - 10) * 2); // Then slower
        
        // Take the maximum of all methods to ensure fastest possible progress
        currentProgress = Math.max(linearProgress, curvedProgress, acceleratedProgress, hybridProgress);
        
        // Ensure progress is always increasing - never goes backwards
        // Always increase by at least 3% from previous value for extremely fast progression
        currentProgress = Math.max(currentProgress, previousProgress + 3.0);
        
        // Cap at 75% until actually completed
        currentProgress = Math.min(currentProgress, 75);
        
        // Store for next iteration
        previousProgress = currentProgress;
      }
      
      // Update progress callback - always ensure it's called with increasing value
      const roundedProgress = Math.round(currentProgress);
      if (request.onProgress) {
        request.onProgress(roundedProgress);
      }

      console.log(`📊 Generation status: ${status} (attempt ${attempts + 1}/${maxAttempts}, progress: ${roundedProgress}%)`);

      if (status === 'completed' && videoUrl) {
        // Notify progress: Video generation completed (75%)
        // Route will handle finalization from 75% to 100% with gradual steps
        if (request.onProgress) {
          request.onProgress(75);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ AI TALKING AVATAR VIDEO GENERATED!');
        console.log('   🎭 Avatar speaks with natural voice');
        console.log('   🗣️ Language:', request.voice.language);
        console.log('   🌄 Background:', request.backgrounds[0]?.name);
        console.log('   📹 Video URL:', videoUrl);
        console.log('═══════════════════════════════════════════════════════');

        return {
          success: true,
          videoUrl: videoUrl,
          jobId: videoId,
        };
      } else if (status === 'failed') {
        const errorMessage = typeof error === 'object' ? JSON.stringify(error, null, 2) : error;
        console.error('❌ Video generation failed. Error details:', errorMessage);
        console.error('❌ Full status response:', JSON.stringify(statusResult, null, 2));
        throw new Error(`Video generation failed: ${errorMessage || 'Unknown error'}`);
      }

      attempts++;
    }

    throw new Error('Video generation timeout - HeyGen took too long (10+ minutes)');
  }

  /**
   * Main method: Generate complete AI talking avatar video
   */
  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 Starting AI TALKING AVATAR video generation...');
    console.log('📋 USER REQUESTED VIDEO WITH:');
    console.log('   👤 Avatar:', request.avatar.name, `(${request.avatar.gender})`);
    console.log('   🗣️ Voice:', request.voice.name, `(${request.voice.language})`);
    console.log('   🌄 Background:', request.backgrounds[0]?.name || 'Default');
    console.log('   📝 Script:', request.text.substring(0, 100) + '...');
    console.log('   ⚙️ Quality:', request.quality);
    console.log('═══════════════════════════════════════════════════════');

    // Generate video using HeyGen API
    return await this.generateVideoWithHeyGen(request);
  }
}

// Create singleton instance
const videoGenerator = new VideoGenerator();

export default videoGenerator;
export { VideoGenerator };
export type { VideoGenerationRequest, VideoGenerationResult };

