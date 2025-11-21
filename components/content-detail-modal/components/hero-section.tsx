import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
  item: {
    title: string;
    image: string;
    url?: string;
    match?: number;
    year?: number;
    duration?: string;
    maturity?: string;
    description?: string;
  };
  isLiked: boolean;
  isInList: boolean;
  onClose: () => void;
  onPlay?: () => void;
  onToggleLike: () => void;
  onToggleList: () => void;
}

export default function HeroSection({
  item,
  isLiked,
  isInList,
  onClose,
  onPlay,
  onToggleLike,
  onToggleList,
}: HeroSectionProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="relative h-[70vh] md:h-[80vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${item.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent"></div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
        aria-label="Close"
      >
        <X size={24} className="text-foreground" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {item.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            {item.match && (
              <span className="text-green-500 font-bold text-lg">
                {item.match}% Match
              </span>
            )}
            {item.year && (
              <span className="text-foreground/80">{item.year}</span>
            )}
            {item.duration && (
              <span className="text-foreground/80">{item.duration}</span>
            )}
            {item.maturity && (
              <span className="px-2 py-1 border border-foreground/30 text-sm">
                {item.maturity}
              </span>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={onPlay}
              disabled={!item.url || !onPlay}
              className="bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-accent-foreground px-8 py-3 rounded flex items-center gap-2 font-semibold transition"
            >
              <Play size={20} fill="currentColor" />
              Play
            </button>
            <button
              onClick={onToggleList}
              className="w-12 h-12 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition bg-black/50"
              aria-label={isInList ? "Remove from list" : "Add to list"}
            >
              {isInList ? <Check size={20} /> : <Plus size={20} />}
            </button>
            <button
              onClick={onToggleLike}
              className="w-12 h-12 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition bg-black/50"
              aria-label="Like"
            >
              <ThumbsUp size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>

          {item.description && (
            <>
              <p
                className={`text-base md:text-lg text-foreground/90 max-w-2xl ${
                  isDescriptionExpanded ? "" : "line-clamp-3"
                }`}
              >
                {item.description}
              </p>
              {item.description.length > 200 && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-2 text-foreground/80 hover:text-foreground flex items-center gap-1 transition"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show Less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
