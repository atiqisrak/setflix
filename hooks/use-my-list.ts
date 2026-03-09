"use client";

import { useState, useEffect, useCallback } from "react";
import { localStorageUtils } from "@/lib/storage/storage-utils";
import { SetflixContentItem } from "@/lib/iptv";
import type { MovieItem, SeriesItem } from "@/lib/content/types";
import { useFamily } from "@/contexts/family-context";

export type MyListEntry =
  | (SetflixContentItem & { kind?: "channel" })
  | (MovieItem & { kind: "movie" })
  | (SeriesItem & { kind: "series" });

function getItemId(entry: MyListEntry): number | string {
  return entry.id;
}

function getStreamUrl(entry: MyListEntry): string | undefined {
  if ("url" in entry && entry.url) return entry.url;
  if ("streamUrl" in entry) return entry.streamUrl;
  return undefined;
}

function getMyListKey(profileId: string | null): string | null {
  if (!profileId) return null;
  return `setflix-my-list-${profileId}`;
}

export function useMyList() {
  const { currentProfile } = useFamily();
  const profileId = currentProfile?.id ?? null;
  const storageKey = getMyListKey(profileId);

  const [listItems, setListItems] = useState<MyListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storageKey) {
      setListItems([]);
      setIsLoading(false);
      return;
    }
    try {
      const saved = localStorageUtils.get<MyListEntry[]>(storageKey);
      if (saved && Array.isArray(saved)) {
        setListItems(saved.map((i) => (i.kind ? i : { ...i, kind: "channel" as const })));
      } else {
        setListItems([]);
      }
    } catch (error) {
      console.error("Error loading my list:", error);
      setListItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isLoading && storageKey) {
      localStorageUtils.set(storageKey, listItems);
    }
  }, [listItems, isLoading, storageKey]);

  const addToList = useCallback((item: SetflixContentItem | MovieItem | SeriesItem) => {
    setListItems((prev) => {
      const id = item.id;
      if (prev.some((i) => getItemId(i) === id)) return prev;
      const entry: MyListEntry =
        typeof id === "number"
          ? { ...item, kind: "channel" }
          : "episodes" in item
            ? { ...item, kind: "series" }
            : { ...item, kind: "movie" };
      return [...prev, entry];
    });
  }, []);

  const removeFromList = useCallback((itemId: number | string) => {
    setListItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
  }, []);

  const isInList = useCallback(
    (itemId: number | string) => listItems.some((i) => getItemId(i) === itemId),
    [listItems]
  );

  const toggleListItem = useCallback(
    (item: SetflixContentItem | MovieItem | SeriesItem) => {
      const id = item.id;
      if (isInList(id)) removeFromList(id);
      else addToList(item);
    },
    [isInList, addToList, removeFromList]
  );

  const clearList = useCallback(() => {
    setListItems([]);
    if (storageKey) localStorageUtils.remove(storageKey);
  }, [storageKey]);

  return {
    listItems,
    isLoading,
    addToList,
    removeFromList,
    isInList,
    toggleListItem,
    clearList,
    getStreamUrl,
  };
}
