"use client";

import { useState, useEffect, useMemo } from "react";
import { SetflixContentItem } from "@/lib/iptv";
import AnimatedContentCard from "@/components/animated-content-card";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePexelsMedia } from "@/hooks/use-pexels-media";

interface LiveSpotlightProps {
  channels: SetflixContentItem[];
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

export default function LiveSpotlight({
  channels,
  onPlay,
  onMoreInfo,
}: LiveSpotlightProps) {
  const featuredChannels = channels.slice(0, 6);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(6);

  const { photo, loading: photoLoading } = usePexelsMedia({
    query: "live television streaming broadcast",
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const backgroundImage = useMemo(() => {
    if (photo?.src?.large2x) return photo.src.large2x;
    if (photo?.src?.large) return photo.src.large;
    return undefined;
  }, [photo]);

  useEffect(() => {
    const updateColsPerRow = () => {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setColsPerRow(isMobile ? 2 : isTablet ? 3 : 6);
    };

    updateColsPerRow();
    window.addEventListener("resize", updateColsPerRow);
    return () => window.removeEventListener("resize", updateColsPerRow);
  }, []);

  if (featuredChannels.length === 0) return null;

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
      
      {/* Dynamic Pexels Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5 transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            opacity: photoLoading ? 0 : 0.05,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background"></div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Live Now
              </h2>
            </div>
            <p className="text-foreground/60 text-lg">
              Channels streaming right now
            </p>
          </div>
          <Link
            href="/channels"
            className="hidden md:flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
          >
            View All
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AnimatedContentCard
                item={channel}
                index={index}
                layout="grid"
                totalItems={featuredChannels.length}
                colsPerRow={colsPerRow}
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
                onLeave={() => setHoveredIndex(null)}
                onPlay={onPlay ? () => onPlay(channel) : undefined}
                onMoreInfo={onMoreInfo ? () => onMoreInfo(channel) : undefined}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/channels"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-semibold"
          >
            View All Channels
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
