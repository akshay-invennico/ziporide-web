import { useState } from 'react';

import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('images', file);

      const response = await apiClient.post(API.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;

      if (data.data && Array.isArray(data.data.images) && data.data.images.length > 0) {
        return data.data.images[0];
      }

      if (typeof data.data === 'string') {
        return data.data;
      }
      if (data.data && typeof data.data.url === 'string') {
        return data.data.url;
      }

      if (typeof data === 'string') {
        return data;
      }

      throw new Error('Unrecognized upload response format');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      setError(errorMessage);
      console.error('Image upload failed:', err);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
