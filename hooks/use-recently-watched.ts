"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "setflix-recently-watched";
const MAX_ITEMS = 10;

export interface RecentlyWatchedItem {
  id: string;
  title: string;
  url: string;
  logo?: string;
  group?: string;
  watchedAt: number;
}

function readFromStorage(): RecentlyWatchedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: RecentlyWatchedItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useRecentlyWatched() {
  const [items, setItems] = useState<RecentlyWatchedItem[]>(readFromStorage);

  const addItem = useCallback((item: Omit<RecentlyWatchedItem, "watchedAt">) => {
    setItems((prev) => {
      const without = prev.filter((i) => i.url !== item.url);
      const updated = [{ ...item, watchedAt: Date.now() }, ...without].slice(0, MAX_ITEMS);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((url: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.url !== url);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeToStorage([]);
    setItems([]);
  }, []);

  return { items, addItem, removeItem, clearAll };
}
