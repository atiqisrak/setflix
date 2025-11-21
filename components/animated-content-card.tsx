"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ContentCard from "@/components/content-card";

interface AnimatedContentCardProps {
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
    url?: string;
  };
  index: number;
  layout: "carousel" | "grid";
  totalItems: number;
  colsPerRow?: number; // For grid layout
  hoveredIndex: number | null;
  onHover: (index: number) => void;
  onLeave: () => void;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function AnimatedContentCard({
  item,
  index,
  layout,
  totalItems,
  colsPerRow,
  hoveredIndex,
  onHover,
  onLeave,
  onPlay,
  onMoreInfo,
}: AnimatedContentCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isCardHovered = hoveredIndex === index;

  // Calculate transform based on layout type
  const getTransform = () => {
    if (hoveredIndex === null || isCardHovered) {
      return { scale: 1, x: 0, y: 0 };
    }

    if (layout === "carousel") {
      // Carousel: horizontal push only
      const isLeft = index < hoveredIndex;
      const distance = Math.abs(index - hoveredIndex);

      if (distance > 2) {
        return { scale: 1, x: 0, y: 0 };
      }

      const scale = distance === 1 ? 0.92 : 0.96;
      let x = 0;

      if (distance === 1) {
        x = isLeft ? -30 : 100;
      } else if (distance === 2) {
        x = isLeft ? -15 : 40;
      }

      return { scale, x, y: 0 };
    } else {
      // Grid: push in all directions
      if (!colsPerRow) return { scale: 1, x: 0, y: 0 };

      const hoveredRow = Math.floor(hoveredIndex / colsPerRow);
      const hoveredCol = hoveredIndex % colsPerRow;
      const currentRow = Math.floor(index / colsPerRow);
      const currentCol = index % colsPerRow;

      const isLeft = currentCol < hoveredCol;
      const isRight = currentCol > hoveredCol;
      const isTop = currentRow < hoveredRow;
      const isBottom = currentRow > hoveredRow;

      // Check if adjacent
      const isAdjacent =
        (isLeft && currentRow === hoveredRow) ||
        (isRight && currentRow === hoveredRow) ||
        (isTop && currentCol === hoveredCol) ||
        (isBottom && currentCol === hoveredCol);

      if (!isAdjacent) {
        return { scale: 1, x: 0, y: 0 };
      }

      let x = 0;
      let y = 0;

      if (isLeft) x = -30;
      if (isRight) x = 30;
      if (isTop) y = -30;
      if (isBottom) y = 30;

      return { scale: 0.95, x, y };
    }
  };

  const transform = getTransform();

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      animate={{
        x: transform.x,
        y: transform.y,
        scale: transform.scale,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        zIndex: isCardHovered ? 50 : hoveredIndex !== null ? 10 : 1,
      }}
    >
      <ContentCard
        item={item}
        index={index}
        hoveredIndex={hoveredIndex}
        onHover={() => onHover(index)}
        onLeave={onLeave}
        onPlay={onPlay}
        onMoreInfo={onMoreInfo}
      />
    </motion.div>
  );
}
