export const IPTV_PLAYLIST_URL = "https://iptv-org.github.io/iptv/index.m3u";
export const IPTV_LOGO_BASE_URL = "https://logo.iptv.org/";

/**
 * TanStack Query cache keys for IPTV data
 */
export const IPTV_QUERY_KEYS = {
  all: ["iptv"] as const,
  channels: () => [...IPTV_QUERY_KEYS.all, "channels"] as const,
  channel: (id: string) => [...IPTV_QUERY_KEYS.all, "channel", id] as const,
} as const;

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  STALE_TIME: 1000 * 60 * 60, // 1 hour
  GC_TIME: 1000 * 60 * 60 * 24, // 24 hours
  REFETCH_INTERVAL: 1000 * 60 * 60, // 1 hour
} as const;

