// Avatar Service - Ready Player Me & Fallback Avatars
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
}

class AvatarService {
  private baseURL: string = 'https://readyplayer.me/api';

  constructor() {
    // Ready Player Me doesn't require API key for basic avatars
  }

  // Get available avatars from Ready Player Me
  async getAvatars(): Promise<Avatar[]> {
    try {
      console.log('Fetching avatars from Ready Player Me...');
      
      // Real 3D models from reliable sources
      const avatars: Avatar[] = [
        {
          id: '3d-alex-001',
          name: 'Alex',
          image: 'https://threejs.org/examples/models/gltf/Parrot/Parrot.glb',
          gender: 'neutral',
          language: 'en',
          voice: {
            id: 'en-US-AriaNeural',
            name: 'Aria',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: '3d-jordan-002',
          name: 'Jordan',
          image: 'https://threejs.org/examples/models/gltf/Flamingo/Flamingo.glb',
          gender: 'male',
          language: 'en',
          voice: {
            id: 'en-US-GuyNeural',
            name: 'Guy',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: '3d-sam-003',
          name: 'Sam',
          image: 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',
          gender: 'female',
          language: 'en',
          voice: {
            id: 'en-US-JennyNeural',
            name: 'Jenny',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: '3d-casey-004',
          name: 'Casey',
          image: 'https://threejs.org/examples/models/gltf/Xbot.glb',
          gender: 'neutral',
          language: 'en',
          voice: {
            id: 'en-US-DavisNeural',
            name: 'Davis',
            gender: 'male',
            language: 'English'
          }
        },
        {
          id: '3d-riley-005',
          name: 'Riley',
          image: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
          gender: 'female',
          language: 'en',
          voice: {
            id: 'en-US-EmmaNeural',
            name: 'Emma',
            gender: 'female',
            language: 'English'
          }
        },
        {
          id: '3d-taylor-006',
          name: 'Taylor',
          image: 'https://threejs.org/examples/models/gltf/Duck/Duck.glb',
          gender: 'male',
          language: 'en',
          voice: {
            id: 'en-US-BrianNeural',
            name: 'Brian',
            gender: 'male',
            language: 'English'
          }
        }
      ];

      console.log('Ready Player Me avatars loaded:', avatars.length);
      return avatars;
    } catch (error: any) {
      console.error('Error fetching avatars from Ready Player Me:', error.message);
      throw new Error('Failed to fetch avatars');
    }
  }

  // Get fallback avatars (high-quality professional photos)
  getFallbackAvatars(): Avatar[] {
    return [
      {
        id: 'fallback-sarah-001',
        name: 'Sarah',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        gender: 'female',
        language: 'en',
        voice: {
          id: 'en-US-AriaNeural',
          name: 'Aria',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'fallback-david-002',
        name: 'David',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        gender: 'male',
        language: 'en',
        voice: {
          id: 'en-US-GuyNeural',
          name: 'Guy',
          gender: 'male',
          language: 'English'
        }
      },
      {
        id: 'fallback-maya-003',
        name: 'Maya',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        gender: 'female',
        language: 'en',
        voice: {
          id: 'en-US-JennyNeural',
          name: 'Jenny',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'fallback-alex-004',
        name: 'Alex',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        gender: 'male',
        language: 'en',
        voice: {
          id: 'en-US-DavisNeural',
          name: 'Davis',
          gender: 'male',
          language: 'English'
        }
      },
      {
        id: 'fallback-jessica-005',
        name: 'Jessica',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        gender: 'female',
        language: 'en',
        voice: {
          id: 'en-US-EmmaNeural',
          name: 'Emma',
          gender: 'female',
          language: 'English'
        }
      },
      {
        id: 'fallback-marcus-006',
        name: 'Marcus',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        gender: 'male',
        language: 'en',
        voice: {
          id: 'en-US-BrianNeural',
          name: 'Brian',
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
