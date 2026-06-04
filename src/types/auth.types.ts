import type { ModuleAccess } from './operator.types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  operatorId?: string;
  email: string;
  name: string;
  role: string;
  moduleAccess?: ModuleAccess;
  permissions?: string[];
  status?: string;
  profile?: string | null;
}

export interface TokenDetails {
  token: string;
  expires: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    tokens: {
      access: TokenDetails;
      refresh: TokenDetails;
    };
    user: AuthUser;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}
