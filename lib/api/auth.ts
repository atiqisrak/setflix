/**
 * Auth API functions
 */

import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface OAuthInput {
  provider: 'google' | 'github';
  oauthId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export const authApi = {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setTokensFromResponse(response.token, response.refreshToken);
    return response;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    apiClient.setTokensFromResponse(response.token, response.refreshToken);
    return response;
  },

  async oauthLogin(data: OAuthInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `/auth/oauth/${data.provider}`,
      data
    );
    apiClient.setTokensFromResponse(response.token, response.refreshToken);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearAuth();
    }
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<{ user: User }>('/auth/me').then((res) => res.user);
  },

  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('setflix-refresh-token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await apiClient.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
    if (response.token) {
      localStorage.setItem('setflix-token', response.token);
    }
    return response;
  },
};

