import axios from 'axios';

export interface DIDAvatar {
  id: string;
  name: string;
  gender: 'male' | 'female';
  language: string;
  voice: {
    id: string;
    name: string;
    gender: 'male' | 'female';
    language: string;
  };
}

export interface DIDVideoRequest {
  source_url: string;
  script: {
    type: 'text';
    input: string;
    provider?: {
      type: 'microsoft';
      voice_id: string;
    };
  };
  config: {
    result_format: 'mp4';
    quality: 'high' | 'medium' | 'low';
  };
}

export interface DIDVideoResponse {
  id: string;
  status: 'created' | 'started' | 'done' | 'error';
  result_url?: string;
  error?: string;
}

class DIDClient {
  private apiKey: string;
  private baseURL = 'https://api.d-id.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    // D-ID API uses Basic Auth with API key already in username:password format
    const encodedAuth = Buffer.from(this.apiKey).toString('base64');
    return {
      'Authorization': `Basic ${encodedAuth}`,
      'Content-Type': 'application/json',
    };
  }

  // Get available avatars
  async getAvatars(): Promise<DIDAvatar[]> {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new Error('D-ID API key not configured');
      }

      console.log('D-ID API Key:', this.apiKey.substring(0, 20) + '...');
      console.log('D-ID Headers:', this.getHeaders());
      console.log('D-ID Base URL:', this.baseURL);
      console.log('D-ID Full URL:', `${this.baseURL}/presenters`);

      const response = await axios.get(`${this.baseURL}/presenters`, {
        headers: this.getHeaders(),
      });

      // Handle different response formats
      const data = response.data;
      console.log('D-ID API Response:', JSON.stringify(data, null, 2));
      
      // If it's an array, map it directly
      if (Array.isArray(data)) {
        return data.map((avatar: any) => ({
          id: avatar.id || avatar.presenter_id || 'unknown',
          name: avatar.name || avatar.presenter_name || 'Unknown',
          gender: avatar.gender || 'unknown',
          language: avatar.language || 'en',
          voice: {
            id: avatar.voice?.id || 'default',
            name: avatar.voice?.name || 'Default Voice',
            gender: avatar.voice?.gender || avatar.gender || 'unknown',
            language: avatar.voice?.language || avatar.language || 'en',
          },
        }));
      }
      
      // If it's an object with a data property
      if (data.data && Array.isArray(data.data)) {
        return data.data.map((avatar: any) => ({
          id: avatar.id || avatar.presenter_id || 'unknown',
          name: avatar.name || avatar.presenter_name || 'Unknown',
          gender: avatar.gender || 'unknown',
          language: avatar.language || 'en',
          voice: {
            id: avatar.voice?.id || 'default',
            name: avatar.voice?.name || 'Default Voice',
            gender: avatar.voice?.gender || avatar.gender || 'unknown',
            language: avatar.voice?.language || avatar.language || 'en',
          },
        }));
      }
      
      // Fallback: return empty array
      console.log('Unexpected response format from D-ID API');
      return [];
    } catch (error: any) {
      console.error('Error fetching avatars:', error.response?.data || error.message);
      throw new Error('Failed to fetch avatars');
    }
  }

  // Create a video
  async createVideo(request: DIDVideoRequest): Promise<DIDVideoResponse> {
    try {
      // Check if API key is configured
      if (!this.apiKey) {
        throw new Error('D-ID API key not configured');
      }

      const response = await axios.post(`${this.baseURL}/talks`, request, {
        headers: this.getHeaders(),
      });

      return {
        id: response.data.id,
        status: response.data.status,
        result_url: response.data.result_url,
        error: response.data.error,
      };
    } catch (error: any) {
      console.error('Error creating video:', error.response?.data || error.message);
      throw new Error('Failed to create video');
    }
  }

  // Get video status
  async getVideoStatus(videoId: string): Promise<DIDVideoResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/talks/${videoId}`, {
        headers: this.getHeaders(),
      });

      return {
        id: response.data.id,
        status: response.data.status,
        result_url: response.data.result_url,
        error: response.data.error,
      };
    } catch (error: any) {
      console.error('Error fetching video status:', error.response?.data || error.message);
      throw new Error('Failed to fetch video status');
    }
  }

  // Get video result
  async getVideoResult(videoId: string): Promise<string> {
    try {
      const status = await this.getVideoStatus(videoId);
      
      if (status.status === 'done' && status.result_url) {
        return status.result_url;
      } else if (status.status === 'error') {
        throw new Error(status.error || 'Video generation failed');
      } else {
        throw new Error('Video is still processing');
      }
    } catch (error) {
      console.error('Error getting video result:', error);
      throw error;
    }
  }
}

// Create singleton instance
const didClient = new DIDClient(process.env.DID_API_KEY || '');

export default didClient;
