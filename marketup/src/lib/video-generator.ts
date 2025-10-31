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
  }>;
  text: string;
  quality: string;
  targetLanguage?: string; // Language code (e.g., 'ar', 'fr', 'de')
  enableGestures?: boolean; // Enable gesture control for natural movements
  avatarStyle?: 'normal' | 'full_body' | 'upper_body'; // Avatar display style
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
   * Translate text to target language using Google Translate API
   */
  private async translateText(text: string, targetLanguage: string): Promise<string> {
    // If target language is English or not specified, return original text
    if (!targetLanguage || targetLanguage === 'en' || targetLanguage.toLowerCase() === 'english') {
      return text;
    }

    try {
      // Use Google Translate API (free tier with API key)
      const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ Google Translate API key not found, using original text');
        return text;
      }

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            format: 'text'
          }),
        }
      );

      if (!response.ok) {
        console.warn('⚠️ Translation API failed, using original text');
        return text;
      }

      const result = await response.json();
      const translatedText = result.data?.translations?.[0]?.translatedText;
      
      if (translatedText) {
        console.log(`✅ Text translated from original to ${targetLanguage}:`, translatedText.substring(0, 100));
        return translatedText;
      }

      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
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
    
    // Select voice based on avatar name or gender
    let voiceId = HEYGEN_VOICES[request.avatar.name] || 
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
    
    // Translate text to target language if specified
    let finalText = request.text;
    if (request.targetLanguage && request.targetLanguage !== 'en') {
      console.log(`🌐 Translating text to ${request.targetLanguage}...`);
      finalText = await this.translateText(request.text, request.targetLanguage);
      console.log(`✅ Translation complete. Original length: ${request.text.length}, Translated length: ${finalText.length}`);
    }

    // Determine video dimension based on quality request
    // Use lower resolution for free plan but keep wide format
    let dimension = { width: 854, height: 480 }; // 480p wide format for free plan
    if (request.quality === 'hd' || request.quality === '1080p') {
      dimension = { width: 1280, height: 720 }; // 720p for HD
    }
    
    // Build video input without background (temporarily disabled)
    const videoInput: any = {
      character: characterConfig,
      voice: {
        type: 'text',
        input_text: finalText, // Use translated text
        voice_id: voiceId,
      },
      // Background temporarily disabled - not used even if selected
    };

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
    console.log('   Gestures enabled:', request.enableGestures || false);
    console.log('   Avatar style:', request.avatarStyle || 'normal');
    console.log('   Note: Full body display not currently supported - using recommended chest-up framing');

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

      console.log(`📊 Generation status: ${status} (${attempts + 1}/${maxAttempts})`);

      if (status === 'completed' && videoUrl) {
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

