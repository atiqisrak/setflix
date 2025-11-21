export * from "./types";
export * from "./fetch";
export * from "./parse";
export * from "./category";
export * from "./transform";
export * from "./logo";
export * from "./country";
export * from "./provider-config";
export * from "./provider-health";
export * from "./provider-selector";
export * from "./provider-fetcher";
export * from "./providers";
export * from "./channel-aggregator";

import { fetchIPTVPlaylist } from "./fetch";
import { parseIPTVPlaylist } from "./parse";
import { IPTVChannel } from "./types";
import { getProviderManager } from "./providers";

/**
 * Fetches and parses IPTV channels from default provider
 */
export async function getIPTVChannels(): Promise<IPTVChannel[]> {
  try {
    const m3uContent = await fetchIPTVPlaylist();
    return parseIPTVPlaylist(m3uContent);
  } catch (error) {
    console.error("Error getting IPTV channels:", error);
    throw error;
  }
}

/**
 * Fetches and parses IPTV channels from selected provider with failover
 */
export async function getIPTVChannelsFromProvider(providerId?: string): Promise<IPTVChannel[]> {
  try {
    const manager = getProviderManager();
    
    if (providerId) {
      const provider = manager.getProvider(providerId);
      if (provider) {
        const result = await manager.fetchChannels(provider);
        if (result.success) {
          return result.channels;
        }
      }
    }
    
    // Auto-select or failover
    const result = await manager.fetchChannels(undefined, {
      autoSelect: true,
      preferUserChoice: true,
    });
    
    if (result.success) {
      return result.channels;
    }
    
    // Fallback to default
    return getIPTVChannels();
  } catch (error) {
    console.error("Error getting IPTV channels from provider:", error);
    // Fallback to default
    return getIPTVChannels();
  }
}

