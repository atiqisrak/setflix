/**
 * User API functions
 */

import { apiClient } from './client';

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  preferredProviderId?: string | null;
  recentFilters?: any;
  recentSearches?: any;
  themePreference?: string;
  autoplayNext?: boolean;
}

export const userApi = {
  async updateUser(data: UpdateUserInput) {
    return apiClient.put<{ user: any }>('/users/me', data);
  },

  async changePassword(data: ChangePasswordInput) {
    return apiClient.post<{ message: string }>('/auth/change-password', data);
  },

  async getPreferences() {
    return apiClient.get<{ preferences: any }>('/preferences');
  },

  async updatePreferences(data: UserPreferences) {
    return apiClient.put<{ preferences: any }>('/preferences', data);
  },
};

