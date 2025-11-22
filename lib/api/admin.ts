/**
 * Admin API functions
 */

import { apiClient } from './client';

// Users
export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    profiles: number;
    myList: number;
    watchHistory: number;
  };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

export const adminApi = {
  // Users
  users: {
    async list(filters?: { search?: string; role?: string; emailVerified?: boolean; limit?: number; offset?: number }): Promise<AdminUsersResponse> {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.role) params.append('role', filters.role);
      if (filters?.emailVerified !== undefined) params.append('emailVerified', String(filters.emailVerified));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return apiClient.get<AdminUsersResponse>(`/admin/users?${params.toString()}`);
    },
    async get(id: string): Promise<{ user: AdminUser }> {
      return apiClient.get<{ user: AdminUser }>(`/admin/users/${id}`);
    },
    async update(id: string, data: { name?: string; email?: string; role?: string; emailVerified?: boolean }): Promise<{ user: AdminUser }> {
      return apiClient.put<{ user: AdminUser }>(`/admin/users/${id}`, data);
    },
    async delete(id: string): Promise<{ message: string }> {
      return apiClient.delete<{ message: string }>(`/admin/users/${id}`);
    },
    async getActivity(id: string, limit?: number): Promise<{ activity: any }> {
      const params = limit ? `?limit=${limit}` : '';
      return apiClient.get<{ activity: any }>(`/admin/users/${id}/activity${params}`);
    },
    async getStats(id: string): Promise<{ stats: any }> {
      return apiClient.get<{ stats: any }>(`/admin/users/${id}/stats`);
    },
  },

  // Providers
  providers: {
    async list(filters?: { enabled?: boolean; type?: string; search?: string; limit?: number; offset?: number }): Promise<any> {
      const params = new URLSearchParams();
      if (filters?.enabled !== undefined) params.append('enabled', String(filters.enabled));
      if (filters?.type) params.append('type', filters.type);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return apiClient.get(`/admin/providers?${params.toString()}`);
    },
    async get(id: string): Promise<any> {
      return apiClient.get(`/admin/providers/${id}`);
    },
    async create(data: { id: string; name: string; url: string; type: string; region?: string | null; enabled?: boolean; priority?: number }): Promise<any> {
      return apiClient.post('/admin/providers', data);
    },
    async update(id: string, data: { name?: string; url?: string; type?: string; region?: string | null; enabled?: boolean; priority?: number }): Promise<any> {
      return apiClient.put(`/admin/providers/${id}`, data);
    },
    async delete(id: string): Promise<{ message: string }> {
      return apiClient.delete(`/admin/providers/${id}`);
    },
    async toggle(id: string): Promise<any> {
      return apiClient.post(`/admin/providers/${id}/toggle`);
    },
    async getHealthLogs(id: string, limit?: number): Promise<any> {
      const params = limit ? `?limit=${limit}` : '';
      return apiClient.get(`/admin/providers/${id}/health${params}`);
    },
  },

  // Channels
  channels: {
    async list(filters?: { providerId?: string; category?: string; country?: string; isActive?: boolean; search?: string; limit?: number; offset?: number }): Promise<any> {
      const params = new URLSearchParams();
      if (filters?.providerId) params.append('providerId', filters.providerId);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.country) params.append('country', filters.country);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.search) params.append('search', filters.search);
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.offset) params.append('offset', String(filters.offset));
      return apiClient.get(`/admin/channels?${params.toString()}`);
    },
    async get(id: string): Promise<any> {
      return apiClient.get(`/admin/channels/${id}`);
    },
    async update(id: string, data: any): Promise<any> {
      return apiClient.put(`/admin/channels/${id}`, data);
    },
    async delete(id: string): Promise<{ message: string }> {
      return apiClient.delete(`/admin/channels/${id}`);
    },
    async bulkUpdate(data: { channelIds: string[]; isActive?: boolean; category?: string | null }): Promise<any> {
      return apiClient.post('/admin/channels/bulk-update', data);
    },
    async getStats(): Promise<any> {
      return apiClient.get('/admin/channels/stats');
    },
  },

  // Analytics
  analytics: {
    async getOverview(): Promise<any> {
      return apiClient.get('/admin/analytics/overview');
    },
    async getUserAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      return apiClient.get(`/admin/analytics/users?${params.toString()}`);
    },
    async getUsageAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      return apiClient.get(`/admin/analytics/usage?${params.toString()}`);
    },
    async getProviderPerformance(): Promise<any> {
      return apiClient.get('/admin/analytics/providers');
    },
  },

  // Settings
  settings: {
    async getHomepageSettings(): Promise<any> {
      return apiClient.get('/admin/settings/homepage');
    },
    async updateHomepageSettings(data: { theme: 'sports' | 'news' | 'entertainment'; heroImages: string[]; heroTitles: string[]; heroDescriptions: string[] }): Promise<any> {
      return apiClient.put('/admin/settings/homepage', data);
    },
    async getSystemHealth(): Promise<any> {
      return apiClient.get('/admin/settings/system/health');
    },
    async getSystemStats(): Promise<any> {
      return apiClient.get('/admin/settings/system/stats');
    },
  },
};

