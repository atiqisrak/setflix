"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getIPTVChannels,
  IPTVChannel,
  transformIPTVToContent,
  SetflixContentItem,
  groupChannelsByCategory,
} from "@/lib/iptv";

interface UseIPTVChannelsReturn {
  channels: IPTVChannel[];
  contentItems: SetflixContentItem[];
  groupedChannels: Record<string, IPTVChannel[]>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY = "iptv-channels-cache";
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

interface CacheData {
  channels: IPTVChannel[];
  timestamp: number;
}

function getCachedChannels(): IPTVChannel[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data.channels;
    }

    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
}

function setCachedChannels(channels: IPTVChannel[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: CacheData = {
      channels,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
}

export function useIPTVChannels(): UseIPTVChannelsReturn {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      const cachedChannels = getCachedChannels();
      if (cachedChannels && cachedChannels.length > 0) {
        setChannels(cachedChannels);
        setIsLoading(false);
      }

      // Fetch fresh data
      const freshChannels = await getIPTVChannels();
      setChannels(freshChannels);
      setCachedChannels(freshChannels);
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch IPTV channels");
      setError(error);
      setIsLoading(false);

      // If we have cached data, use it even if fetch failed
      const cachedChannels = getCachedChannels();
      if (cachedChannels && cachedChannels.length > 0) {
        setChannels(cachedChannels);
      }
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contentItems: SetflixContentItem[] = channels.map((channel, index) =>
    transformIPTVToContent(channel, index)
  );

  const groupedChannels = groupChannelsByCategory(channels);

  return {
    channels,
    contentItems,
    groupedChannels,
    isLoading,
    error,
    refetch: fetchChannels,
  };
}

