/**
 * Type-safe storage utilities for localStorage and sessionStorage
 */

// localStorage utilities for persistent data
export const localStorageUtils = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.warn("localStorage quota exceeded. Consider clearing old data.");
      }
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// sessionStorage utilities for temporary session data
export const sessionStorageUtils = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from sessionStorage key "${key}":`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to sessionStorage key "${key}":`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.warn("sessionStorage quota exceeded. Consider clearing old data.");
      }
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  USER_PREFERENCES: "setflix-user-preferences",
  RECENT_SEARCHES: "recentSearches",
  RECENT_FILTERS: "recent-filters",
  SESSION_FILTERS: "session-filters",
  SESSION_VIEW_MODE: "session-view-mode",
  MY_LIST: "setflix-my-list",
  TOKEN: "setflix-token",
  REFRESH_TOKEN: "setflix-refresh-token",
} as const;

