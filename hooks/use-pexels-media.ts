"use client";

import { useState, useEffect } from "react";
import type { PexelsPhoto, PexelsVideo } from "@/lib/seo/pexels";

interface UsePexelsMediaOptions {
  query: string;
  type?: "photo" | "video" | "photos";
  count?: number;
  orientation?: "landscape" | "portrait" | "square";
  enabled?: boolean;
}

export function usePexelsMedia({
  query,
  type = "photo",
  count = 1,
  orientation = "landscape",
  enabled = true,
}: UsePexelsMediaOptions) {
  const [photo, setPhoto] = useState<PexelsPhoto | null>(null);
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [video, setVideo] = useState<PexelsVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          type: type === "photos" ? "photo" : type,
          query,
          orientation,
        });

        if (type === "photos" || count > 1) {
          params.append("count", count.toString());
        }

        const response = await fetch(`/api/pexels?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch media");
        }

        if (type === "video") {
          setVideo(data.video);
        } else if (type === "photos" || count > 1) {
          setPhotos(data.photos || []);
        } else {
          setPhoto(data.photo);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        // Don't set error for rate limiting - just use fallback images
        if (!errorMessage.includes("Too Many Requests") && !errorMessage.includes("429")) {
          setError(errorMessage);
          console.error("Error fetching Pexels media:", err);
        } else {
          // Silently handle rate limiting - fallback images will be used
          console.warn("Pexels API rate limit reached, using fallback images");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [query, type, count, orientation, enabled]);

  return {
    photo,
    photos,
    video,
    loading,
    error,
  };
}

