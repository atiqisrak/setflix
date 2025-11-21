"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpandedCard from "@/components/expanded-card";

interface ContentCardProps {
  item: {
    id: number;
    title: string;
    image: string;
    rating?: number;
    year?: number;
    duration?: string;
    genres?: string[];
    description?: string;
    match?: number;
    maturity?: string;
  };
  index?: number;
  hoveredIndex?: number | null;
  onHover?: () => void;
  onLeave?: () => void;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function ContentCard({
  item,
  index = 0,
  hoveredIndex = null,
  onHover,
  onLeave,
  onPlay,
  onMoreInfo,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const isCardHovered = hoveredIndex === index;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    onHover?.();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    onLeave?.();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  // Calculate transform based on position relative to hovered card
  const getTransform = () => {
    if (hoveredIndex === null) {
      return { scale: 1, x: 0 };
    }

    if (isCardHovered) {
      // Hovered card scales up
      return { scale: 1.1, x: 0 };
    }

    const isLeft = index < hoveredIndex;
    const distance = Math.abs(index - hoveredIndex);

    // Only affect cards within 2 positions of hovered card
    if (distance > 2) {
      return { scale: 1, x: 0 };
    }

    // Scale down adjacent cards slightly
    const scale = distance === 1 ? 0.92 : 0.96;

    // Translate away from hovered card with stronger push effect
    // Cards on the left move left, cards on the right move right
    // Immediate neighbors get stronger push, especially the right card
    let x = 0;
    if (distance === 1) {
      // Immediate neighbor - strong push
      // Right card gets extra push to create the "pushing" feel
      if (isLeft) {
        x = -50; // Left card moves left
      } else {
        x = 70; // Right card moves right more prominently
      }
    } else if (distance === 2) {
      // Second neighbor - moderate push
      x = isLeft ? -25 : 30;
    }

    return { scale, x };
  };

  const transform = getTransform();

  const baseWidth = isMobile ? 144 : 176;
  const expandedWidth = isMobile ? 300 : 350;

  // Use the calculated transform directly
  const finalTransform = transform;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="shrink-0 cursor-pointer group relative"
      initial={{ width: baseWidth, flexBasis: baseWidth }}
      animate={{
        width: isHovered ? expandedWidth : baseWidth,
        flexBasis: isHovered ? expandedWidth : baseWidth,
        scale: isCardHovered ? 1.1 : finalTransform.scale,
        x: finalTransform.x,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        scale: { duration: 0.3 },
        x: { duration: 0.3 },
      }}
      style={{
        zIndex: isCardHovered ? 50 : isHovered ? 40 : 1,
        transformOrigin: "center center",
      }}
    >
      <div
        className="relative bg-card rounded overflow-hidden w-full"
        style={{ height: isMobile ? "216px" : "264px" }}
      >
        {/* Thumbnail - Expands horizontally, maintains fixed height */}
        <div className="relative w-full h-full bg-secondary overflow-hidden rounded">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* LIVE Badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400"></span>
            </span>
            <span className="text-white text-xs font-bold uppercase tracking-wide">
              Live
            </span>
          </div>

          {/* Expanded Card on Hover - Overlays on thumbnail */}
          <AnimatePresence>
            {isHovered && (
              <ExpandedCard
                item={{
                  ...item,
                  match: item.match || item.rating,
                }}
                onClose={() => setIsHovered(false)}
                onPlay={onPlay}
                onMoreInfo={onMoreInfo}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
