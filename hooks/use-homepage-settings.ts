"use client";

import { useState, useEffect } from "react";

interface HomepageSettings {
  theme: "sports" | "news" | "entertainment";
}

function readTheme(): "sports" | "news" | "entertainment" {
  if (typeof window === "undefined") return "entertainment";
  try {
    const raw = localStorage.getItem("setflix-theme");
    if (raw === "sports" || raw === "news" || raw === "entertainment") return raw;
  } catch {}
  return "entertainment";
}

export function useHomepageSettings() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings({ theme: readTheme() });
    setLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "setflix-theme") setSettings({ theme: readTheme() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { settings, loading, error: null };
}
