import { PersistedClient, Persister } from "@tanstack/query-persist-client-core";
import { get, set, del } from "idb-keyval";

const CACHE_KEY = "tanstack-query-cache";
const CACHE_VERSION = 1;

/**
 * IndexedDB persister for TanStack Query
 * Handles large cache data (3.3MB+) efficiently
 */
export function createIndexedDBPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(CACHE_KEY, {
          ...client,
          timestamp: Date.now(),
          version: CACHE_VERSION,
        });
      } catch (error) {
        console.error("Error persisting query cache to IndexedDB:", error);
        throw error;
      }
    },
    restoreClient: async (): Promise<PersistedClient | undefined> => {
      try {
        const cached = await get<PersistedClient & { timestamp?: number; version?: number }>(
          CACHE_KEY
        );
        
        if (!cached) {
          return undefined;
        }

        // Handle cache version migration if needed
        if (cached.version !== CACHE_VERSION) {
          console.warn(
            `Cache version mismatch. Expected ${CACHE_VERSION}, got ${cached.version}. Clearing cache.`
          );
          await del(CACHE_KEY);
          return undefined;
        }

        // Remove metadata fields before returning
        const { timestamp, version, ...client } = cached;
        return client as PersistedClient;
      } catch (error) {
        console.error("Error restoring query cache from IndexedDB:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await del(CACHE_KEY);
      } catch (error) {
        console.error("Error removing query cache from IndexedDB:", error);
      }
    },
  };
}

