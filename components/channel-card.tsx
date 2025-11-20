"use client";

import { useState } from "react";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SetflixContentItem } from "@/lib/iptv";

interface ChannelCardProps {
  item: SetflixContentItem;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function ChannelCard({
  item,
  onPlay,
  onMoreInfo,
}: ChannelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden border border-gray-900">
        {/* Logo Container - Contained with dark background */}
        <div className="absolute inset-0 flex items-center justify-center bg-black p-3">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="max-w-[85%] max-h-[85%] object-contain"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        />

        {/* Action buttons on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center gap-3"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-white/90 transition flex items-center gap-2 shadow-lg"
          >
            <Play size={16} fill="currentColor" />
            Play
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo?.();
            }}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-white/30 transition flex items-center gap-2 border border-white/30"
          >
            <Info size={16} />
            Info
          </button>
        </motion.div>

        {/* Channel title at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-white font-medium text-sm line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

