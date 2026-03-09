"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { User } from "@/lib/api/auth";

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

/** Local-only mock user so frontend works without backend auth. */
const MOCK_USER: User = {
  id: "local-user",
  email: "user@local",
  name: "User",
  role: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (_email: string, _password: string) => {
    setUser(MOCK_USER);
    setError(null);
  }, []);

  const register = useCallback(
    async (_email: string, _password: string, _name?: string) => {
      setError(null);
      // No backend call; user can "log in" locally if desired
    },
    []
  );

  const logout = useCallback(async () => {
    // Keep user as mock so app remains usable without backend
    setUser(MOCK_USER);
  }, []);

  const refreshUser = useCallback(async () => {
    setUser(MOCK_USER);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAdmin = user?.role === "admin";
  const isPremium = user?.role === "premium_subscriber" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        isAdmin,
        isPremium,
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
