"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ChannelCard from "@/components/channel-card";
import { SetflixContentItem } from "@/lib/iptv";
import { cn } from "@/lib/utils";

type ViewMode = "grid-small" | "grid-medium" | "grid-large" | "list";

interface ChannelsGridProps {
  channels: SetflixContentItem[];
  viewMode: ViewMode;
  onPlay: (item: SetflixContentItem) => void;
  onMoreInfo: (item: SetflixContentItem) => void;
  isLoading?: boolean;
  error?: Error | null;
  searchQuery?: string;
}

export default function ChannelsGrid({
  channels,
  viewMode,
  onPlay,
  onMoreInfo,
  isLoading = false,
  error = null,
  searchQuery = "",
}: ChannelsGridProps) {
  const getGridClasses = () => {
    switch (viewMode) {
      case "grid-small":
        return "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8";
      case "grid-medium":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
      case "grid-large":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
    }
  };

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 md:gap-6", getGridClasses())}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-gray-900/50 rounded-lg animate-pulse",
              viewMode === "list" ? "h-24" : "aspect-video"
            )}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-red-400 mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Failed to load channels
        </h2>
        <p className="text-gray-400">Please try again later</p>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          No channels found
        </h2>
        <p className="text-gray-400">
          {searchQuery
            ? "Try a different search term"
            : "No channels available"}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", getGridClasses())}>
      {channels.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
          className={cn(
            viewMode === "list" &&
              "flex items-center gap-4 p-4 bg-gray-900/30 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition"
          )}
        >
          <ChannelCard
            item={item}
            onPlay={() => onPlay(item)}
            onMoreInfo={() => onMoreInfo(item)}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </div>
  );
}
