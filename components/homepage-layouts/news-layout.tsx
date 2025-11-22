"use client";

import { motion } from "framer-motion";
import {
  Radio,
  Newspaper,
  Globe,
  Clock,
  ArrowRight,
  Check,
  Play,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { useMemo } from "react";
import ChannelCard from "@/components/channel-card";
import { SetflixContentItem } from "@/lib/iptv";

interface NewsLayoutProps {
  channels: SetflixContentItem[];
  categorizedContent: Record<string, SetflixContentItem[]>;
  topCategories: string[];
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

export default function NewsLayout({
  channels,
  categorizedContent,
  topCategories,
  onPlay,
  onMoreInfo,
}: NewsLayoutProps) {
  const { photo: heroPhoto, loading: heroLoading } = usePexelsMedia({
    query: "news broadcast television studio breaking news",
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const { photos: featurePhotos } = usePexelsMedia({
    query: "news journalist reporting broadcast",
    type: "photos",
    count: 3,
    orientation: "landscape",
    enabled: true,
  });

  const heroImage = useMemo(() => {
    if (heroPhoto?.src?.large2x) return heroPhoto.src.large2x;
    if (heroPhoto?.src?.large) return heroPhoto.src.large;
    return "/live-news-broadcast-professional.jpg";
  }, [heroPhoto]);

  // Get featured news channels
  const featuredChannels = useMemo(() => {
    return channels.slice(0, 6);
  }, [channels]);

  // Get news categories
  const newsCategories = useMemo(() => {
    return topCategories
      .filter(
        (cat) =>
          cat.toLowerCase().includes("news") ||
          cat.toLowerCase().includes("breaking") ||
          cat.toLowerCase().includes("reporting") ||
          cat.toLowerCase().includes("broadcast")
      )
      .slice(0, 3);
  }, [topCategories]);

  // Get channels for featured categories
  const getCategoryChannels = (category: string) => {
    return categorizedContent[category]?.slice(0, 8) || [];
  };

  const features = [
    {
      icon: Radio,
      title: "Breaking News",
      description:
        "Get instant access to breaking news as it happens around the world",
      image: featurePhotos[0]?.src?.large || "",
      category: newsCategories[0] || topCategories[0],
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Watch news from every continent and stay informed globally",
      image: featurePhotos[1]?.src?.large || "",
      category: newsCategories[1] || topCategories[1],
    },
    {
      icon: Clock,
      title: "24/7 Updates",
      description:
        "Never miss important updates with round-the-clock news coverage",
      image: featurePhotos[2]?.src?.large || "",
      category: newsCategories[2] || topCategories[2],
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section with Featured Channels */}
      <section className="relative min-h-[500px] md:min-h-[700px] rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${heroImage}')`,
            opacity: heroLoading ? 0.5 : 1,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/85 to-blue-900/95"></div>
        </div>

        {/* Featured Channels Grid Overlay */}
        {featuredChannels.length > 0 && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-20 right-8 w-64 md:w-80 grid grid-cols-3 gap-2 opacity-20">
              {featuredChannels.slice(0, 6).map((channel, idx) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="aspect-video rounded-lg overflow-hidden border-2 border-blue-400/30"
                >
                  <img
                    src={channel.image || "/placeholder.svg"}
                    alt={channel.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col justify-center items-start h-full p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <span className="text-blue-400 font-bold text-sm md:text-base uppercase tracking-wider">
                Breaking News
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Stay Informed
              <span className="text-blue-400"> Live</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Watch breaking news, live coverage, and in-depth analysis from
              trusted sources worldwide. Stay connected to what matters most.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/channels">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg font-semibold flex items-center gap-2"
                >
                  <Play size={24} fill="currentColor" />
                  Watch News Now
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 hover:border-white text-white px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-sm"
                >
                  Browse Channels
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breaking News Banner with Live Channels */}
      <section className="py-6 md:py-8 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-transparent rounded-xl border-l-4 border-blue-500 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 opacity-10">
          <div className="grid grid-cols-2 gap-1 h-full">
            {featuredChannels.slice(0, 4).map((channel) => (
              <div
                key={channel.id}
                className="aspect-video rounded overflow-hidden"
              >
                <img
                  src={channel.image || "/placeholder.svg"}
                  alt={channel.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <div className="flex-1">
            <div className="text-xs md:text-sm text-blue-400 font-semibold uppercase tracking-wider mb-1">
              Live Now
            </div>
            <div className="text-lg md:text-xl font-bold text-foreground">
              24/7 Live News Coverage from Around the World
            </div>
          </div>
          {channels.length > 0 && (
            <div className="text-sm text-blue-300 font-semibold">
              {channels.length}+ Channels
            </div>
          )}
        </div>
      </section>

      {/* Trending News Channels */}
      {channels.length > 0 && (
        <section className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trending News
              </h2>
            </div>
            <Link href="/channels">
              <Button
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
              >
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {channels.slice(0, 12).map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ChannelCard
                  item={channel}
                  viewMode="grid-small"
                  onPlay={() => onPlay?.(channel)}
                  onMoreInfo={() => onMoreInfo?.(channel)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section with Dynamic Channels */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Setflix News?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Get comprehensive news coverage from trusted sources worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const categoryChannels = getCategoryChannels(feature.category);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
                  {feature.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${feature.image}')` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent"></div>
                    </div>
                  )}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  {/* Channel count badge */}
                  {categoryChannels.length > 0 && (
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {categoryChannels.length}+ Channels
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70 text-lg mb-4">
                  {feature.description}
                </p>

                {/* Mini channel grid */}
                {categoryChannels.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {categoryChannels.slice(0, 4).map((channel) => (
                      <motion.div
                        key={channel.id}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="aspect-video rounded overflow-hidden border border-blue-500/30 cursor-pointer"
                        onClick={() => onPlay?.(channel)}
                      >
                        <img
                          src={channel.image || "/placeholder.svg"}
                          alt={channel.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Category Sections with Dynamic Channels */}
      {topCategories.slice(0, 3).map((category, catIndex) => {
        const categoryChannels =
          categorizedContent[category]?.slice(0, 8) || [];
        if (categoryChannels.length === 0) return null;

        return (
          <section key={category} className="relative py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {category}
              </h2>
              <Link href={`/channels?category=${encodeURIComponent(category)}`}>
                <Button
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300"
                >
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
                {categoryChannels.map((channel, index) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <ChannelCard
                      item={channel}
                      viewMode="grid-small"
                      onPlay={() => onPlay?.(channel)}
                      onMoreInfo={() => onMoreInfo?.(channel)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-900/10 via-blue-800/5 to-transparent rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-5 pointer-events-none">
          {channels.slice(0, 8).map((channel) => (
            <div
              key={channel.id}
              className="aspect-video rounded-lg overflow-hidden"
            >
              <img
                src={channel.image || "/placeholder.svg"}
                alt={channel.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Everything You Need to Stay Informed
            </h2>
            <ul className="space-y-4">
              {[
                "Live breaking news coverage",
                "International news channels",
                "In-depth analysis and reports",
                "Multiple language options",
                "HD quality streaming",
                "24/7 access to news",
              ].map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-lg text-foreground/80"
                >
                  <Check className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-xl overflow-hidden"
          >
            {featurePhotos[0]?.src?.large && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${featurePhotos[0].src.large}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 gap-2 opacity-10">
          {channels.slice(0, 12).map((channel) => (
            <div
              key={channel.id}
              className="aspect-video rounded overflow-hidden"
            >
              <img
                src={channel.image || "/placeholder.svg"}
                alt={channel.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Stay Connected to the World
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions staying informed with live news coverage from trusted
            sources
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/channels">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 px-8 py-6 text-lg font-semibold"
              >
                Watch News Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
