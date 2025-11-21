import { useState } from "react";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SetflixContentItem } from "@/lib/iptv";
import { cn } from "@/lib/utils";

type ViewMode = "grid-small" | "grid-medium" | "grid-large";

interface GridViewProps {
  item: SetflixContentItem;
  viewMode: ViewMode;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function GridView({
  item,
  viewMode,
  onPlay,
  onMoreInfo,
}: GridViewProps) {
  const [isHovered, setIsHovered] = useState(false);

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        />

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
            <Play size={viewMode === "grid-small" ? 12 : 14} fill="currentColor" />
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

