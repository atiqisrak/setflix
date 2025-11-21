import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getIPTVChannels, getIPTVChannelsFromProvider, IPTVChannel } from "./index";
import { IPTV_QUERY_KEYS } from "./constants";
import { getPreferredProvider } from "./provider-selector";

/**
 * TanStack Query hook for fetching IPTV channels
 * Uses IndexedDB persistence for large cache data
 * Now supports provider-based fetching with auto-selection
 */
export function useIPTVChannels(providerId?: string): UseQueryResult<IPTVChannel[], Error> {
  // Use provided providerId, or fall back to preferred provider, or use default
  const activeProviderId = providerId || (typeof window !== "undefined" ? getPreferredProvider() : null);
  
  return useQuery({
    queryKey: activeProviderId 
      ? [...IPTV_QUERY_KEYS.channels(), "provider", activeProviderId]
      : IPTV_QUERY_KEYS.channels(),
    queryFn: () => activeProviderId 
      ? getIPTVChannelsFromProvider(activeProviderId)
      : getIPTVChannels(),
    staleTime: 1000 * 60 * 60, // 1 hour - data is fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 24 hours
    retry: 2,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour in background
    refetchIntervalInBackground: true, // Continue refetching even when tab is in background
  });
}

/**
 * TanStack Query hook for fetching a single IPTV channel by ID
 */
export function useIPTVChannelById(
  channelId: string | null
): UseQueryResult<IPTVChannel | undefined, Error> {
  const { data: channels } = useIPTVChannels();

  return useQuery({
    queryKey: IPTV_QUERY_KEYS.channel(channelId || ""),
    queryFn: async () => {
      if (!channelId || !channels) return undefined;
      return channels.find((channel) => channel.id === channelId);
    },
    enabled: !!channelId && !!channels,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

