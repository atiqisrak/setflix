"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIndexedDBPersister } from "@/lib/storage/indexeddb-persister";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * TanStack Query provider with IndexedDB persistence
 * Handles large cache data (3.3MB+) efficiently
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 1 hour
            staleTime: 1000 * 60 * 60, // 1 hour
            // Cache is kept for 24 hours
            gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
            // Retry failed requests 2 times
            retry: 2,
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
          },
        },
      })
  );

  const persister = createIndexedDBPersister();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: "", // Cache buster - increment to invalidate all cache
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

