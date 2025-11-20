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
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function ContentCard({
  item,
  onPlay,
  onMoreInfo,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  const baseWidth = isMobile ? 144 : 176;
  const expandedWidth = isMobile ? 300 : 350;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="shrink-0 cursor-pointer group relative"
      animate={{
        width: isHovered ? `${expandedWidth}px` : `${baseWidth}px`,
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{ zIndex: isHovered ? 50 : 1 }}
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

          {/* Match/Rating Badge - Hidden for channels */}

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
