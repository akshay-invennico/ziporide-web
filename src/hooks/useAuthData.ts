import { type AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';
import { useToast } from '@/context/useToast';
import { API } from '@/lib/api';
import apiClient from '@/lib/apiClient';
import { routes } from '@/routes/routes';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '@/types/auth.types';
import type { OperatorLoginResponse } from '@/types/operator.types';

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
      const { data } = await apiClient.post<OperatorLoginResponse>(API.OPERATOR_LOGIN, payload);
      const operator = data.data.operator;
      setAuth(
        {
          id: operator.id,
          operatorId: operator.operatorId,
          email: operator.email,
          name: operator.name,
          role: operator.role,
          permissions: operator.permissions,
          status: operator.status,
        },
        data.data.tokens.access.token,
      );
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

  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    setIsLoading(true);
    try {
      await apiClient.post(API.FORGOT_PASSWORD, payload);
      showToast('Verification code sent to email!', 'success');
      navigate(routes.VERIFY_OTP, { state: { email: payload.email } });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to send verification code.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (payload: VerifyOtpPayload) => {
    setIsLoading(true);
    try {
      await apiClient.post(API.VERIFY_OTP, payload);
      showToast('OTP verified successfully!', 'success');
      navigate(routes.RESET_PASSWORD, { state: { email: payload.email, otp: payload.otp } });
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to verify OTP.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload) => {
    setIsLoading(true);
    try {
      await apiClient.post(API.RESET_PASSWORD, payload);
      showToast('Password reset successfully!', 'success');
      navigate(routes.LOGIN);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Failed to reset password.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, forgotPassword, verifyOtp, resetPassword, isLoading };
};
