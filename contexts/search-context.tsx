"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { filterChannels, SetflixContentItem, transformIPTVToContent } from "@/lib/iptv";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SetflixContentItem[];
  isSearching: boolean;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { channels, contentItems, isLoading } = useIPTVChannels();

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setRecentSearches(parsed);
          }
        } catch (e) {
          console.error("Error loading recent searches:", e);
        }
      }
    }
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    const updated = [
      query.trim(),
      ...recentSearches.filter((s) => s !== query.trim()),
    ].slice(0, 5);
    
    setRecentSearches(updated);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches");
    }
  }, []);

  // Memoized search results with caching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || isLoading) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = filterChannels(channels, query);
    
    return filtered.map((channel, index) => transformIPTVToContent(channel, index));
  }, [searchQuery, channels, isLoading]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching: isLoading,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

