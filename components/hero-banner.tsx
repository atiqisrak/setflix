"use client";

import { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";

interface HeroContent {
  title: string;
  description: string;
  image: string;
  match?: number;
  year?: number;
  maturity?: string;
}

const HERO_CONTENT: HeroContent[] = [
  {
    title: "The Ultimate Streaming Experience",
    description:
      "Stream thousands of live channels and on-demand movies. Watch anywhere, anytime.",
    image: "/cinematic-netflix-style-hero-banner-dark-professio.jpg",
    match: 98,
    year: 2024,
    maturity: "TV-MA",
  },
  {
    title: "Live News & Breaking Stories",
    description:
      "Stay informed with 24/7 live news coverage from around the world.",
    image: "/live-news-broadcast-professional.jpg",
    match: 95,
    year: 2024,
    maturity: "TV-PG",
  },
  {
    title: "Sports Action Live",
    description:
      "Catch all the live sports action, highlights, and exclusive coverage.",
    image: "/sports-broadcast-stadium-live.jpg",
    match: 92,
    year: 2024,
    maturity: "TV-G",
  },
];

interface HeroBannerProps {
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function HeroBanner({ onPlay, onMoreInfo }: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_CONTENT.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentContent = HERO_CONTENT[currentIndex];

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
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${currentContent.image}')`,
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
            <div className="flex items-center gap-4 flex-wrap">
              {currentContent.match && (
                <span className="text-green-500 font-bold text-lg">
                  {currentContent.match}% Match
                </span>
              )}
              {currentContent.year && (
                <span className="text-foreground/80">
                  {currentContent.year}
                </span>
              )}
              {currentContent.maturity && (
                <span className="px-2 py-1 border border-foreground/30 text-sm">
                  {currentContent.maturity}
                </span>
              )}
            </div>

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
            Play
          </Button>
          <Button
            onClick={onMoreInfo}
            className="border-2 border-foreground/50 hover:border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold flex items-center gap-2 rounded bg-black/50 hover:bg-black/70 transition backdrop-blur-sm"
          >
            <Info size={24} />
            More Info
          </Button>
        </div>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-black/70 hover:bg-black/90 p-3 rounded-full transition z-20"
        aria-label="Toggle mute"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-foreground"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isMuted ? (
            <path d="M8.707 7.293a1 1 0 00-1.414 1.414l.707.707H7a4 4 0 000 8h4a1 1 0 100-2H7a2 2 0 010-4h1a1 1 0 00.707-.293l2-2a1 1 0 00-1.414-1.414z" />
          ) : (
            <path d="M9 4a1 1 0 012 0v12a1 1 0 11-2 0V4zm0 0a4 4 0 100 8 4 4 0 000-8z" />
          )}
        </svg>
      </button>

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
