"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@/lib/api/auth";

const GUEST_USER: User = {
  id: "guest",
  email: "guest@setflix.local",
  name: "Guest",
  role: "admin",
  emailVerified: true,
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadGuestUser(): User {
  if (typeof window === "undefined") return GUEST_USER;
  const savedName = localStorage.getItem("setflix-guest-name");
  const savedAvatar = localStorage.getItem("setflix-guest-avatar");
  return {
    ...GUEST_USER,
    name: savedName || GUEST_USER.name,
    avatarUrl: savedAvatar || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(loadGuestUser);

  const login = useCallback(async () => {}, []);
  const register = useCallback(async () => {}, []);
  const logout = useCallback(async () => {}, []);

  const refreshUser = useCallback(async () => {
    setUser(loadGuestUser());
  }, []);

  const clearError = useCallback(() => {}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isAdmin: true,
        isPremium: true,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
