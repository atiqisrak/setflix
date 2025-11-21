"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProviderConfig, getEnabledProviders, getProvidersByType, getProvidersByRegion } from "@/lib/iptv/provider-config";
import { ProviderHealth, loadProviderHealth, checkAllProvidersHealth } from "@/lib/iptv/provider-health";
import { IPTV_QUERY_KEYS } from "@/lib/iptv/constants";

/**
 * Hook for fetching all providers
 */
export function useProviders() {
  return useQuery({
    queryKey: IPTV_QUERY_KEYS.providers(),
    queryFn: () => getEnabledProviders(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook for fetching providers by type
 */
export function useProvidersByType(type: "main" | "regional" | "specialty" | "third-party") {
  return useQuery({
    queryKey: [...IPTV_QUERY_KEYS.providers(), "type", type],
    queryFn: () => getProvidersByType(type),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook for fetching providers by region
 */
export function useProvidersByRegion(region: string) {
  return useQuery({
    queryKey: [...IPTV_QUERY_KEYS.providers(), "region", region],
    queryFn: () => getProvidersByRegion(region),
    enabled: !!region,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook for fetching provider health
 */
export function useProviderHealth() {
  return useQuery({
    queryKey: IPTV_QUERY_KEYS.providerHealth(),
    queryFn: async () => {
      const providers = getEnabledProviders();
      return checkAllProvidersHealth(providers);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

/**
 * Hook for getting a single provider's health
 */
export function useProviderHealthStatus(providerId: string | null) {
  const { data: allHealth } = useProviderHealth();
  
  return {
    health: providerId ? allHealth?.[providerId] : undefined,
    isLoading: !allHealth && !!providerId,
  };
}

/**
 * Hook for refreshing provider health
 */
export function useRefreshProviderHealth() {
  const queryClient = useQueryClient();
  
  return async () => {
    await queryClient.invalidateQueries({ queryKey: IPTV_QUERY_KEYS.providerHealth() });
  };
}

