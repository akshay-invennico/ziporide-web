import { type AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import { routes } from '@/routes/routes';
import type { LoginPayload, LoginResponse } from '@/types/auth.types';

interface ApiError {
  message: string;
}

export const useAuthData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post<LoginResponse>(API.LOGIN, payload);
      setAuth(data.user, data.token);
      showToast('Login successful!', 'success');
      navigate(routes.DASHBOARD);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
