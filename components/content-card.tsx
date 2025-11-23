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
  disableHover?: boolean;
}

export default function ContentCard({
  item,
  index = 0,
  hoveredIndex = null,
  onHover,
  onLeave,
  onPlay,
  onMoreInfo,
  disableHover = false,
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
    if (disableHover) return;
    onHover?.();
    // Show expanded card overlay after delay (for UX)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (disableHover) return;
    onLeave?.();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  // Transform logic is now handled by AnimatedContentCard wrapper
  // This component only handles width expansion and overlay

  const baseWidth = isMobile ? 144 : 250;
  const expandedWidth = isMobile ? 300 : 350;

  // When hover interactions are disabled (touch devices), render full-width within grid cell
  const effectiveBase = disableHover ? "100%" : baseWidth;
  const effectiveExpanded = disableHover ? "100%" : expandedWidth;

  // Card should expand immediately when hovered (either via local hover or carousel hover tracking)
  // isCardHovered is set immediately when hoveredIndex matches, ensuring instant expansion
  // isHovered is for the expanded card overlay (has delay for better UX)
  const shouldExpand = isCardHovered || isHovered;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer group relative ${disableHover ? "w-full" : "shrink-0"}`}
      initial={{ width: effectiveBase, flexBasis: effectiveBase }}
      animate={{
        width: shouldExpand ? effectiveExpanded : effectiveBase,
        flexBasis: shouldExpand ? effectiveExpanded : effectiveBase,
      }}
      transition={{
        width: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
        flexBasis: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
      style={{
        zIndex: isCardHovered ? 50 : isHovered ? 40 : 1,
        transformOrigin: "center center",
      }}
    >
      <div
        className="relative bg-card rounded overflow-hidden w-full"
        style={{ height: isMobile ? "216px" : "250px" }}
      >
        {/* Thumbnail - Expands horizontally, maintains fixed height */}
        <div className="relative w-full h-full bg-secondary overflow-hidden rounded border border-foreground/10">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-contain"
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
