"use client";

interface User {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}

export function useAuth() {
  return {
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
}

