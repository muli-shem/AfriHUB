import axios from 'axios';

// Define the type for the upload response
interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  asset_id: string;
  version: number;
  format: string;
}

// Define the type for the upload error
interface CloudinaryError {
  message: string;
}

class CloudinaryService {
  private readonly CLOUD_NAME: string;
  private readonly UPLOAD_PRESET: string;

  constructor() {
    this.CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    this.UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  }

  async uploadImage(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; id: string } | CloudinaryError> {
    if (!this.CLOUD_NAME || !this.UPLOAD_PRESET) {
      return { message: 'Cloudinary configuration is missing' };
    }

    // File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return { message: 'File is too large. Maximum size is 5MB.' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    try {
      const response = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000, // 2 minutes timeout
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress?.(percentCompleted);
          }
        }
      );

      return {
        url: response.data.secure_url,
        id: response.data.public_id
      };
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      
      return { 
        message: error.code === 'ECONNABORTED' 
          ? 'Upload timed out. Check your internet connection.' 
          : error.response?.data?.error?.message || 'Failed to upload image' 
      };
    }
  }

  getConfig() {
    return {
      cloudName: this.CLOUD_NAME,
      uploadPreset: this.UPLOAD_PRESET
    };
  }
}

export default new CloudinaryService();