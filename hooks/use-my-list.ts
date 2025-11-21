"use client";

import { useState, useEffect, useCallback } from "react";
import { localStorageUtils } from "@/lib/storage/storage-utils";
import { SetflixContentItem } from "@/lib/iptv";

const MY_LIST_KEY = "setflix-my-list";

export function useMyList() {
  const [listItems, setListItems] = useState<SetflixContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load list from localStorage on mount
  useEffect(() => {
    const loadList = () => {
      try {
        const saved = localStorageUtils.get<SetflixContentItem[]>(MY_LIST_KEY);
        if (saved && Array.isArray(saved)) {
          setListItems(saved);
        }
      } catch (error) {
        console.error("Error loading my list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadList();
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    if (!isLoading) {
      localStorageUtils.set(MY_LIST_KEY, listItems);
    }
  }, [listItems, isLoading]);

  const addToList = useCallback((item: SetflixContentItem) => {
    setListItems((prev) => {
      // Check if item already exists
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromList = useCallback((itemId: number) => {
    setListItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const isInList = useCallback(
    (itemId: number) => {
      return listItems.some((item) => item.id === itemId);
    },
    [listItems]
  );

  const toggleListItem = useCallback(
    (item: SetflixContentItem) => {
      if (isInList(item.id)) {
        removeFromList(item.id);
      } else {
        addToList(item);
      }
    },
    [isInList, addToList, removeFromList]
  );

  const clearList = useCallback(() => {
    setListItems([]);
    localStorageUtils.remove(MY_LIST_KEY);
  }, []);

  return {
    listItems,
    isLoading,
    addToList,
    removeFromList,
    isInList,
    toggleListItem,
    clearList,
  };
}

