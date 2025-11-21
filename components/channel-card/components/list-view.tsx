import { useState } from "react";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SetflixContentItem } from "@/lib/iptv";

interface ListViewProps {
  item: SetflixContentItem;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function ListView({
  item,
  onPlay,
  onMoreInfo,
}: ListViewProps) {
  const [isHovered, setIsHovered] = useState(false);

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

