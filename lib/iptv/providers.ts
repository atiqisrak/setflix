/**
 * Provider management system - main entry point for provider operations
 */

import {
  ProviderConfig,
  loadProviderConfig,
  getEnabledProviders,
  getProviderById,
  getProvidersByType,
  getProvidersByRegion,
} from "./provider-config";
import {
  ProviderHealth,
  loadProviderHealth,
  checkAllProvidersHealth,
  sortProvidersByPriority,
} from "./provider-health";
import {
  selectProvider,
  getPreferredProvider,
  setPreferredProvider,
  getProviderCandidates,
} from "./provider-selector";
import {
  fetchChannelsFromProvider,
  fetchChannelsWithFailover,
  fetchChannelsFromMultipleProviders,
  testProvidersAvailability,
} from "./provider-fetcher";
import { IPTVChannel } from "./types";
import { AggregatedChannel, aggregateChannels } from "./channel-aggregator";

export interface ProviderManagerOptions {
  autoSelect?: boolean;
  preferUserChoice?: boolean;
  checkHealth?: boolean;
  maxRetries?: number;
}

/**
 * Provider Manager - Main class for managing providers
 */
export class ProviderManager {
  private providers: ProviderConfig[];
  private health: Record<string, ProviderHealth>;
  
  constructor(providers?: ProviderConfig[]) {
    this.providers = providers || loadProviderConfig();
    this.health = loadProviderHealth();
  }
  
  /**
   * Get all enabled providers
   */
  getProviders(): ProviderConfig[] {
    return this.providers.filter(p => p.enabled);
  }
  
  /**
   * Get provider by ID
   */
  getProvider(id: string): ProviderConfig | undefined {
    return this.providers.find(p => p.id === id);
  }
  
  /**
   * Get providers by type
   */
  getProvidersByType(type: "main" | "regional" | "specialty" | "third-party"): ProviderConfig[] {
    return getProvidersByType(type);
  }
  
  /**
   * Get providers by region
   */
  getProvidersByRegion(region: string): ProviderConfig[] {
    return getProvidersByRegion(region);
  }
  
  /**
   * Get provider health
   */
  getHealth(providerId: string): ProviderHealth | undefined {
    return this.health[providerId];
  }
  
  /**
   * Get all provider health statuses
   */
  getAllHealth(): Record<string, ProviderHealth> {
    return { ...this.health };
  }
  
  /**
   * Check health for all providers
   */
  async checkHealth(): Promise<Record<string, ProviderHealth>> {
    this.health = await checkAllProvidersHealth(this.providers);
    return this.health;
  }
  
  /**
   * Select best provider
   */
  selectBestProvider(options: ProviderManagerOptions = {}): ProviderConfig | null {
    const {
      preferUserChoice = true,
    } = options;
    
    return selectProvider(this.providers, this.health, {
      preferUserChoice,
    });
  }
  
  /**
   * Get provider candidates (sorted by priority)
   */
  getCandidates(): ProviderConfig[] {
    return getProviderCandidates(this.providers, this.health);
  }
  
  /**
   * Get user's preferred provider
   */
  getPreferredProvider(): ProviderConfig | null {
    const preferredId = getPreferredProvider();
    if (!preferredId) return null;
    
    return this.getProvider(preferredId) || null;
  }
  
  /**
   * Set preferred provider
   */
  setPreferredProvider(providerId: string): void {
    const provider = this.getProvider(providerId);
    if (provider) {
      setPreferredProvider(providerId);
    }
  }
  
  /**
   * Fetch channels from selected provider
   */
  async fetchChannels(
    provider?: ProviderConfig,
    options: ProviderManagerOptions = {}
  ): Promise<{
    channels: IPTVChannel[];
    provider: ProviderConfig | null;
    success: boolean;
    error?: string;
  }> {
    const {
      autoSelect = true,
      maxRetries = 3,
    } = options;
    
    // Use provided provider or auto-select
    const targetProvider = provider || (autoSelect ? this.selectBestProvider(options) : null);
    
    if (!targetProvider) {
      // Try failover
      return fetchChannelsWithFailover(this.providers, maxRetries);
    }
    
    const result = await fetchChannelsFromProvider(targetProvider);
    
    // Update health after fetch
    this.health = loadProviderHealth();
    
    if (result.success) {
      return {
        channels: result.channels,
        provider: targetProvider,
        success: true,
      };
    }
    
    // If fetch failed, try failover
    return fetchChannelsWithFailover(this.providers, maxRetries);
  }
  
  /**
   * Fetch channels from multiple providers and aggregate
   */
  async fetchAndAggregateChannels(
    providerIds: string[]
  ): Promise<{
    channels: AggregatedChannel[];
    providerStats: Record<string, { channelCount: number }>;
  }> {
    const providerChannels = await fetchChannelsFromMultipleProviders(
      providerIds,
      this.providers
    );
    
    // Aggregate channels
    const aggregated = aggregateChannels(providerChannels);
    
    // Calculate provider stats
    const providerStats: Record<string, { channelCount: number }> = {};
    providerIds.forEach(id => {
      const channels = providerChannels.get(id) || [];
      providerStats[id] = { channelCount: channels.length };
    });
    
    // Update health
    this.health = loadProviderHealth();
    
    return {
      channels: aggregated,
      providerStats,
    };
  }
  
  /**
   * Test provider availability
   */
  async testAvailability(providerIds?: string[]): Promise<Record<string, boolean>> {
    const providersToTest = providerIds
      ? this.providers.filter(p => providerIds.includes(p.id))
      : this.providers;
    
    return testProvidersAvailability(providersToTest);
  }
  
  /**
   * Get sorted providers by priority
   */
  getSortedProviders(): ProviderConfig[] {
    return sortProvidersByPriority(this.providers, this.health);
  }
  
  /**
   * Refresh provider list (reload config)
   */
  refresh(): void {
    this.providers = loadProviderConfig();
    this.health = loadProviderHealth();
  }
}

/**
 * Singleton instance (client-side only)
 */
let managerInstance: ProviderManager | null = null;

/**
 * Get provider manager instance
 */
export function getProviderManager(): ProviderManager {
  if (typeof window === "undefined") {
    return new ProviderManager();
  }
  
  if (!managerInstance) {
    managerInstance = new ProviderManager();
  }
  
  return managerInstance;
}

/**
 * Create a new provider manager instance
 */
export function createProviderManager(providers?: ProviderConfig[]): ProviderManager {
  return new ProviderManager(providers);
}

