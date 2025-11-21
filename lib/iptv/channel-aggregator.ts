/**
 * Channel aggregation and deduplication from multiple providers
 */

import { IPTVChannel } from "./types";
import { ProviderConfig } from "./provider-config";

export interface AggregatedChannel extends IPTVChannel {
  providers: string[]; // Provider IDs that have this channel
  primaryProvider?: string; // Best provider for this channel
}

/**
 * Calculate similarity between two channel names
 * Returns a score between 0 (completely different) and 1 (identical)
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  const s1 = name1.toLowerCase().trim();
  const s2 = name2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word-based similarity
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Check if two URLs are similar (same domain/path)
 */
function areUrlsSimilar(url1: string, url2: string): boolean {
  try {
    const u1 = new URL(url1);
    const u2 = new URL(url2);
    
    // Same domain and similar path
    if (u1.hostname === u2.hostname) {
      const path1 = u1.pathname.toLowerCase();
      const path2 = u2.pathname.toLowerCase();
      return path1 === path2 || path1.includes(path2) || path2.includes(path1);
    }
    
    return false;
  } catch {
    // If URL parsing fails, check if strings are similar
    return url1.toLowerCase().includes(url2.toLowerCase()) ||
           url2.toLowerCase().includes(url1.toLowerCase());
  }
}

/**
 * Check if two channels are duplicates
 */
function areChannelsDuplicates(
  channel1: IPTVChannel,
  channel2: IPTVChannel,
  threshold: number = 0.85
): boolean {
  // Check URL similarity first (most reliable)
  if (areUrlsSimilar(channel1.url, channel2.url)) {
    return true;
  }
  
  // Check name similarity
  const nameSimilarity = calculateNameSimilarity(channel1.name, channel2.name);
  if (nameSimilarity >= threshold) {
    // Additional checks for high similarity
    const tvgIdMatch = channel1.tvgId && channel2.tvgId && channel1.tvgId === channel2.tvgId;
    const groupMatch = channel1.group && channel2.group && 
                       calculateNameSimilarity(channel1.group, channel2.group) > 0.8;
    
    if (tvgIdMatch || groupMatch) {
      return true;
    }
  }
  
  return false;
}

/**
 * Find duplicate channel in array
 */
function findDuplicate(
  channel: IPTVChannel,
  channels: AggregatedChannel[]
): AggregatedChannel | null {
  return channels.find(c => areChannelsDuplicates(channel, c)) || null;
}

/**
 * Aggregate channels from multiple providers
 */
export function aggregateChannels(
  providerChannels: Map<string, IPTVChannel[]>
): AggregatedChannel[] {
  const aggregated: AggregatedChannel[] = [];
  
  // Process channels from each provider
  providerChannels.forEach((channels, providerId) => {
    channels.forEach(channel => {
      // Check if this channel already exists
      const duplicate = findDuplicate(channel, aggregated);
      
      if (duplicate) {
        // Add provider to existing channel
        if (!duplicate.providers.includes(providerId)) {
          duplicate.providers.push(providerId);
        }
        
        // Update primary provider if this one is better
        // (prefer channels with more metadata or higher quality)
        const currentQuality = parseInt(duplicate.quality || "0");
        const newQuality = parseInt(channel.quality || "0");
        
        if (
          (!duplicate.primaryProvider || newQuality > currentQuality) ||
          (!channel.quality && duplicate.quality) ||
          (channel.tvgId && !duplicate.tvgId) ||
          (channel.tvgLogo && !duplicate.tvgLogo)
        ) {
          duplicate.primaryProvider = providerId;
          
          // Update channel data with better source
          if (newQuality > currentQuality) duplicate.quality = channel.quality;
          if (channel.tvgId && !duplicate.tvgId) duplicate.tvgId = channel.tvgId;
          if (channel.tvgLogo && !duplicate.tvgLogo) duplicate.tvgLogo = channel.tvgLogo;
          if (channel.country && !duplicate.country) duplicate.country = channel.country;
          if (channel.group && !duplicate.group) duplicate.group = channel.group;
        }
        
        // Update URL to primary provider's URL
        if (duplicate.primaryProvider === providerId) {
          duplicate.url = channel.url;
        }
      } else {
        // New channel
        aggregated.push({
          ...channel,
          providers: [providerId],
          primaryProvider: providerId,
        });
      }
    });
  });
  
  return aggregated;
}

/**
 * Filter channels by provider
 */
export function filterChannelsByProvider(
  channels: AggregatedChannel[],
  providerId: string
): AggregatedChannel[] {
  return channels.filter(ch => ch.providers.includes(providerId));
}

/**
 * Get best channel URL from multiple providers
 */
export function getBestChannelUrl(
  channel: AggregatedChannel,
  preferredProviderId?: string
): string {
  // If preferred provider has this channel, use it
  if (preferredProviderId && channel.providers.includes(preferredProviderId)) {
    return channel.url; // URL should already be from primary provider
  }
  
  // Use primary provider's URL
  return channel.url;
}

/**
 * Sort channels by availability (channels available on more providers first)
 */
export function sortChannelsByAvailability(
  channels: AggregatedChannel[]
): AggregatedChannel[] {
  return [...channels].sort((a, b) => {
    // More providers = better
    if (a.providers.length !== b.providers.length) {
      return b.providers.length - a.providers.length;
    }
    
    // Alphabetical as tiebreaker
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get provider statistics
 */
export function getProviderStatistics(
  channels: AggregatedChannel[],
  providerId: string
): {
  channelCount: number;
  uniqueChannels: number;
  sharedChannels: number;
} {
  const providerChannels = filterChannelsByProvider(channels, providerId);
  const uniqueChannels = providerChannels.filter(ch => ch.providers.length === 1).length;
  const sharedChannels = providerChannels.filter(ch => ch.providers.length > 1).length;
  
  return {
    channelCount: providerChannels.length,
    uniqueChannels,
    sharedChannels,
  };
}

/**
 * Get all providers that have a specific channel
 */
export function getChannelProviders(
  channel: AggregatedChannel
): string[] {
  return [...channel.providers];
}

