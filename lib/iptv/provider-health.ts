/**
 * Provider health monitoring and checking
 */

import { ProviderConfig } from "./provider-config";

export type ProviderHealthStatus = "online" | "offline" | "degraded" | "unknown" | "checking";

export interface ProviderHealth {
  providerId: string;
  status: ProviderHealthStatus;
  lastChecked: number;
  responseTime?: number;
  channelCount?: number;
  error?: string;
  successRate: number; // 0-1
  consecutiveFailures: number;
}

const HEALTH_CHECK_CACHE_KEY = "setflix-provider-health";
const HEALTH_CHECK_TTL = 1000 * 60 * 5; // 5 minutes
const MAX_CONSECUTIVE_FAILURES = 3;

/**
 * Load provider health from cache
 */
export function loadProviderHealth(): Record<string, ProviderHealth> {
  if (typeof window === "undefined") return {};
  
  try {
    const cached = localStorage.getItem(HEALTH_CHECK_CACHE_KEY);
    if (!cached) return {};
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    // Remove expired entries
    const health: Record<string, ProviderHealth> = {};
    Object.entries(data).forEach(([id, healthData]: [string, any]) => {
      if (now - healthData.lastChecked < HEALTH_CHECK_TTL) {
        health[id] = healthData;
      }
    });
    
    return health;
  } catch {
    return {};
  }
}

/**
 * Save provider health to cache
 */
export function saveProviderHealth(health: Record<string, ProviderHealth>): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(HEALTH_CHECK_CACHE_KEY, JSON.stringify(health));
  } catch (error) {
    console.error("Error saving provider health:", error);
  }
}

/**
 * Check if a provider URL is accessible
 * Uses API proxy route on client-side to bypass CORS
 */
export async function checkProviderHealth(
  provider: ProviderConfig
): Promise<Omit<ProviderHealth, "providerId">> {
  const startTime = Date.now();
  const isClientSide = typeof window !== "undefined";
  
  try {
    // Use API route proxy on client-side to bypass CORS
    if (isClientSide) {
      const proxyUrl = `/api/playlist/health?url=${encodeURIComponent(provider.url)}`;
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          status: "offline",
          lastChecked: Date.now(),
          responseTime: Date.now() - startTime,
          error: errorData.error || `HTTP ${response.status}`,
          successRate: 0,
          consecutiveFailures: 1,
        };
      }

      const healthData = await response.json();
      return {
        ...healthData,
        lastChecked: Date.now(),
      };
    } else {
      // Server-side: fetch directly (no CORS restrictions)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(provider.url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
          "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
        },
      });
      
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        // Try to get approximate channel count by fetching first few lines
        let channelCount: number | undefined;
        try {
          const contentResponse = await fetch(provider.url, {
            headers: { 
              "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
              "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
              "Range": "bytes=0-10000", // Fetch first 10KB only
            },
          });
          const text = await contentResponse.text();
          channelCount = (text.match(/#EXTINF/g) || []).length;
        } catch {
          // Ignore errors in counting
        }
        
        return {
          status: responseTime > 5000 ? "degraded" : "online",
          lastChecked: Date.now(),
          responseTime,
          channelCount,
          successRate: 1,
          consecutiveFailures: 0,
        };
      } else {
        return {
          status: "offline",
          lastChecked: Date.now(),
          responseTime,
          error: `HTTP ${response.status}`,
          successRate: 0,
          consecutiveFailures: 1,
        };
      }
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // Handle timeout
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return {
        status: "offline",
        lastChecked: Date.now(),
        responseTime,
        error: "Request timeout",
        successRate: 0,
        consecutiveFailures: 1,
      };
    }
    
    return {
      status: "offline",
      lastChecked: Date.now(),
      responseTime,
      error: error?.message || "Network error",
      successRate: 0,
      consecutiveFailures: 1,
    };
  }
}

/**
 * Update provider health with new check result
 */
export function updateProviderHealth(
  providerId: string,
  healthData: Omit<ProviderHealth, "providerId">
): ProviderHealth {
  const existing = loadProviderHealth()[providerId];
  
  if (existing) {
    // Update success rate (moving average)
    const newSuccessRate = healthData.successRate === 1
      ? Math.min(1, existing.successRate * 0.9 + 0.1)
      : existing.successRate * 0.95;
    
    // Update consecutive failures
    const consecutiveFailures = healthData.status === "offline"
      ? existing.consecutiveFailures + 1
      : 0;
    
    return {
      providerId,
      status: consecutiveFailures >= MAX_CONSECUTIVE_FAILURES ? "offline" : healthData.status,
      lastChecked: healthData.lastChecked,
      responseTime: healthData.responseTime ?? existing.responseTime,
      channelCount: healthData.channelCount ?? existing.channelCount,
      error: healthData.error,
      successRate: newSuccessRate,
      consecutiveFailures,
    };
  }
  
  return {
    providerId,
    ...healthData,
  };
}

/**
 * Check health for all providers
 */
export async function checkAllProvidersHealth(
  providers: ProviderConfig[]
): Promise<Record<string, ProviderHealth>> {
  const health: Record<string, ProviderHealth> = {};
  const existingHealth = loadProviderHealth();
  
  // Check providers in parallel (batch of 5 at a time)
  const batchSize = 5;
  for (let i = 0; i < providers.length; i += batchSize) {
    const batch = providers.slice(i, i + batchSize);
    
    await Promise.allSettled(
      batch.map(async (provider) => {
        const existing = existingHealth[provider.id];
        const isExpired = !existing || Date.now() - existing.lastChecked > HEALTH_CHECK_TTL;
        
        if (!isExpired) {
          // Use cached health if still fresh
          health[provider.id] = existing;
        } else {
          // Check health
          const checkResult = await checkProviderHealth(provider);
          const updatedHealth = updateProviderHealth(provider.id, checkResult);
          health[provider.id] = updatedHealth;
        }
      })
    );
  }
  
  saveProviderHealth(health);
  return health;
}

/**
 * Get provider health status
 */
export function getProviderHealth(providerId: string): ProviderHealth | undefined {
  const health = loadProviderHealth();
  return health[providerId];
}

/**
 * Calculate provider priority score for smart selection
 * Higher score = better choice
 */
export function calculateProviderPriority(
  provider: ProviderConfig,
  health?: ProviderHealth
): number {
  let score = provider.priority * 1000; // Base priority
  
  if (health) {
    // Health status bonus
    if (health.status === "online") score += 1000;
    else if (health.status === "degraded") score += 500;
    else if (health.status === "offline") score -= 10000;
    
    // Success rate bonus
    score += health.successRate * 500;
    
    // Response time penalty (slower = lower score)
    if (health.responseTime) {
      score -= health.responseTime / 10;
    }
    
    // Channel count bonus (more channels = better)
    if (health.channelCount) {
      score += Math.min(health.channelCount / 10, 500);
    }
    
    // Penalty for consecutive failures
    score -= health.consecutiveFailures * 2000;
  }
  
  return score;
}

/**
 * Sort providers by priority for smart selection
 */
export function sortProvidersByPriority(
  providers: ProviderConfig[],
  health: Record<string, ProviderHealth> = {}
): ProviderConfig[] {
  return [...providers].sort((a, b) => {
    const scoreA = calculateProviderPriority(a, health[a.id]);
    const scoreB = calculateProviderPriority(b, health[b.id]);
    return scoreB - scoreA;
  });
}

/**
 * Select best provider from list
 */
export function selectBestProvider(
  providers: ProviderConfig[],
  health: Record<string, ProviderHealth> = {},
  excludeIds: string[] = []
): ProviderConfig | null {
  const available = providers.filter(
    p => p.enabled && !excludeIds.includes(p.id) && health[p.id]?.status !== "offline"
  );
  
  if (available.length === 0) {
    // Fallback to any enabled provider if all are offline
    const fallback = providers.find(p => p.enabled && !excludeIds.includes(p.id));
    return fallback || null;
  }
  
  const sorted = sortProvidersByPriority(available, health);
  return sorted[0] || null;
}

