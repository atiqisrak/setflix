"use client";

import { useState, useEffect } from "react";
import { SetflixContentItem } from "@/lib/iptv";
import AnimatedContentCard from "@/components/animated-content-card";

interface ChannelGridProps {
  channels: SetflixContentItem[];
  maxItems?: number;
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

export default function ChannelGrid({
  channels,
  maxItems = 4,
  onPlay,
  onMoreInfo,
}: ChannelGridProps) {
  const displayChannels = channels.slice(0, maxItems);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(4);

  useEffect(() => {
    const updateColsPerRow = () => {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setColsPerRow(isMobile ? 2 : isTablet ? 3 : 4);
    };

    updateColsPerRow();
    window.addEventListener("resize", updateColsPerRow);
    return () => window.removeEventListener("resize", updateColsPerRow);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {displayChannels.map((channel, index) => (
        <AnimatedContentCard
          key={channel.id}
          item={channel}
          index={index}
          layout="grid"
          totalItems={displayChannels.length}
          colsPerRow={colsPerRow}
          hoveredIndex={hoveredIndex}
          onHover={setHoveredIndex}
          onLeave={() => setHoveredIndex(null)}
          onPlay={onPlay ? () => onPlay(channel) : undefined}
          onMoreInfo={onMoreInfo ? () => onMoreInfo(channel) : undefined}
        />
      ))}
    </div>
  );
}
