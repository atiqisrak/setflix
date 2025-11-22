"use client";

import { SetflixContentItem } from "@/lib/iptv";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp, Clock, Radio } from "lucide-react";
import ContentCarousel from "@/components/content-carousel";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { useMemo } from "react";

interface CategoryGridProps {
  categories: string[];
  categorizedContent: Record<string, SetflixContentItem[]>;
  onPlay?: (item: SetflixContentItem) => void;
}

const CATEGORY_QUERIES: Record<string, string> = {
  News: "news broadcast television studio",
  Sports: "sports broadcast stadium live",
  Entertainment: "entertainment television live studio",
  Movies: "classic movies cinema broadcast",
  Music: "music channel live broadcast",
  Documentary: "documentary nature professional cinema",
  Kids: "kids television cartoon animation",
  Browse: "television streaming entertainment",
  Other: "television broadcast media",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  News: "Stay informed with 24/7 breaking news, live coverage, and in-depth analysis from trusted sources worldwide.",
  Sports:
    "Catch all the live sports action, matches, tournaments, and exclusive coverage as they happen.",
  Entertainment:
    "Enjoy the latest shows, series, and entertainment content from around the globe.",
  Movies:
    "Watch classic films, blockbusters, and cinematic masterpieces from every era.",
  Music:
    "Tune in to live music channels, concerts, and music videos from various genres.",
  Documentary:
    "Explore nature, science, history, and culture through captivating documentaries.",
  Kids: "Family-friendly content and educational programs for children of all ages.",
  Browse:
    "Discover a wide variety of channels and content across all categories.",
  Other: "Explore diverse content and channels from various categories.",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  News: <Radio className="w-6 h-6" />,
  Sports: <Play className="w-6 h-6" />,
  Entertainment: <TrendingUp className="w-6 h-6" />,
  Movies: <Play className="w-6 h-6" />,
  Music: <Radio className="w-6 h-6" />,
  Documentary: <Clock className="w-6 h-6" />,
  Kids: <Play className="w-6 h-6" />,
  Browse: <TrendingUp className="w-6 h-6" />,
  Other: <Radio className="w-6 h-6" />,
};

const FALLBACK_IMAGE =
  "/cinematic-netflix-style-hero-banner-dark-professio.jpg";

interface CategoryHeaderProps {
  category: string;
  displayCategory: string;
  channels: SetflixContentItem[];
  categoryIndex: number;
}

interface FeaturedChannelCardProps {
  channel: SetflixContentItem;
  displayCategory: string;
  index: number;
}

function FeaturedChannelCard({
  channel,
  displayCategory,
  index,
}: FeaturedChannelCardProps) {
  const query = `${displayCategory.toLowerCase()} ${channel.title}`;
  const { photo, loading } = usePexelsMedia({
    query,
    type: "photo",
    orientation: "square",
    enabled: true,
  });

  const imageUrl = useMemo(() => {
    if (photo?.src?.medium) return photo.src.medium;
    if (photo?.src?.small) return photo.src.small;
    return channel.image || "/placeholder.svg";
  }, [photo, channel.image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm border border-foreground/10 hover:border-accent/50 transition-all cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-secondary overflow-hidden shrink-0 relative">
            <img
              src={imageUrl}
              alt={channel.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            {loading && (
              <div className="absolute inset-0 bg-secondary animate-pulse"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-foreground truncate mb-1 group-hover:text-accent transition-colors">
              {channel.title}
            </h5>
            <p className="text-sm text-foreground/60 line-clamp-2">
              {channel.description ||
                `Live ${displayCategory.toLowerCase()} channel`}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-all"></div>
    </motion.div>
  );
}

function CategoryHeader({
  category,
  displayCategory,
  channels,
  categoryIndex,
  onPlay,
}: CategoryHeaderProps & { onPlay?: (item: SetflixContentItem) => void }) {
  const query = CATEGORY_QUERIES[displayCategory] || CATEGORY_QUERIES.Other;
  const { photo, loading } = usePexelsMedia({
    query,
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const imageUrl = useMemo(() => {
    if (photo?.src?.large2x) return photo.src.large2x;
    if (photo?.src?.large) return photo.src.large;
    return FALLBACK_IMAGE;
  }, [photo]);

  const description =
    CATEGORY_DESCRIPTIONS[displayCategory] || CATEGORY_DESCRIPTIONS.Other;
  const icon = CATEGORY_ICONS[displayCategory] || CATEGORY_ICONS.Other;

  const isOdd = categoryIndex % 2 === 0; // 0-indexed, so even index = odd section (1st, 3rd, etc.)

  return (
    <div className="relative mb-8 md:mb-12">
      {/* Creative Grid Layout - Reversed for odd sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:items-center">
        {/* Image with Content - Position changes based on odd/even */}
        <div
          className={`lg:col-span-5 relative group ${
            isOdd ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-foreground/10 shadow-xl">
            {/* Main Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('${imageUrl}')`,
                opacity: loading ? 0.5 : 1,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-10">
              {/* Top: Icon and Badges */}
              <div
                className={`flex items-start justify-between ${
                  isOdd ? "flex-row-reverse" : ""
                }`}
              >
                <div className="p-3 md:p-4 bg-accent/20 backdrop-blur-md rounded-xl text-accent border border-accent/30">
                  {icon}
                </div>
                <div
                  className={`flex flex-col gap-2 ${
                    isOdd ? "items-start" : "items-end"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-foreground/20">
                    <Radio className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                    <span className="text-xs md:text-sm font-semibold text-white">
                      {channels.length}{" "}
                      {channels.length === 1 ? "Channel" : "Channels"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-md rounded-full border border-green-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-white">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: Title and Description */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                    {displayCategory}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-md">
                    {description}
                  </p>
                </div>

                {/* All Button */}
                <Link
                  href={`/search?category=${encodeURIComponent(category)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
                >
                  View All Channels
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Carousel - Position changes based on odd/even */}
        <div
          className={`lg:col-span-7 flex flex-col ${
            isOdd ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="flex-1 w-full">
            <ContentCarousel
              title=""
              items={channels.slice(0, 20)}
              onPlay={onPlay}
              hideTitle={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader() {
  const { photo, loading } = usePexelsMedia({
    query: "television streaming entertainment broadcast",
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const backgroundImage = useMemo(() => {
    if (photo?.src?.large2x) return photo.src.large2x;
    if (photo?.src?.large) return photo.src.large;
    return undefined;
  }, [photo]);

  return (
    <div className="mb-12 md:mb-16 text-center relative">
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-5 transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            opacity: loading ? 0 : 0.05,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Browse by Category
        </h2>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
          Discover thousands of live channels organized by category. From
          breaking news to live sports, entertainment to documentaries - find
          exactly what you're looking for.
        </p>
      </motion.div>
    </div>
  );
}

export default function CategoryGrid({
  categories,
  categorizedContent,
  onPlay,
}: CategoryGridProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none"></div>

      {/* Section Header */}
      <SectionHeader />

      {/* Categories */}
      <div className="space-y-16 md:space-y-20 lg:space-y-24">
        {categories.map((category, categoryIndex) => {
          const channels = categorizedContent[category] || [];
          const displayCategory =
            category === "Undefined" ? "Browse" : category;

          if (channels.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.15 }}
              className="relative"
            >
              {/* Creative Category Layout */}
              <CategoryHeader
                category={category}
                displayCategory={displayCategory}
                channels={channels}
                categoryIndex={categoryIndex}
                onPlay={onPlay}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
