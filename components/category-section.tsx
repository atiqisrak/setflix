"use client";

import { SetflixContentItem } from "@/lib/iptv";
import ChannelGrid from "@/components/channel-grid";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface CategorySectionProps {
  category: string;
  channels: SetflixContentItem[];
  backgroundImage: string;
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  News: "/live-news-broadcast-professional.jpg",
  Sports: "/sports-broadcast-stadium-live.jpg",
  Entertainment: "/entertainment-television-live-studio.jpg",
  Movies: "/classic-movies-cinema-broadcast.jpg",
  Music: "/music-channel-live-broadcast.jpg",
  Documentary: "/documentary-nature-professional-cinema.jpg",
  Kids: "/entertainment-television-live-studio.jpg",
  Other: "/cinematic-netflix-style-hero-banner-dark-professio.jpg",
};

export default function CategorySection({
  category,
  channels,
  backgroundImage,
  onPlay,
  onMoreInfo,
}: CategorySectionProps) {
  const imageUrl =
    CATEGORY_IMAGES[category] || backgroundImage || CATEGORY_IMAGES.Other;

  return (
    <section className="relative w-full rounded-lg overflow-hidden mb-8 md:mb-12">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {category === "Undefined" ? "Browse" : category}
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              {channels.length} {channels.length === 1 ? "channel" : "channels"}{" "}
              available
            </p>
          </div>
          {channels.length > 4 && (
            <Link
              href={`/search?category=${encodeURIComponent(category)}`}
              className="hidden md:flex items-center gap-2 text-white hover:text-accent transition-colors font-semibold"
            >
              View All
              <ChevronRight size={20} />
            </Link>
          )}
        </div>

        {/* Featured Channels Grid */}
        {channels.length > 0 ? (
          <ChannelGrid
            channels={channels}
            maxItems={4}
            onPlay={onPlay}
            onMoreInfo={onMoreInfo}
          />
        ) : (
          <div className="text-white/60 py-8 text-center">
            No channels available in this category
          </div>
        )}

        {/* Mobile View All Link */}
        {channels.length > 4 && (
          <div className="mt-6 md:hidden">
            <Link
              href={`/search?category=${encodeURIComponent(category)}`}
              className="flex items-center justify-center gap-2 text-white hover:text-accent transition-colors font-semibold"
            >
              View All Channels
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
