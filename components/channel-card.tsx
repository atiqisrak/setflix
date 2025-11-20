"use client";

import { useState } from "react";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SetflixContentItem } from "@/lib/iptv";
import { cn } from "@/lib/utils";

type ViewMode = "grid-small" | "grid-medium" | "grid-large" | "list";

interface ChannelCardProps {
  item: SetflixContentItem;
  onPlay?: () => void;
  onMoreInfo?: () => void;
  viewMode?: ViewMode;
}

export default function ChannelCard({
  item,
  onPlay,
  onMoreInfo,
  viewMode = "grid-medium",
}: ChannelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // List view variant
  if (viewMode === "list") {
    return (
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative cursor-pointer w-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative w-full bg-gray-900/30 rounded-lg overflow-hidden border border-gray-800 flex items-center gap-4 p-4 hover:bg-gray-900/50 transition">
          {/* Logo */}
          <div className="relative w-24 h-16 bg-black rounded shrink-0 flex items-center justify-center p-2 border border-gray-900">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm md:text-base line-clamp-1 mb-1">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-gray-400 text-xs line-clamp-1">
                {item.description}
              </p>
            )}
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.genres.slice(0, 2).map((genre, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-800/50 text-gray-300 text-xs rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.();
              }}
              className="bg-white text-black px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-white/90 transition flex items-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              <span className="hidden sm:inline">Play</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoreInfo?.();
              }}
              className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-white/30 transition flex items-center gap-2 border border-white/30"
            >
              <Info size={14} />
              <span className="hidden sm:inline">Info</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Grid view variants
  const getAspectRatio = () => {
    switch (viewMode) {
      case "grid-small":
        return "aspect-[4/3]";
      case "grid-medium":
        return "aspect-[4/3]";
      case "grid-large":
        return "aspect-[3/4]";
      default:
        return "aspect-[4/3]";
    }
  };

  const getPadding = () => {
    switch (viewMode) {
      case "grid-small":
        return "p-2";
      case "grid-medium":
        return "p-3";
      case "grid-large":
        return "p-4";
      default:
        return "p-3";
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative bg-black rounded-lg overflow-hidden border border-gray-900",
          getAspectRatio()
        )}
      >
        {/* Logo Container */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black",
            getPadding()
          )}
        >
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className={cn(
              "max-w-full max-h-full object-contain",
              viewMode === "grid-small"
                ? "max-w-[75%] max-h-[75%]"
                : "max-w-[85%] max-h-[85%]"
            )}
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
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2",
            viewMode === "grid-small" && "gap-1.5"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className={cn(
              "bg-white text-black rounded-md font-semibold hover:bg-white/90 transition flex items-center gap-1.5 shadow-lg",
              viewMode === "grid-small"
                ? "px-2 py-1 text-xs"
                : "px-3 py-1.5 text-sm"
            )}
          >
            <Play
              size={viewMode === "grid-small" ? 12 : 14}
              fill="currentColor"
            />
            {viewMode !== "grid-small" && <span>Play</span>}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo?.();
            }}
            className={cn(
              "bg-white/20 backdrop-blur-sm text-white rounded-md font-semibold hover:bg-white/30 transition flex items-center gap-1.5 border border-white/30",
              viewMode === "grid-small"
                ? "px-2 py-1 text-xs"
                : "px-3 py-1.5 text-sm"
            )}
          >
            <Info size={viewMode === "grid-small" ? 12 : 14} />
            {viewMode !== "grid-small" && <span>Info</span>}
          </button>
        </motion.div>

        {/* Channel title at bottom */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent",
            viewMode === "grid-small" ? "p-2" : "p-3"
          )}
        >
          <h3
            className={cn(
              "text-white font-medium line-clamp-2",
              viewMode === "grid-small" ? "text-xs" : "text-sm"
            )}
          >
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
