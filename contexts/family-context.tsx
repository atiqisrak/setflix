"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { localStorageUtils, sessionStorageUtils } from "@/lib/storage/storage-utils";

const PROFILES_KEY = "setflix-profiles";
const CURRENT_PROFILE_ID_KEY = "setflix-current-profile-id";
const DEFAULT_PROFILE_NAME = "Family";

export interface FamilyProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  isKids?: boolean;
}

interface FamilyContextType {
  profiles: FamilyProfile[];
  currentProfile: FamilyProfile | null;
  setCurrentProfile: (id: string | null) => void;
  addProfile: (profile: Omit<FamilyProfile, "id">) => FamilyProfile;
  updateProfile: (id: string, updates: Partial<Omit<FamilyProfile, "id">>) => void;
  deleteProfile: (id: string) => void;
  isLoading: boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadProfiles(): FamilyProfile[] {
  const stored = localStorageUtils.get<FamilyProfile[]>(PROFILES_KEY);
  if (stored && Array.isArray(stored)) return stored;
  return [];
}

function saveProfiles(profiles: FamilyProfile[]): void {
  localStorageUtils.set(PROFILES_KEY, profiles);
}

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfilesState] = useState<FamilyProfile[]>([]);
  const [currentProfile, setCurrentProfileState] = useState<FamilyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadProfiles();
    if (stored.length === 0) {
      const defaultProfile: FamilyProfile = {
        id: generateId(),
        name: DEFAULT_PROFILE_NAME,
        isKids: false,
      };
      const initial = [defaultProfile];
      saveProfiles(initial);
      setProfilesState(initial);
      setCurrentProfileState(defaultProfile);
      sessionStorageUtils.set(CURRENT_PROFILE_ID_KEY, defaultProfile.id);
    } else {
      setProfilesState(stored);
      const currentId = sessionStorageUtils.get<string>(CURRENT_PROFILE_ID_KEY);
      const found = currentId ? stored.find((p) => p.id === currentId) : null;
      setCurrentProfileState(found ?? stored[0]);
      if (!found && currentId) {
        sessionStorageUtils.set(CURRENT_PROFILE_ID_KEY, stored[0].id);
      }
    }
    setIsLoading(false);
  }, []);

  const setCurrentProfile = useCallback((id: string | null) => {
    if (id === null) {
      setCurrentProfileState(null);
      sessionStorageUtils.remove(CURRENT_PROFILE_ID_KEY);
      return;
    }
    const list = loadProfiles();
    const profile = list.find((p) => p.id === id) ?? null;
    setCurrentProfileState(profile);
    if (profile) {
      sessionStorageUtils.set(CURRENT_PROFILE_ID_KEY, profile.id);
    } else {
      sessionStorageUtils.remove(CURRENT_PROFILE_ID_KEY);
    }
  }, []);

  const addProfile = useCallback((profile: Omit<FamilyProfile, "id">): FamilyProfile => {
    const newProfile: FamilyProfile = {
      ...profile,
      id: generateId(),
    };
    setProfilesState((prev) => {
      const next = [...prev, newProfile];
      saveProfiles(next);
      return next;
    });
    return newProfile;
  }, []);

  const updateProfile = useCallback(
    (id: string, updates: Partial<Omit<FamilyProfile, "id">>) => {
      setProfilesState((prev) => {
        const next = prev.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
        saveProfiles(next);
        return next;
      });
      setCurrentProfileState((prev) =>
        prev?.id === id ? { ...prev, ...updates } : prev
      );
    },
    []
  );

  const deleteProfile = useCallback((id: string) => {
    let remaining: FamilyProfile[] = [];
    setProfilesState((prev) => {
      remaining = prev.filter((p) => p.id !== id);
      saveProfiles(remaining);
      return remaining;
    });
    setCurrentProfileState((prev) => {
      if (prev?.id === id) {
        sessionStorageUtils.remove(CURRENT_PROFILE_ID_KEY);
        if (remaining.length > 0) {
          sessionStorageUtils.set(CURRENT_PROFILE_ID_KEY, remaining[0].id);
          return remaining[0];
        }
        return null;
      }
      return prev;
    });
    localStorageUtils.remove(`setflix-my-list-${id}`);
  }, []);

  return (
    <FamilyContext.Provider
      value={{
        profiles,
        currentProfile,
        setCurrentProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        isLoading,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily(): FamilyContextType {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
}
