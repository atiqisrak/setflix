/**
 * Multi-provider fetching logic
 */

import { fetchIPTVPlaylist } from "./fetch";
import { parseIPTVPlaylist } from "./parse";
import { IPTVChannel } from "./types";
import { ProviderConfig } from "./provider-config";
import {
  selectProvider,
  recordProviderSelection,
  suggestNextProvider,
  addFailedProvider,
  removeFailedProvider,
} from "./provider-selector";
import {
  checkProviderHealth,
  loadProviderHealth,
  saveProviderHealth,
  updateProviderHealth,
} from "./provider-health";

/**
 * Fetch channels from a specific provider
 */
export async function fetchChannelsFromProvider(
  provider: ProviderConfig
): Promise<{ channels: IPTVChannel[]; success: boolean; error?: string }> {
  const startTime = Date.now();
  
  try {
    // Fetch playlist
    const m3uContent = await fetchIPTVPlaylist(provider.url);
    
    // Parse channels
    const channels = parseIPTVPlaylist(m3uContent);
    
    const success = channels.length > 0;
    
    // Record successful selection
    recordProviderSelection(provider.id, success);
    
    if (success) {
      // Remove from failed list if it was there
      removeFailedProvider(provider.id);
      
      // Update health
      const health = loadProviderHealth();
      const healthData = {
        status: "online" as const,
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
        channelCount: channels.length,
        successRate: 1,
        consecutiveFailures: 0,
      };
      
      health[provider.id] = updateProviderHealth(provider.id, healthData);
      saveProviderHealth(health);
    }
    
    return { channels, success };
  } catch (error: any) {
    const errorMessage = error?.message || "Unknown error";
    
    // Record failed selection
    recordProviderSelection(provider.id, false);
    addFailedProvider(provider.id);
    
    // Update health
    const health = loadProviderHealth();
    const healthData = {
      status: "offline" as const,
      lastChecked: Date.now(),
      responseTime: Date.now() - startTime,
      error: errorMessage,
      successRate: 0,
      consecutiveFailures: 1,
    };
    
    health[provider.id] = updateProviderHealth(provider.id, healthData);
    saveProviderHealth(health);
    
    return {
      channels: [],
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetch channels with automatic failover
 */
export async function fetchChannelsWithFailover(
  providers: ProviderConfig[] = [],
  maxRetries: number = 3
): Promise<{
  channels: IPTVChannel[];
  provider: ProviderConfig | null;
  success: boolean;
  error?: string;
}> {
  if (providers.length === 0) {
    return {
      channels: [],
      provider: null,
      success: false,
      error: "No providers available",
    };
  }
  
  const health = loadProviderHealth();
  let lastError: string | undefined;
  let attemptedProviders: string[] = [];
  
  for (let attempt = 0; attempt < Math.min(maxRetries, providers.length); attempt++) {
    // Select best provider (excluding already attempted ones)
    const availableProviders = providers.filter(
      p => !attemptedProviders.includes(p.id)
    );
    
    const provider = selectProvider(availableProviders, health, {
      excludeFailed: attempt === 0, // Only exclude failed on first attempt
      preferUserChoice: attempt === 0,
    });
    
    if (!provider) {
      break;
    }
    
    attemptedProviders.push(provider.id);
    
    // Try fetching
    const result = await fetchChannelsFromProvider(provider);
    
    if (result.success && result.channels.length > 0) {
      return {
        channels: result.channels,
        provider,
        success: true,
      };
    }
    
    lastError = result.error || "Failed to fetch channels";
    
    // If not last attempt, wait a bit before retrying
    if (attempt < Math.min(maxRetries, providers.length) - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    channels: [],
    provider: null,
    success: false,
    error: lastError || "All providers failed",
  };
}

/**
 * Fetch channels from multiple providers and aggregate
 */
export async function fetchChannelsFromMultipleProviders(
  providerIds: string[],
  providers: ProviderConfig[]
): Promise<Map<string, IPTVChannel[]>> {
  const results = new Map<string, IPTVChannel[]>();
  
  // Fetch from all requested providers in parallel (with concurrency limit)
  const concurrencyLimit = 5;
  const providerConfigs = providers.filter(p => providerIds.includes(p.id));
  
  for (let i = 0; i < providerConfigs.length; i += concurrencyLimit) {
    const batch = providerConfigs.slice(i, i + concurrencyLimit);
    
    await Promise.allSettled(
      batch.map(async (provider) => {
        try {
          const result = await fetchChannelsFromProvider(provider);
          if (result.success) {
            results.set(provider.id, result.channels);
          }
        } catch (error) {
          console.error(`Error fetching from provider ${provider.id}:`, error);
        }
      })
    );
  }
  
  return results;
}

/**
 * Test provider availability (quick check)
 */
export async function testProviderAvailability(
  provider: ProviderConfig
): Promise<boolean> {
  try {
    const health = await checkProviderHealth(provider);
    return health.status === "online" || health.status === "degraded";
  } catch {
    return false;
  }
}

/**
 * Batch test provider availability
 */
export async function testProvidersAvailability(
  providers: ProviderConfig[]
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  
  // Test in parallel with concurrency limit
  const concurrencyLimit = 10;
  
  for (let i = 0; i < providers.length; i += concurrencyLimit) {
    const batch = providers.slice(i, i + concurrencyLimit);
    
    await Promise.allSettled(
      batch.map(async (provider) => {
        results[provider.id] = await testProviderAvailability(provider);
      })
    );
  }
  
  return results;
}

