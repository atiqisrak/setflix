/**
 * Smart provider selection logic
 */

import { ProviderConfig, getEnabledProviders } from "./provider-config";
import {
  ProviderHealth,
  loadProviderHealth,
  selectBestProvider as selectBestProviderByHealth,
  sortProvidersByPriority,
} from "./provider-health";
import { localStorageUtils } from "@/lib/storage/storage-utils";

const PREFERRED_PROVIDER_KEY = "setflix-preferred-provider";
const FAILED_PROVIDERS_KEY = "setflix-failed-providers";

/**
 * Get user's preferred provider from localStorage
 */
export function getPreferredProvider(): string | null {
  return localStorageUtils.get<string>(PREFERRED_PROVIDER_KEY) || null;
}

/**
 * Set user's preferred provider
 */
export function setPreferredProvider(providerId: string): void {
  localStorageUtils.set(PREFERRED_PROVIDER_KEY, providerId);
}

/**
 * Clear user's preferred provider
 */
export function clearPreferredProvider(): void {
  localStorageUtils.remove(PREFERRED_PROVIDER_KEY);
}

/**
 * Get list of failed providers (providers that recently failed)
 */
export function getFailedProviders(): string[] {
  return localStorageUtils.get<string[]>(FAILED_PROVIDERS_KEY) || [];
}

/**
 * Add a provider to the failed list
 */
export function addFailedProvider(providerId: string): void {
  const failed = getFailedProviders();
  if (!failed.includes(providerId)) {
    localStorageUtils.set(FAILED_PROVIDERS_KEY, [...failed, providerId]);
  }
}

/**
 * Remove a provider from the failed list
 */
export function removeFailedProvider(providerId: string): void {
  const failed = getFailedProviders();
  localStorageUtils.set(
    FAILED_PROVIDERS_KEY,
    failed.filter(id => id !== providerId)
  );
}

/**
 * Clear all failed providers
 */
export function clearFailedProviders(): void {
  localStorageUtils.remove(FAILED_PROVIDERS_KEY);
}

/**
 * Smart provider selection algorithm
 */
export function selectProvider(
  providers: ProviderConfig[] = getEnabledProviders(),
  health: Record<string, ProviderHealth> = loadProviderHealth(),
  options: {
    preferUserChoice?: boolean;
    excludeFailed?: boolean;
    minChannelCount?: number;
  } = {}
): ProviderConfig | null {
  const {
    preferUserChoice = true,
    excludeFailed = true,
    minChannelCount,
  } = options;
  
  // Get user's preferred provider if available
  if (preferUserChoice) {
    const preferredId = getPreferredProvider();
    if (preferredId) {
      const preferred = providers.find(p => p.id === preferredId && p.enabled);
      if (preferred) {
        const preferredHealth = health[preferredId];
        
        // Use preferred provider if it's healthy
        if (
          preferredHealth?.status === "online" ||
          preferredHealth?.status === "degraded"
        ) {
          // Check channel count requirement
          if (
            !minChannelCount ||
            !preferredHealth.channelCount ||
            preferredHealth.channelCount >= minChannelCount
          ) {
            return preferred;
          }
        }
      }
    }
  }
  
  // Get excluded providers (failed ones)
  const excluded = excludeFailed ? getFailedProviders() : [];
  
  // Filter providers by channel count if required
  let filteredProviders = providers;
  if (minChannelCount) {
    filteredProviders = providers.filter(p => {
      const h = health[p.id];
      return !h?.channelCount || h.channelCount >= minChannelCount;
    });
  }
  
  // Select best provider using health-based algorithm
  const best = selectBestProviderByHealth(filteredProviders, health, excluded);
  
  if (best) {
    return best;
  }
  
  // Fallback: try without excluding failed providers
  if (excluded.length > 0) {
    const fallback = selectBestProviderByHealth(filteredProviders, health, []);
    if (fallback) {
      return fallback;
    }
  }
  
  // Last resort: return first enabled provider
  return providers.find(p => p.enabled) || null;
}

/**
 * Get provider selection candidates (sorted by priority)
 */
export function getProviderCandidates(
  providers: ProviderConfig[] = getEnabledProviders(),
  health: Record<string, ProviderHealth> = loadProviderHealth()
): ProviderConfig[] {
  const excluded = getFailedProviders();
  const available = providers.filter(
    p => p.enabled && !excluded.includes(p.id)
  );
  
  return sortProvidersByPriority(available, health);
}

/**
 * Suggest next provider when current one fails
 */
export function suggestNextProvider(
  currentProviderId: string,
  providers: ProviderConfig[] = getEnabledProviders(),
  health: Record<string, ProviderHealth> = loadProviderHealth()
): ProviderConfig | null {
  // Mark current as failed
  addFailedProvider(currentProviderId);
  
  // Get candidates excluding current provider
  const excluded = [currentProviderId, ...getFailedProviders()];
  return selectBestProviderByHealth(providers, health, excluded);
}

/**
 * Validate if a provider should be used
 */
export function validateProvider(
  provider: ProviderConfig,
  health?: ProviderHealth
): { valid: boolean; reason?: string } {
  if (!provider.enabled) {
    return { valid: false, reason: "Provider is disabled" };
  }
  
  if (health) {
    if (health.status === "offline") {
      return { valid: false, reason: "Provider is offline" };
    }
    
    if (health.consecutiveFailures >= 3) {
      return { valid: false, reason: "Too many consecutive failures" };
    }
    
    if (health.successRate < 0.5) {
      return { valid: false, reason: "Low success rate" };
    }
  }
  
  return { valid: true };
}

/**
 * Get provider selection history (for analytics)
 */
export function getProviderSelectionHistory(): Array<{
  providerId: string;
  timestamp: number;
  success: boolean;
}> {
  return localStorageUtils.get<Array<{ providerId: string; timestamp: number; success: boolean }>>(
    "setflix-provider-history"
  ) || [];
}

/**
 * Record provider selection
 */
export function recordProviderSelection(
  providerId: string,
  success: boolean
): void {
  const history = getProviderSelectionHistory();
  history.push({
    providerId,
    timestamp: Date.now(),
    success,
  });
  
  // Keep only last 100 entries
  const trimmed = history.slice(-100);
  localStorageUtils.set("setflix-provider-history", trimmed);
}

