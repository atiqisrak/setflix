"use client";

import { useState, useEffect, useCallback } from "react";
import { ProviderConfig } from "@/lib/iptv/provider-config";
import { ProviderHealth } from "@/lib/iptv/provider-health";
import {
  selectProvider,
  getPreferredProvider,
  setPreferredProvider as savePreferredProvider,
  getProviderCandidates,
} from "@/lib/iptv/provider-selector";
import { getProviderManager } from "@/lib/iptv/providers";
import { getEnabledProviders } from "@/lib/iptv/provider-config";
import { loadProviderHealth } from "@/lib/iptv/provider-health";

export interface UseProviderReturn {
  currentProvider: ProviderConfig | null;
  preferredProvider: ProviderConfig | null;
  providers: ProviderConfig[];
  health: Record<string, ProviderHealth>;
  candidates: ProviderConfig[];
  isLoading: boolean;
  error: Error | null;
  selectProvider: (providerId: string) => Promise<void>;
  setPreferredProvider: (providerId: string) => void;
  clearPreferredProvider: () => void;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing provider selection
 */
export function useProvider(): UseProviderReturn {
  const [currentProvider, setCurrentProvider] = useState<ProviderConfig | null>(null);
  const [preferredProvider, setPreferredProviderState] = useState<ProviderConfig | null>(null);
  const [providers, setProviders] = useState<ProviderConfig[]>([]);
  const [health, setHealth] = useState<Record<string, ProviderHealth>>({});
  const [candidates, setCandidates] = useState<ProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const manager = getProviderManager();

  // Load initial data
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        
        // Load providers
        const allProviders = manager.getProviders();
        setProviders(allProviders);
        
        // Load health
        const healthData = loadProviderHealth();
        setHealth(healthData);
        
        // Load preferred provider
        const preferredId = getPreferredProvider();
        if (preferredId) {
          const preferred = manager.getProvider(preferredId);
          setPreferredProviderState(preferred || null);
          setCurrentProvider(preferred || manager.selectBestProvider() || null);
        } else {
          // Auto-select best provider
          const best = manager.selectBestProvider();
          setCurrentProvider(best);
        }
        
        // Get candidates
        const sorted = getProviderCandidates(allProviders, healthData);
        setCandidates(sorted);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load providers"));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const selectProviderHandler = useCallback(async (providerId: string) => {
    try {
      const provider = manager.getProvider(providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }

      setCurrentProvider(provider);
      savePreferredProvider(providerId);
      setPreferredProviderState(provider);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to select provider"));
    }
  }, [manager]);

  const setPreferredProviderHandler = useCallback((providerId: string) => {
    const provider = manager.getProvider(providerId);
    if (provider) {
      savePreferredProvider(providerId);
      setPreferredProviderState(provider);
    }
  }, [manager]);

  const clearPreferredProviderHandler = useCallback(() => {
    savePreferredProvider("");
    setPreferredProviderState(null);
    const best = manager.selectBestProvider({ preferUserChoice: false });
    setCurrentProvider(best);
  }, [manager]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      
      manager.refresh();
      await manager.checkHealth();
      
      const allProviders = manager.getProviders();
      const healthData = manager.getAllHealth();
      
      setProviders(allProviders);
      setHealth(healthData);
      
      const best = manager.selectBestProvider();
      setCurrentProvider(best);
      
      const sorted = getProviderCandidates(allProviders, healthData);
      setCandidates(sorted);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh providers"));
    } finally {
      setIsLoading(false);
    }
  }, [manager]);

  return {
    currentProvider,
    preferredProvider,
    providers,
    health,
    candidates,
    isLoading,
    error,
    selectProvider: selectProviderHandler,
    setPreferredProvider: setPreferredProviderHandler,
    clearPreferredProvider: clearPreferredProviderHandler,
    refresh,
  };
}

