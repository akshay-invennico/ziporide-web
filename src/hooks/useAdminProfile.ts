import type { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  AdminProfileData,
  AdminProfileResponse,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from '@/types/user.types';

interface ApiError {
  message: string;
}

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<AdminProfileResponse>(API.ADMIN_ME);
      setProfile(data.data);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to fetch profile.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setIsLoading(true);
    try {
      await apiClient.patch(API.UPDATE_PROFILE, payload);
      showToast('Profile updated successfully!', 'success');
      await getProfile(); // Refresh profile data
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to update profile.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (payload: UpdatePasswordPayload) => {
    setIsLoading(true);
    try {
      await apiClient.patch(API.UPDATE_PASSWORD, payload);
      showToast('Password updated successfully!', 'success');
      return true;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to update password.';
      showToast(message, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    getProfile,
    updateProfile,
    updatePassword,
  };
};
