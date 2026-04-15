import type { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/context/useAuth';
import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import type {
  OperatorProfile,
  OperatorProfileResponse,
  UpdateOperatorProfilePayload,
  UpdatePasswordPayload,
} from '@/types/user.types';

interface ApiError {
  message: string;
}

export const useAdminProfile = () => {
  const [profile, setProfile] = useState<OperatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updateAuth } = useAuth();
  const { showToast } = useToast();

  const isFetchingRef = useRef(false);

  const getProfile = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const { data } = await apiClient.get<OperatorProfileResponse>(API.OPERATOR_ME);
      const operator = data.data.operator;
      setProfile(operator);
      updateAuth({
        name: operator.name,
        profile: operator.profilePhotoUrl,
      });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to fetch profile.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [showToast, updateAuth]);

  const updateProfile = useCallback(
    async (payload: UpdateOperatorProfilePayload) => {
      setIsLoading(true);
      try {
        await apiClient.patch(API.OPERATOR_ME, payload);
        showToast('Profile updated successfully!', 'success');
        updateAuth({
          name: payload.name,
          profile: payload.profilePhotoUrl,
        });
        await getProfile();
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message || 'Failed to update profile.';
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast, updateAuth, getProfile],
  );

  const updatePassword = useCallback(
    async (payload: UpdatePasswordPayload) => {
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
    },
    [showToast],
  );

  return {
    profile,
    isLoading,
    getProfile,
    updateProfile,
    updatePassword,
  };
};
