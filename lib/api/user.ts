const PREFS_KEY = "setflix-guest-preferences";

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
    if (typeof window !== "undefined") {
      if (data.name !== undefined)
        localStorage.setItem("setflix-guest-name", data.name || "");
      if (data.avatarUrl !== undefined)
        localStorage.setItem("setflix-guest-avatar", data.avatarUrl || "");
    }
    return { user: data };
  },

  async changePassword(_data: ChangePasswordInput) {
    return { message: "Password changed" };
  },

  async getPreferences() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(PREFS_KEY);
      return { preferences: saved ? JSON.parse(saved) : {} };
    }
    return { preferences: {} };
  },

  async updatePreferences(data: UserPreferences) {
    if (typeof window !== "undefined") {
      localStorage.setItem(PREFS_KEY, JSON.stringify(data));
    }
    return { preferences: data };
  },
};
