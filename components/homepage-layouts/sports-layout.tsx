"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Play,
  Zap,
  Globe,
  ArrowRight,
  Check,
  TrendingUp,
  MapPin,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { useMemo } from "react";
import ChannelCard from "@/components/channel-card";
import { SetflixContentItem } from "@/lib/iptv";

interface SportsLayoutProps {
  channels: SetflixContentItem[];
  categorizedContent: Record<string, SetflixContentItem[]>;
  topCategories: string[];
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

export default function SportsLayout({
  channels,
  categorizedContent,
  topCategories,
  onPlay,
  onMoreInfo,
}: SportsLayoutProps) {
  const { photo: heroPhoto, loading: heroLoading } = usePexelsMedia({
    query: "sports stadium live broadcast action",
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const { photos: featurePhotos } = usePexelsMedia({
    query: "sports competition athletes",
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

  // Get featured sports channels
  const featuredChannels = useMemo(() => {
    return channels.slice(0, 6);
  }, [channels]);

  // Get sports categories
  const sportsCategories = useMemo(() => {
    return topCategories
      .filter(
        (cat) =>
          cat.toLowerCase().includes("sport") ||
          cat.toLowerCase().includes("football") ||
          cat.toLowerCase().includes("basketball") ||
          cat.toLowerCase().includes("soccer") ||
          cat.toLowerCase().includes("tennis")
      )
      .slice(0, 3);
  }, [topCategories]);

  // Get channels for featured categories
  const getCategoryChannels = (category: string) => {
    return categorizedContent[category]?.slice(0, 6) || [];
  };

  const features = [
    {
      icon: Trophy,
      title: "Live Matches",
      description:
        "Watch live sports events from around the world in real-time",
      image: featurePhotos[0]?.src?.large || "",
      category: sportsCategories[0] || topCategories[0],
    },
    {
      icon: Zap,
      title: "24/7 Coverage",
      description: "Never miss a game with round-the-clock sports coverage",
      image: featurePhotos[1]?.src?.large || "",
      category: sportsCategories[1] || topCategories[1],
    },
    {
      icon: Globe,
      title: "Global Sports",
      description: "Access sports channels from every corner of the globe",
      image: featurePhotos[2]?.src?.large || "",
      category: sportsCategories[2] || topCategories[2],
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24">

      {/* World Cup 2026 Banner */}
      <section className="relative overflow-hidden rounded-2xl p-8 md:p-12 border border-[#ffc400]/30"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #060a18 40%, #1a0800 100%)",
          boxShadow: "0 0 60px rgba(255, 196, 0, 0.08), inset 0 1px 0 rgba(255, 196, 0, 0.15)",
        }}
      >
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffc400] to-transparent" />
        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none">
          <span className="text-[200px] opacity-[0.05]">🏆</span>
        </div>
        {/* Animated glow dots */}
        <div className="absolute top-8 right-32 w-48 h-48 rounded-full bg-[#ffc400]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 right-12 w-32 h-32 rounded-full bg-[#ff5e2b]/5 blur-2xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#ffc400]/15 border border-[#ffc400]/30 text-[#ffc400] font-bold text-xs uppercase tracking-[0.3em] px-3 py-1.5 rounded-full">
              <Trophy size={11} />
              FIFA World Cup 2026
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
            USA · CANADA · MEXICO
          </h2>
          <h3 className="text-2xl md:text-4xl font-black mb-4 leading-tight" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em", background: "linear-gradient(90deg, #ffc400, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            THE GREATEST SHOW ON EARTH
          </h3>
          <p className="text-white/60 text-base md:text-lg mb-6 font-medium">
            48 teams &nbsp;·&nbsp; 104 matches &nbsp;·&nbsp; 16 venues &nbsp;·&nbsp; Opening June 11, 2026
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/worldcup">
              <Button className="font-bold gap-2 px-6 py-5 text-base text-black" style={{ background: "linear-gradient(135deg, #ffc400, #ff8c00)" }}>
                <Trophy size={18} />
                World Cup Hub
              </Button>
            </Link>
            <Link href="/channels">
              <Button variant="outline" className="border-white/20 hover:border-[#ffc400]/50 text-white bg-white/5 backdrop-blur-sm gap-2 px-6 py-5 text-base hover:text-[#ffc400]">
                <Tv size={18} />
                Watch Sports Live
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Hero Section with Featured Channels */}
      <section className="relative min-h-[500px] md:min-h-[700px] rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${heroImage}')`,
            opacity: heroLoading ? 0.5 : 1,
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(6,10,24,0.97) 0%, rgba(12,30,18,0.90) 50%, rgba(6,10,24,0.95) 100%)" }}></div>
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
                  className="aspect-video rounded-lg overflow-hidden border-2 border-[#00d65a]/30"
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d65a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d65a]"></span>
              </div>
              <span className="text-[#00d65a] font-bold text-sm md:text-base uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-display)" }}>
                Live Sports Streaming
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
              NEVER MISS<br />A<span style={{ color: "#00d65a" }}> GAME</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Stream live sports from around the world. Watch football,
              basketball, tennis, and more in HD quality, anytime, anywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/channels">
                <Button
                  size="lg"
                  className="text-black px-8 py-6 text-lg font-bold flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #00d65a, #00a844)", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
                >
                  <Play size={22} fill="currentColor" />
                  START WATCHING
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/25 hover:border-[#00d65a]/60 text-white px-8 py-6 text-lg font-bold bg-white/5 backdrop-blur-sm hover:text-[#00d65a]"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
                >
                  BROWSE CHANNELS
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Sports Channels */}
      {channels.length > 0 && (
        <section className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#00d65a]" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trending Sports
              </h2>
            </div>
            <Link href="/channels">
              <Button
                variant="ghost"
                className="text-[#00d65a] hover:text-[#00ff7f]"
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
            Why Choose Setflix Sports?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Experience sports like never before with our Setflix+ streaming
            platform
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060a18]/90 via-[#0c1228]/40 to-transparent"></div>
                    </div>
                  )}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="w-14 h-14 rounded-full bg-[#00d65a] flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  {/* Channel count badge */}
                  {categoryChannels.length > 0 && (
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-[#00d65a]/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-bold">
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
                        className="aspect-video rounded overflow-hidden border border-[#00d65a]/30 cursor-pointer"
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
          categorizedContent[category]?.slice(0, 6) || [];
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
                  className="text-[#00d65a] hover:text-[#00ff7f]"
                >
                  View All <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
                      viewMode="grid-medium"
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

      {/* Stats Section with Dynamic Channel Count */}
      <section className="py-12 md:py-16 rounded-2xl border border-[#1c2d50] relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0,214,90,0.06) 0%, rgba(6,10,24,0.8) 50%, rgba(255,94,43,0.04) 100%)" }}>
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
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-[#00d65a] mx-auto mb-4" />
            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Live
            </div>
            <div className="text-foreground/60">Matches Now</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <Zap className="w-10 h-10 md:w-12 md:h-12 text-[#ff5e2b] mx-auto mb-4" />
            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              24/7
            </div>
            <div className="text-foreground/60">Coverage</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Play className="w-10 h-10 md:w-12 md:h-12 text-[#ffc400] mx-auto mb-4" />
            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              HD
            </div>
            <div className="text-foreground/60">Quality</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Globe className="w-10 h-10 md:w-12 md:h-12 text-[#00d65a] mx-auto mb-4" />
            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {channels.length > 0 ? `${channels.length}+` : "100+"}
            </div>
            <div className="text-foreground/60">Channels</div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 rounded-2xl text-center relative overflow-hidden border border-[#00d65a]/20" style={{ background: "linear-gradient(135deg, #001f0e 0%, #003318 50%, #001f0e 100%)", boxShadow: "0 0 80px rgba(0, 214, 90, 0.1)" }}>
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
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d65a] to-transparent" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}>
            READY TO WATCH LIVE SPORTS?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto font-medium">
            Join thousands of sports fans streaming their favorite games in HD quality
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/channels">
              <Button
                size="lg"
                className="text-black px-8 py-6 text-lg font-bold"
                style={{ background: "linear-gradient(135deg, #00d65a, #00a844)", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
              >
                EXPLORE CHANNELS
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#00d65a]/50 text-[#00d65a] hover:bg-[#00d65a]/10 px-8 py-6 text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
              >
                SIGN UP FREE
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
