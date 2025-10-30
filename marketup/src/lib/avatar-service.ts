// Avatar Service - Character AI Style Avatars
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
    // Character AI integration
  }

  // Get available avatars inspired by Character AI
  async getAvatars(): Promise<Avatar[]> {
    try {
      console.log('Loading Character AI style avatars...');
      
      // Character AI inspired avatars with diverse personalities
      const avatars: Avatar[] = [
        {
          id: 'char-ai-sophia-001',
          name: 'Sophia',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=b6e3f4',
          gender: 'female',
          language: 'en',
          personality: 'Professional & Friendly',
          description: 'Expert business consultant with warm personality',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'char-ai-marcus-002',
          name: 'Marcus',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede',
          gender: 'male',
          language: 'en',
          personality: 'Confident & Charismatic',
          description: 'Dynamic sales professional and motivational speaker',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'char-ai-luna-003',
          name: 'Luna',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=ffd5dc',
          gender: 'female',
          language: 'en',
          personality: 'Creative & Inspiring',
          description: 'Artistic content creator with unique perspective',
          voice: {
            id: 'en-US-JennyNeural',
            name: 'Jenny',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'char-ai-alex-004',
          name: 'Alex',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=d1d4f9',
          gender: 'neutral',
          language: 'en',
          personality: 'Tech-Savvy & Analytical',
          description: 'Knowledgeable tech expert and problem solver',
          voice: {
            id: 'en-US-DavisNeural',
            name: 'Davis',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'char-ai-isabella-005',
          name: 'Isabella',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=ffdfbf',
          gender: 'female',
          language: 'en',
          personality: 'Elegant & Sophisticated',
          description: 'Refined presenter with executive presence',
          voice: {
            id: 'en-US-EmmaNeural',
            name: 'Emma',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'char-ai-james-006',
          name: 'James',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c7ceea',
          gender: 'male',
          language: 'en',
          personality: 'Trustworthy & Reliable',
          description: 'Dependable narrator with strong voice',
          voice: {
            id: 'en-US-BrianNeural',
            name: 'Brian',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'char-ai-maya-007',
          name: 'Maya',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=b5ead7',
          gender: 'female',
          language: 'en',
          personality: 'Energetic & Upbeat',
          description: 'Vibrant personality perfect for engaging content',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'char-ai-kai-008',
          name: 'Kai',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=a8e6cf',
          gender: 'male',
          language: 'en',
          personality: 'Calm & Thoughtful',
          description: 'Mindful presenter with soothing presence',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        },
        // Anime-style avatars
        {
          id: 'anime-sakura-009',
          name: 'Sakura',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sakura&backgroundColor=ffb3d9',
          gender: 'female',
          language: 'en',
          personality: 'Cheerful & Kawaii',
          description: 'Adorable anime host with bubbly energy',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'anime-ryu-010',
          name: 'Ryu',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ryu&backgroundColor=b8e6ff',
          gender: 'male',
          language: 'en',
          personality: 'Heroic & Determined',
          description: 'Brave anime character with strong spirit',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'anime-yuki-011',
          name: 'Yuki',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki&backgroundColor=e6d5ff',
          gender: 'female',
          language: 'en',
          personality: 'Mysterious & Elegant',
          description: 'Graceful anime presenter with captivating charm',
          voice: {
            id: 'en-US-JennyNeural',
            name: 'Jenny',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'anime-hiro-012',
          name: 'Hiro',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hiro&backgroundColor=ffd4a3',
          gender: 'male',
          language: 'en',
          personality: 'Smart & Witty',
          description: 'Genius anime character with quick thinking',
          voice: {
            id: 'en-US-DavisNeural',
            name: 'Davis',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'anime-miku-013',
          name: 'Miku',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Miku&backgroundColor=a3f7bf',
          gender: 'female',
          language: 'en',
          personality: 'Musical & Dreamy',
          description: 'Artistic anime performer with melodic voice',
          voice: {
            id: 'en-US-EmmaNeural',
            name: 'Emma',
            gender: 'female',
            language: 'English'
          }
        },
        // Creative & Fantasy avatars
        {
          id: 'fantasy-phoenix-014',
          name: 'Phoenix',
          image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix&backgroundColor=ff6b35',
          gender: 'neutral',
          language: 'en',
          personality: 'Legendary & Inspiring',
          description: 'Mythical presenter rising from creative ashes',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'cyber-nova-015',
          name: 'Nova',
          image: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Nova&backgroundColor=00d9ff',
          gender: 'neutral',
          language: 'en',
          personality: 'Futuristic & Innovative',
          description: 'AI-powered host from the digital future',
          voice: {
            id: 'en-US-JennyNeural',
            name: 'Jenny',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'myth-atlas-016',
          name: 'Atlas',
          image: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Atlas&backgroundColor=8b5cf6',
          gender: 'male',
          language: 'en',
          personality: 'Strong & Reliable',
          description: 'Titan of knowledge bearing wisdom for all',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'retro-pixel-017',
          name: 'Pixel',
          image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel&backgroundColor=fbbf24',
          gender: 'neutral',
          language: 'en',
          personality: 'Nostalgic & Fun',
          description: '8-bit gaming legend with retro charm',
          voice: {
            id: 'en-US-DavisNeural',
            name: 'Davis',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'space-cosmo-018',
          name: 'Cosmo',
          image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cosmo&backgroundColor=1e1b4b',
          gender: 'neutral',
          language: 'en',
          personality: 'Cosmic & Visionary',
          description: 'Interstellar explorer sharing universal truths',
          voice: {
            id: 'en-US-BrianNeural',
            name: 'Brian',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: 'spirit-aurora-019',
          name: 'Aurora',
          image: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Aurora&backgroundColor=a78bfa',
          gender: 'female',
          language: 'en',
          personality: 'Ethereal & Enchanting',
          description: 'Celestial spirit illuminating paths with beauty',
          voice: {
            id: 'en-US-EmmaNeural',
            name: 'Emma',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'mystic-sage-020',
          name: 'Sage',
          image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sage&backgroundColor=10b981',
          gender: 'neutral',
          language: 'en',
          personality: 'Wise & Mystical',
          description: 'Ancient wisdom keeper with modern insights',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: 'elemental-blaze-021',
          name: 'Blaze',
          image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Blaze&backgroundColor=ef4444',
          gender: 'male',
          language: 'en',
          personality: 'Fiery & Passionate',
          description: 'Elemental force bringing energy to every word',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        }
      ];

      console.log('All avatars loaded (Character AI, Anime & Creative):', avatars.length);
      return avatars;
    } catch (error: any) {
      console.error('Error loading avatars:', error.message);
      throw new Error('Failed to load avatars');
    }
  }

  // Get fallback avatars with Character AI & Anime style
  getFallbackAvatars(): Avatar[] {
    return [
      {
        id: 'char-fallback-sophia-001',
        name: 'Sophia',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia&backgroundColor=b6e3f4',
        gender: 'female',
        language: 'en',
        personality: 'Professional',
        voice: {
          id: 'en-US-AriaNeural',
          name: 'Aria',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'char-fallback-david-002',
        name: 'David',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=David&backgroundColor=c0aede',
        gender: 'male',
        language: 'en',
        personality: 'Confident',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male',
          language: 'English'
        }
      },
      {
        id: 'char-fallback-emma-003',
        name: 'Emma',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Emma&backgroundColor=ffd5dc',
        gender: 'female',
        language: 'en',
        personality: 'Friendly',
        voice: {
          id: 'en-US-JennyNeural',
          name: 'Jenny',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'char-fallback-alex-004',
        name: 'Alex',
        image: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Alex&backgroundColor=d1d4f9',
        gender: 'neutral',
        language: 'en',
        personality: 'Analytical',
        voice: {
          id: 'en-US-DavisNeural',
          name: 'Davis',
          gender: 'male',
          language: 'English'
        }
      },
      // Anime-style fallbacks
      {
        id: 'anime-fallback-sakura-005',
        name: 'Sakura',
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SakuraFallback&backgroundColor=ffb3d9',
        gender: 'female',
        language: 'en',
        personality: 'Kawaii',
        voice: {
          id: 'en-US-AriaNeural',
          name: 'Aria',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'anime-fallback-ryu-006',
        name: 'Ryu',
        image: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RyuFallback&backgroundColor=b8e6ff',
        gender: 'male',
        language: 'en',
        personality: 'Heroic',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male',
          language: 'English'
        }
      },
      // Creative fallbacks
      {
        id: 'creative-fallback-phoenix-007',
        name: 'Phoenix',
        image: 'https://api.dicebear.com/7.x/bottts/svg?seed=PhoenixFallback&backgroundColor=ff6b35',
        gender: 'neutral',
        language: 'en',
        personality: 'Legendary',
        voice: {
          id: 'en-US-AriaNeural',
          name: 'Aria',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'creative-fallback-pixel-008',
        name: 'Pixel',
        image: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelFallback&backgroundColor=fbbf24',
        gender: 'neutral',
        language: 'en',
        personality: 'Retro',
        voice: {
          id: 'en-US-DavisNeural',
          name: 'Davis',
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
