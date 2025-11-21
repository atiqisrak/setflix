"use client";

import { useMemo } from "react";
import ContentCarousel from "@/components/content-carousel";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { transformIPTVToContent } from "@/lib/iptv";

interface TabContentProps {
  activeTab: "overview" | "episodes" | "details";
  item: {
    id?: number;
    genres?: string[];
    cast?: string[];
    director?: string;
    releaseDate?: string;
    rating?: number;
  };
}

export default function TabContent({ activeTab, item }: TabContentProps) {
  const { contentItems } = useIPTVChannels();

  const relatedContent = useMemo(() => {
    if (!contentItems || contentItems.length === 0) return [];

    // Filter out the current item
    let filtered = contentItems.filter(
      (contentItem) => contentItem.id !== item.id
    );

    // If item has genres, filter by matching genres
    if (item.genres && item.genres.length > 0) {
      const genreMatches = filtered.filter((contentItem) => {
        if (!contentItem.genres || contentItem.genres.length === 0)
          return false;
        return contentItem.genres.some((genre) =>
          item.genres!.some(
            (itemGenre) =>
              genre.toLowerCase() === itemGenre.toLowerCase() ||
              genre.toLowerCase().includes(itemGenre.toLowerCase()) ||
              itemGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
      });

      // If we have genre matches, use them; otherwise use all filtered items
      if (genreMatches.length > 0) {
        filtered = genreMatches;
      }
    }

    // Limit to 20 items
    return filtered.slice(0, 20);
  }, [contentItems, item.id, item.genres]);

  if (activeTab === "overview") {
    return (
      <div>
        {item.genres && item.genres.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-card border border-border rounded text-sm text-foreground/80"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
            More Like This
          </h3>
          <ContentCarousel
            title=""
            items={relatedContent.length > 0 ? relatedContent : undefined}
            category={relatedContent.length === 0 ? "trending" : undefined}
            hideTitle
          />
        </div>
      </div>
    );
  }

  if (activeTab === "episodes") {
    return (
      <div>
        <p className="text-foreground/60">Episodes coming soon</p>
      </div>
    );
  }

  if (activeTab === "details") {
    return (
      <div className="space-y-4">
        {item.cast && item.cast.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Cast
            </h3>
            <p className="text-foreground/80">{item.cast.join(", ")}</p>
          </div>
        )}
        {item.director && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Director
            </h3>
            <p className="text-foreground/80">{item.director}</p>
          </div>
        )}
        {item.releaseDate && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Release Date
            </h3>
            <p className="text-foreground/80">{item.releaseDate}</p>
          </div>
        )}
        {item.rating && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Rating
            </h3>
            <p className="text-foreground/80">{item.rating}%</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
