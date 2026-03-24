import { createContext } from 'react';

import type { AuthState, AuthUser } from '@/types/auth.types';

export interface AuthContextValue extends AuthState {
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
