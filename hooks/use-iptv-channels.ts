"use client";

import { useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIPTVChannels as useIPTVChannelsQuery } from "@/lib/iptv/queries";
import {
  IPTVChannel,
  transformIPTVToContent,
  SetflixContentItem,
  groupChannelsByCategory,
} from "@/lib/iptv";
import { IPTV_QUERY_KEYS } from "@/lib/iptv/constants";

interface UseIPTVChannelsReturn {
  channels: IPTVChannel[];
  contentItems: SetflixContentItem[];
  groupedChannels: Record<string, IPTVChannel[]>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching IPTV channels with TanStack Query
 * Maintains backward compatibility with existing component usage
 * Uses IndexedDB persistence for large cache data (3.3MB+)
 * Now supports provider-based fetching
 */
export function useIPTVChannels(providerId?: string): UseIPTVChannelsReturn {
  const queryClient = useQueryClient();
  const {
    data: channels = [],
    isLoading,
    error,
    refetch: refetchQuery,
  } = useIPTVChannelsQuery(providerId);

  // Transform channels to content items
  const contentItems: SetflixContentItem[] = useMemo(
    () => channels.map((channel, index) => transformIPTVToContent(channel, index)),
    [channels]
  );

  // Group channels by category
  const groupedChannels = useMemo(
    () => groupChannelsByCategory(channels),
    [channels]
  );

  // Refetch function that matches the old interface
  const refetch = useCallback(async () => {
    await refetchQuery();
    // Also invalidate the query to force a fresh fetch
    const queryKey = providerId
      ? [...IPTV_QUERY_KEYS.channels(), "provider", providerId]
      : IPTV_QUERY_KEYS.channels();
    await queryClient.invalidateQueries({ queryKey });
  }, [refetchQuery, queryClient, providerId]);

  return {
    channels,
    contentItems,
    groupedChannels,
    isLoading,
    error: error || null,
    refetch,
  };
}

