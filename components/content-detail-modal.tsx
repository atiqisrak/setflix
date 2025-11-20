"use client";

import { useState, useEffect } from "react";
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants, backdropVariants } from "@/lib/animations";
import ContentCarousel from "@/components/content-carousel";

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    cast?: string[];
    director?: string;
    releaseDate?: string;
  };
}

export default function ContentDetailModal({
  isOpen,
  onClose,
  item,
}: ContentDetailModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "episodes" | "details"
  >("overview");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 min-h-screen"
          >
            {/* Hero Section */}
            <div className="relative h-[70vh] md:h-[80vh]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${item.image}')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent"></div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
                aria-label="Close"
              >
                <X size={24} className="text-foreground" />
              </button>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                    {item.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    {item.match && (
                      <span className="text-green-500 font-bold text-lg">
                        {item.match}p
                      </span>
                    )}
                    {item.year && (
                      <span className="text-foreground/80">{item.year}</span>
                    )}
                    {item.duration && (
                      <span className="text-foreground/80">
                        {item.duration}
                      </span>
                    )}
                    {item.maturity && (
                      <span className="px-2 py-1 border border-foreground/30 text-sm">
                        {item.maturity}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded flex items-center gap-2 font-semibold transition">
                      <Play size={20} fill="currentColor" />
                      Play
                    </button>
                    <button
                      onClick={() => setIsInList(!isInList)}
                      className="w-12 h-12 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition bg-black/50"
                      aria-label={isInList ? "Remove from list" : "Add to list"}
                    >
                      {isInList ? <Check size={20} /> : <Plus size={20} />}
                    </button>
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="w-12 h-12 border-2 border-foreground/30 hover:border-foreground rounded flex items-center justify-center transition bg-black/50"
                      aria-label="Like"
                    >
                      <ThumbsUp
                        size={20}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  {item.description && (
                    <p
                      className={`text-base md:text-lg text-foreground/90 max-w-2xl ${
                        isDescriptionExpanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {item.description}
                    </p>
                  )}

                  {item.description && item.description.length > 200 && (
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
                </div>
              </div>
            </div>

            {/* Tabs and Content */}
            <div className="bg-background px-8 md:px-12 py-8">
              <div className="max-w-4xl">
                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-border">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-4 px-2 font-semibold transition ${
                      activeTab === "overview"
                        ? "text-foreground border-b-2 border-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("episodes")}
                    className={`pb-4 px-2 font-semibold transition ${
                      activeTab === "episodes"
                        ? "text-foreground border-b-2 border-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Episodes
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-4 px-2 font-semibold transition ${
                      activeTab === "details"
                        ? "text-foreground border-b-2 border-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Details
                  </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                  {activeTab === "overview" && (
                    <div>
                      {item.genres && item.genres.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                            Genres
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {item.genres.map((genre, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-card border border-border rounded text-sm text-foreground/80"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                          More Like This
                        </h3>
                        <ContentCarousel
                          title=""
                          category="trending"
                          hideTitle
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "episodes" && (
                    <div>
                      <p className="text-foreground/60">Episodes coming soon</p>
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="space-y-4">
                      {item.cast && item.cast.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                            Cast
                          </h3>
                          <p className="text-foreground/80">
                            {item.cast.join(", ")}
                          </p>
                        </div>
                      )}
                      {item.director && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                            Director
                          </h3>
                          <p className="text-foreground/80">{item.director}</p>
                        </div>
                      )}
                      {item.releaseDate && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                            Release Date
                          </h3>
                          <p className="text-foreground/80">
                            {item.releaseDate}
                          </p>
                        </div>
                      )}
                      {item.rating && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground/60 mb-2">
                            Rating
                          </h3>
                          <p className="text-foreground/80">{item.rating}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
