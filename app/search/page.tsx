"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnimatedContentCard from "@/components/animated-content-card";
import VideoPlayer from "@/components/video-player";
import ContentDetailModal from "@/components/content-detail-modal";
import { Search, X } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import {
  SetflixContentItem,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    recentSearches,
    addRecentSearch,
  } = useSearch();

  const { channels, isLoading } = useIPTVChannels();

  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [selectedContent, setSelectedContent] =
    useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(6);

  useEffect(() => {
    const updateColsPerRow = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) setColsPerRow(2);
      else if (width < 768) setColsPerRow(3);
      else if (width < 1024) setColsPerRow(4);
      else if (width < 1280) setColsPerRow(5);
      else setColsPerRow(6);
    };

    updateColsPerRow();
    window.addEventListener("resize", updateColsPerRow);
    return () => window.removeEventListener("resize", updateColsPerRow);
  }, []);

  // Get grouped channels by category
  const groupedChannels = useMemo(() => {
    if (!channels.length) return {};
    return groupChannelsByCategory(channels);
  }, [channels]);

  // Filter channels by category if category param is present
  const categoryResults = useMemo(() => {
    if (!categoryParam || isLoading || !channels.length) return [];

    const displayCategory =
      categoryParam === "Undefined" ? "Browse" : categoryParam;
    const categoryChannels = groupedChannels[displayCategory] || [];

    return categoryChannels.map((channel, index) =>
      transformIPTVToContent(channel, index)
    );
  }, [categoryParam, channels, groupedChannels, isLoading]);

  // Determine which results to show
  const displayResults = categoryParam ? categoryResults : searchResults;
  const hasResults = displayResults.length > 0;
  const isCategorySearch = !!categoryParam;

  // Sync URL query param with search state
  useEffect(() => {
    if (queryParam && queryParam !== searchQuery && !categoryParam) {
      setSearchQuery(queryParam);
      addRecentSearch(queryParam);
    }
  }, [queryParam, setSearchQuery, addRecentSearch, searchQuery, categoryParam]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      addRecentSearch(query.trim());
      // Update URL without reload
      window.history.pushState(
        {},
        "",
        `/search?q=${encodeURIComponent(query.trim())}`
      );
    }
  };

  const handlePlay = (
    item:
      | SetflixContentItem
      | { url?: string; title: string; [key: string]: any }
  ) => {
    if (item.url) {
      setCurrentStreamUrl(item.url);
      setCurrentStreamTitle(item.title);
      setIsVideoPlayerOpen(true);
    }
  };

  const handleMoreInfo = (item: SetflixContentItem) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Search for channels, genres, categories..."
                className="w-full bg-card border border-border rounded px-12 py-4 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    window.history.pushState({}, "", "/search");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {!searchQuery && recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/80 mb-3">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 bg-card border border-border rounded text-sm text-foreground hover:bg-foreground/10 transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(isSearching || isLoading) && (
            <div className="flex items-center justify-center py-20">
              <div className="text-foreground/60">Loading channels...</div>
            </div>
          )}

          {!isSearching && !isLoading && (searchQuery || categoryParam) && (
            <div>
              {hasResults ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {isCategorySearch ? (
                      <>
                        {displayResults.length}{" "}
                        {displayResults.length === 1 ? "channel" : "channels"}{" "}
                        in <span className="text-accent">{categoryParam}</span>
                      </>
                    ) : (
                      <>
                        {displayResults.length} result
                        {displayResults.length !== 1 ? "s" : ""} for "
                        {searchQuery}"
                      </>
                    )}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
                    {displayResults.map((item, index) => (
                      <AnimatedContentCard
                        key={item.id}
                        item={item}
                        index={index}
                        layout="grid"
                        totalItems={displayResults.length}
                        colsPerRow={colsPerRow}
                        hoveredIndex={hoveredIndex}
                        onHover={setHoveredIndex}
                        onLeave={() => setHoveredIndex(null)}
                        onPlay={() => handlePlay(item)}
                        onMoreInfo={() => handleMoreInfo(item)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search size={48} className="text-foreground/30 mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    No results found
                  </h2>
                  <p className="text-foreground/60">
                    {isCategorySearch
                      ? `No channels found in ${categoryParam} category`
                      : "Try searching for something else"}
                  </p>
                </div>
              )}
            </div>
          )}

          {!isSearching && !isLoading && !searchQuery && !categoryParam && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={48} className="text-foreground/30 mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Search Setflix
              </h2>
              <p className="text-foreground/60">
                Find your favorite channels and content
              </p>
            </div>
          )}
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

      {selectedContent && (
        <ContentDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedContent(null);
          }}
          onPlay={handlePlay}
          item={selectedContent}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-24 px-4 md:px-8 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="text-foreground/60">Loading...</div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
