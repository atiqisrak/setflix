"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import AnimatedContentCard from "@/components/animated-content-card";
import Pagination from "@/components/channels/pagination";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useRecentlyWatched } from "@/hooks/use-recently-watched";
import {
  SetflixContentItem,
  filterChannels,
  transformIPTVToContent,
} from "@/lib/iptv";

const ITEMS_PER_PAGE = 24;

const GENRES = ["All", "News", "Sports", "Entertainment", "Movies", "Music", "Documentary"];

export default function BrowsePage() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState("");

  const { contentItems, channels, isLoading, error } = useIPTVChannels();
  const { addItem } = useRecentlyWatched();

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setColsPerRow(w < 640 ? 2 : w < 1024 ? 3 : w < 1280 ? 4 : 5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filteredChannels = useMemo(() => {
    if (selectedGenre === "all") return contentItems;
    return filterChannels(channels, selectedGenre).map((ch, i) =>
      transformIPTVToContent(ch, i)
    );
  }, [selectedGenre, contentItems, channels]);

  const totalPages = useMemo(
    () => Math.ceil(filteredChannels.length / ITEMS_PER_PAGE),
    [filteredChannels.length]
  );

  const paginatedChannels = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredChannels.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredChannels, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [selectedGenre]);

  const handlePlay = (item: SetflixContentItem) => {
    if (!item.url) return;
    addItem({ id: String(item.id), title: item.title, url: item.url, logo: item.image, group: item.genres?.[0] });
    setCurrentStreamUrl(item.url);
    setCurrentStreamTitle(item.title);
    setIsVideoPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Browse All</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {GENRES.map((genre) => (
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

        {isLoading ? (
          <div className="text-foreground/60 py-8">Loading channels…</div>
        ) : error ? (
          <div className="text-foreground/60 py-8">Failed to load channels. Please try again.</div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {selectedGenre === "all"
                  ? `All Channels (${filteredChannels.length})`
                  : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} (${filteredChannels.length})`}
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
                      onMoreInfo={() => {}}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </>
            ) : (
              <div className="text-foreground/60 py-8 text-center">No channels found in this category.</div>
            )}
          </>
        )}
      </main>

      <Footer />

      <VideoPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => { setIsVideoPlayerOpen(false); setCurrentStreamUrl(""); setCurrentStreamTitle(""); }}
        streamUrl={currentStreamUrl}
        title={currentStreamTitle}
      />
    </div>
  );
}
