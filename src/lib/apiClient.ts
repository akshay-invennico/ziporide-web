import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

import { routes } from '@/routes/routes';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const authRoutes = [
        routes.LOGIN,
        routes.FORGOT_PASSWORD,
        routes.VERIFY_OTP,
        routes.RESET_PASSWORD,
      ];

      if (!authRoutes.includes(window.location.pathname as any)) {
        window.location.href = routes.LOGIN;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
