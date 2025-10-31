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

  // Get available avatars - Marcus and Bob (HeyGen compatible)
  async getAvatars(): Promise<Avatar[]> {
    try {
      console.log('Loading avatars (HeyGen compatible)...');
      
      const avatars: Avatar[] = [
        {
          id: '285f8a71dcd14421a7e4ecda88d78610', // Marcus HeyGen ID
          name: 'Marcus',
          image: '/avatars/Marcus.png',
          gender: 'male',
          language: 'en',
          personality: 'Confident & Charismatic',
          description: 'A cheerful Man in a professional kitchen',
          voice: {
            id: 'Ak9WvlDj5TXD6zyDtpXG', // HeyGen voice ID
            name: 'Marcus Voice',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: '8fb979fae61f487297620072ff19e6b5', // Bob HeyGen ID
          name: 'Bob',
          image: '/avatars/Bob.png',
          gender: 'male',
          language: 'en',
          personality: 'Professional & Friendly',
          description: 'A professional presenter',
          voice: {
            id: '2yPUSv5lTtXwpjGQBuZO', // HeyGen voice ID
            name: 'Bob Voice',
            gender: 'male',
            language: 'English'
          }
        }
      ];

      console.log('Avatars loaded (HeyGen compatible):', avatars.length);
      return avatars;
    } catch (error: any) {
      console.error('Error loading avatars:', error.message);
      throw new Error('Failed to load avatars');
    }
  }

  // Get fallback avatars - Marcus and Bob (HeyGen compatible)
  getFallbackAvatars(): Avatar[] {
    return [
      {
        id: '285f8a71dcd14421a7e4ecda88d78610', // Marcus HeyGen ID
        name: 'Marcus',
        image: '/avatars/Marcus.png',
        gender: 'male',
        language: 'en',
        personality: 'Confident & Charismatic',
        description: 'A cheerful Man in a professional kitchen',
        voice: {
          id: 'Ak9WvlDj5TXD6zyDtpXG', // HeyGen voice ID
          name: 'Marcus Voice',
          gender: 'male',
          language: 'English'
        }
      },
      {
        id: '8fb979fae61f487297620072ff19e6b5', // Bob HeyGen ID
        name: 'Bob',
        image: '/avatars/Bob.png',
        gender: 'male',
        language: 'en',
        personality: 'Professional & Friendly',
        description: 'A professional presenter',
        voice: {
          id: '2yPUSv5lTtXwpjGQBuZO', // HeyGen voice ID
          name: 'Bob Voice',
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
