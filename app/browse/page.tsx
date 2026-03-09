"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import AnimatedContentCard from "@/components/animated-content-card";
import Pagination from "@/components/channels/pagination";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import {
  SetflixContentItem,
  filterChannels,
  transformIPTVToContent,
} from "@/lib/iptv";

const ITEMS_PER_PAGE = 24;

export default function BrowsePage() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");

  const { contentItems, channels, isLoading, error } = useIPTVChannels();

  const genres = [
    "All",
    "News",
    "Sports",
    "Entertainment",
    "Movies",
    "Music",
    "Documentary",
  ];

  // Update columns per row based on screen size
  useEffect(() => {
    const updateColsPerRow = () => {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth < 640;
      setIsMobile(isMobile);
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const isDesktop = window.innerWidth >= 1024 && window.innerWidth < 1280;
      setColsPerRow(isMobile ? 2 : isTablet ? 3 : isDesktop ? 4 : 5);
    };

    updateColsPerRow();
    window.addEventListener("resize", updateColsPerRow);
    return () => window.removeEventListener("resize", updateColsPerRow);
  }, []);

  // Filter channels by selected genre
  const filteredChannels = useMemo(() => {
    if (selectedGenre === "all") {
      return contentItems;
    }
    const filtered = filterChannels(channels, selectedGenre);
    return filtered.map((channel, index) =>
      transformIPTVToContent(channel, index)
    );
  }, [selectedGenre, contentItems, channels]);

  // Pagination logic
  const totalPages = useMemo(() => {
    return Math.ceil(filteredChannels.length / ITEMS_PER_PAGE);
  }, [filteredChannels.length]);

  const paginatedChannels = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredChannels.slice(startIndex, endIndex);
  }, [filteredChannels, currentPage]);

  // Reset to page 1 when genre changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  const handlePlay = (item: SetflixContentItem) => {
    if (item.url) {
      setCurrentStreamUrl(item.url);
      setCurrentStreamTitle(item.title);
      setIsVideoPlayerOpen(true);
    }
  };

  const handleMoreInfo = (item: SetflixContentItem) => {
    // You can implement a modal or navigation here if needed
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8 relative">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Browse All
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre.toLowerCase())}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition ${
                  selectedGenre === genre.toLowerCase()
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="text-foreground/60 py-8">Loading channels...</div>
          ) : error ? (
            <div className="text-foreground/60 py-8">
              Failed to load channels. Please try again later.
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {selectedGenre === "all" ? (
                    <>All Channels ({filteredChannels.length})</>
                  ) : (
                    <>
                      {selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Channels ({filteredChannels.length})
                    </>
                  )}
                </h2>
              </div>

              {paginatedChannels.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                    {paginatedChannels.map((item, index) => (
                      <AnimatedContentCard
                        key={item.id}
                        item={item}
                        index={index}
                        layout="grid"
                        totalItems={paginatedChannels.length}
                        colsPerRow={colsPerRow}
                        hoveredIndex={hoveredIndex}
                        onHover={setHoveredIndex}
                        onLeave={() => setHoveredIndex(null)}
                        disableHover={isMobile}
                        onPlay={() => handlePlay(item)}
                        onMoreInfo={() => handleMoreInfo(item)}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-foreground/60 py-8 text-center">
                  No channels found in this category.
                </div>
              )}
            </>
          )}

          {/* Gradient overlay for visual */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
          </div>
        </div>
      </main>

      <Footer />

      <VideoPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => {
          setIsVideoPlayerOpen(false);
          setCurrentStreamUrl("");
          setCurrentStreamTitle("");
        }}
        streamUrl={currentStreamUrl}
        title={currentStreamTitle}
      />
    </div>
  );
}
