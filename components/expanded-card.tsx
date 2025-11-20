"use client";

import { Play, Plus, Check, ThumbsUp, ChevronDown, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ExpandedCardProps {
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
  onClose: () => void;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export default function ExpandedCard({
  item,
  onClose,
  onPlay,
  onMoreInfo,
}: ExpandedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute inset-0 w-full h-full bg-gradient-to-t from-card via-card/95 to-transparent flex flex-col justify-end"
    >
      <div className="p-4 space-y-2 overflow-y-auto max-h-full">
        <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {item.maturity && (
            <span className="px-2 py-0.5 border border-foreground/30 text-xs text-foreground/80">
              {item.maturity}
            </span>
          )}
          {item.year && (
            <span className="text-foreground/60 text-sm">{item.year}</span>
          )}
          {item.duration && (
            <span className="text-foreground/60 text-sm">{item.duration}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPlay}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded flex items-center justify-center gap-2 text-sm font-semibold transition"
          >
            <Play size={16} fill="currentColor" />
            Play
          </button>
          <button
            onClick={() => setIsInList(!isInList)}
            className="w-10 h-10 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition"
            aria-label={isInList ? "Remove from list" : "Add to list"}
          >
            {isInList ? <Check size={18} /> : <Plus size={18} />}
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="w-10 h-10 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition"
            aria-label="Like"
          >
            <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {item.description && (
          <p className="text-sm text-foreground/80 line-clamp-3">
            {item.description}
          </p>
        )}

        {item.genres && item.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.genres.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-xs text-foreground/60">
                {genre}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoreInfo?.();
          }}
          className="w-full flex items-center justify-center gap-2 text-sm text-foreground/80 hover:text-foreground transition py-2"
        >
          <Info size={16} />
          More Info
          <ChevronDown size={16} />
        </button>
      </div>
    </motion.div>
  );
}
