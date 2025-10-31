// Avatar Service - HeyGen Compatible (Only Marcus)
export interface Avatar {
  id: string;
  name: string;
  image: string;
  gender: 'male' | 'female' | 'neutral';
  language: string;
  voice: {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'neutral';
    language: string;
  };
  personality?: string;
  description?: string;
}

class AvatarService {
  private baseURL: string = 'https://character.ai/api';

  constructor() {
    // HeyGen compatible avatar service
  }

  // Get available avatars - only Marcus (HeyGen compatible)
  async getAvatars(): Promise<Avatar[]> {
    try {
      console.log('Loading Marcus avatar (HeyGen compatible)...');
      
      // Only Marcus avatar available (HeyGen compatible)
      const avatars: Avatar[] = [
        {
          id: 'char-ai-marcus-002',
          name: 'Marcus',
          image: '/avatars/Marcus.png',
          gender: 'male',
          language: 'en',
          personality: 'Confident & Charismatic',
          description: 'A cheerful Man in a professional kitchen',
          voice: {
            id: 'Ak9WvlDj5TXD6zyDtpXG', // HeyGen voice ID from video-generator
            name: 'Marcus Voice',
            gender: 'male',
            language: 'English'
          }
        }
      ];

      console.log('Marcus avatar loaded (HeyGen compatible):', avatars.length);
      return avatars;
    } catch (error: any) {
      console.error('Error loading avatars:', error.message);
      throw new Error('Failed to load avatars');
    }
  }

  // Get fallback avatars - only Marcus (HeyGen compatible)
  getFallbackAvatars(): Avatar[] {
    return [
      {
        id: 'char-fallback-marcus-001',
        name: 'Marcus',
        image: '/avatars/Marcus.png',
        gender: 'male',
        language: 'en',
        personality: 'Confident & Charismatic',
        description: 'A cheerful Man in a professional kitchen',
        voice: {
          id: 'Ak9WvlDj5TXD6zyDtpXG', // HeyGen voice ID from video-generator
          name: 'Marcus Voice',
          gender: 'male',
          language: 'English'
        }
      }
    ];
  }

  // Generate custom avatar URL (for future use)
  generateAvatarURL(avatarId: string): string {
    return `https://models.readyplayer.me/${avatarId}.png`;
  }
}

// Create singleton instance
const avatarService = new AvatarService();

export default avatarService;
