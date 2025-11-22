"use client";

import { useState, useEffect, useMemo } from "react";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { usePexelsMedia } from "@/hooks/use-pexels-media";

interface HeroContent {
  title: string;
  description: string;
  query: string;
  isLive?: boolean;
}

const HERO_CONTENT: HeroContent[] = [
  {
    title: "Live TV Channels",
    description:
      "Stream thousands of live channels from around the world. Watch news, sports, entertainment, and more in real-time.",
    query: "live television broadcast studio",
    isLive: true,
  },
  {
    title: "24/7 Live News",
    description:
      "Stay informed with breaking news and live coverage from trusted sources worldwide.",
    query: "news broadcast television studio",
    isLive: true,
  },
  {
    title: "Live Sports Action",
    description:
      "Catch all the live sports action, matches, and exclusive coverage as they happen.",
    query: "sports broadcast stadium live",
    isLive: true,
  },
];

interface HeroBannerProps {
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function HeroBanner({ onPlay, onMoreInfo }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentContent = HERO_CONTENT[currentIndex];

  const { photo: currentPhoto, loading: photoLoading } = usePexelsMedia({
    query: currentContent.query,
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const backgroundImage = useMemo(() => {
    if (currentPhoto?.src?.large2x) {
      return currentPhoto.src.large2x;
    }
    if (currentPhoto?.src?.large) {
      return currentPhoto.src.large;
    }
    return "/live-news-broadcast-professional.jpg";
  }, [currentPhoto]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[80vh] lg:h-screen bg-background overflow-hidden pt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeVariants}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              opacity: photoLoading ? 0.5 : 1,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl pt-8 md:pt-0 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mb-8"
          >
            {currentContent.isLive && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-bold text-sm md:text-base uppercase tracking-wider">
                  Live Now
                </span>
              </div>
            )}

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-pretty">
              {currentContent.title}
            </h2>
            <p className="text-base md:text-lg text-foreground/90 max-w-lg text-pretty">
              {currentContent.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-3 md:gap-4">
          <Button
            onClick={onPlay}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold flex items-center gap-2 rounded transition shadow-lg"
          >
            <Play size={24} fill="currentColor" />
            Watch Live
          </Button>
          <Button
            onClick={onMoreInfo}
            className="border-2 border-foreground/50 hover:border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold flex items-center gap-2 rounded bg-black/50 hover:bg-black/70 transition backdrop-blur-sm"
          >
            <Info size={24} />
            Browse Channels
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_CONTENT.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition ${
              index === currentIndex
                ? "w-8 bg-accent"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
