"use client";

import { SetflixContentItem } from "@/lib/iptv";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ContentCarousel from "@/components/content-carousel";

interface CategoryGridProps {
  categories: string[];
  categorizedContent: Record<string, SetflixContentItem[]>;
  onPlay?: (item: SetflixContentItem) => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  News: "/live-news-broadcast-professional.jpg",
  Sports: "/sports-broadcast-stadium-live.jpg",
  Entertainment: "/entertainment-television-live-studio.jpg",
  Movies: "/classic-movies-cinema-broadcast.jpg",
  Music: "/music-channel-live-broadcast.jpg",
  Documentary: "/documentary-nature-professional-cinema.jpg",
  Kids: "/entertainment-television-live-studio.jpg",
  Browse: "/cinematic-netflix-style-hero-banner-dark-professio.jpg",
  Other: "/cinematic-netflix-style-hero-banner-dark-professio.jpg",
};

export default function CategoryGrid({
  categories,
  categorizedContent,
  onPlay,
}: CategoryGridProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Browse by Category
        </h2>
        <p className="text-foreground/70 text-lg">
          Explore channels organized by category
        </p>
      </div>

      <div className="space-y-12 md:space-y-16">
        {categories.map((category, categoryIndex) => {
          const channels = categorizedContent[category] || [];
          const displayCategory =
            category === "Undefined" ? "Browse" : category;
          const imageUrl =
            CATEGORY_IMAGES[displayCategory] || CATEGORY_IMAGES.Other;

          if (channels.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="relative"
            >
              {/* Category Header with Background */}
              <div className="relative mb-6 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url('${imageUrl}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background"></div>
                </div>
                <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {displayCategory}
                    </h3>
                    <p className="text-foreground/60">
                      {channels.length}{" "}
                      {channels.length === 1 ? "channel" : "channels"} available
                    </p>
                  </div>
                  <Link
                    href={`/search?category=${encodeURIComponent(category)}`}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-semibold transition-colors"
                  >
                    View All
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Channels Carousel */}
              <ContentCarousel
                title=""
                items={channels.slice(0, 20)}
                onPlay={onPlay}
                hideTitle={true}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
