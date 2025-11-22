"use client";

import { useEffect, useState } from "react";

interface HomepageSettings {
  id: string;
  theme: "sports" | "news" | "entertainment";
  heroImages: string[];
  heroTitles: string[];
  heroDescriptions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/homepage-settings");
        if (!response.ok) {
          throw new Error("Failed to fetch homepage settings");
        }
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Failed to fetch homepage settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

