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
    // You should set these in your environment variables
    this.CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
    this.UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
  }

  /**
   * Upload an image directly to Cloudinary from the browser
   * @param file The file to upload
   * @returns The upload response or an error
   */
  async uploadImage(file: File): Promise<{ url: string; id: string } | CloudinaryError> {
    if (!this.CLOUD_NAME || !this.UPLOAD_PRESET) {
      return { message: 'Cloudinary configuration is missing' };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    try {
      // Direct upload to Cloudinary
      const response = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
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
        message: error.response?.data?.error?.message || 'Failed to upload image'
      };
    }
  }

  /**
   * Get the Cloudinary configuration
   * @returns The Cloudinary configuration
   */
  getConfig() {
    return {
      cloudName: this.CLOUD_NAME,
      uploadPreset: this.UPLOAD_PRESET
    };
  }
}

export default new CloudinaryService();