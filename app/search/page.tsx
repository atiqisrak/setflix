"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnimatedContentCard from "@/components/animated-content-card";
import VideoPlayer from "@/components/video-player";
import ContentDetailModal from "@/components/content-detail-modal";
import { Search, X, Play } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import { useMyList } from "@/hooks/use-my-list";
import {
  SetflixContentItem,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";
import type { MovieItem, SeriesItem } from "@/lib/content/types";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";

type SearchResultItem =
  | { type: "Live"; item: SetflixContentItem }
  | { type: "Movie"; item: MovieItem }
  | { type: "TV Show"; item: SeriesItem };

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
  const { addToList, isInList } = useMyList();

  const [catalogResults, setCatalogResults] = useState<{ movies: MovieItem[]; shows: SeriesItem[] }>({ movies: [], shows: [] });
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [selectedShow, setSelectedShow] = useState<SeriesItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [colsPerRow, setColsPerRow] = useState(5);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setCatalogResults({ movies: [], shows: [] });
      return;
    }
    setCatalogLoading(true);
    fetch(`/api/catalog/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setCatalogResults({
          movies: Array.isArray(data.movies) ? data.movies : [],
          shows: Array.isArray(data.shows) ? data.shows : [],
        });
      })
      .catch(() => setCatalogResults({ movies: [], shows: [] }))
      .finally(() => setCatalogLoading(false));
  }, [searchQuery]);

  useEffect(() => {
    const updateColsPerRow = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) setColsPerRow(2);
      else if (width < 768) setColsPerRow(3);
      else if (width < 1024) setColsPerRow(4);
      else if (width < 1280) setColsPerRow(5);
      else setColsPerRow(5);
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
  const isCategorySearch = !!categoryParam;
  const displayResultsForCategory = categoryParam ? categoryResults : [];
  const displayResultsUnified: SearchResultItem[] = useMemo(() => {
    if (categoryParam) return [];
    const live: SearchResultItem[] = searchResults.map((item) => ({ type: "Live" as const, item }));
    const movies: SearchResultItem[] = catalogResults.movies.map((item) => ({ type: "Movie" as const, item }));
    const shows: SearchResultItem[] = catalogResults.shows.map((item) => ({ type: "TV Show" as const, item }));
    return [...live, ...movies, ...shows];
  }, [categoryParam, searchResults, catalogResults]);

  const hasResults = isCategorySearch
    ? displayResultsForCategory.length > 0
    : displayResultsUnified.length > 0;

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
      | { url?: string; streamUrl?: string; title: string; [key: string]: unknown }
  ) => {
    const url = "url" in item ? item.url : "streamUrl" in item ? item.streamUrl : undefined;
    if (url) {
      setCurrentStreamUrl(url);
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

          {(isSearching || isLoading || (!!searchQuery && catalogLoading)) && (
            <div className="flex items-center justify-center py-20">
              <div className="text-foreground/60">Searching...</div>
            </div>
          )}

          {!isSearching && !isLoading && !(searchQuery && catalogLoading) && (searchQuery || categoryParam) && (
            <div>
              {hasResults ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {isCategorySearch ? (
                      <>
                        {displayResultsForCategory.length}{" "}
                        {displayResultsForCategory.length === 1 ? "channel" : "channels"}{" "}
                        in <span className="text-accent">{categoryParam}</span>
                      </>
                    ) : (
                      <>
                        {displayResultsUnified.length} result
                        {displayResultsUnified.length !== 1 ? "s" : ""} for &quot;
                        {searchQuery}&quot;
                      </>
                    )}
                  </h2>
                  {isCategorySearch ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
                      {displayResultsForCategory.map((item, index) => (
                        <AnimatedContentCard
                          key={item.id}
                          item={item}
                          index={index}
                          layout="grid"
                          totalItems={displayResultsForCategory.length}
                          colsPerRow={colsPerRow}
                          hoveredIndex={hoveredIndex}
                          onHover={setHoveredIndex}
                          onLeave={() => setHoveredIndex(null)}
                          onPlay={() => handlePlay(item)}
                          onMoreInfo={() => handleMoreInfo(item)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
                      {displayResultsUnified.map((entry, index) => {
                        if (entry.type === "Live") {
                          return (
                            <AnimatedContentCard
                              key={`live-${entry.item.id}`}
                              item={entry.item}
                              index={index}
                              layout="grid"
                              totalItems={displayResultsUnified.length}
                              colsPerRow={colsPerRow}
                              hoveredIndex={hoveredIndex}
                              onHover={setHoveredIndex}
                              onLeave={() => setHoveredIndex(null)}
                              onPlay={() => handlePlay(entry.item)}
                              onMoreInfo={() => handleMoreInfo(entry.item)}
                            />
                          );
                        }
                        const item = entry.item;
                        const isMovie = entry.type === "Movie";
                        const streamUrl = "streamUrl" in item ? item.streamUrl : undefined;
                        return (
                          <div
                            key={`${entry.type}-${item.id}`}
                            className="group relative rounded-lg overflow-hidden bg-card/50 aspect-[2/3] cursor-pointer"
                            onClick={() => isMovie ? setSelectedMovie(item as MovieItem) : setSelectedShow(item as SeriesItem)}
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent/90 text-accent-foreground">
                                {entry.type}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (streamUrl) {
                                      setCurrentStreamUrl(streamUrl);
                                      setCurrentStreamTitle(item.title);
                                      setIsVideoPlayerOpen(true);
                                    }
                                  }}
                                  disabled={!streamUrl}
                                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                  <Play size={12} fill="currentColor" />
                                  Play
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToList(item);
                                  }}
                                  className="px-2 py-1.5 border border-white/50 rounded text-xs text-white hover:bg-white/10 flex items-center gap-1"
                                >
                                  {isInList(item.id) ? "In list" : "Add"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

      {selectedMovie && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{selectedMovie.title}</h3>
            <p className="text-foreground/60 text-sm mb-4 line-clamp-3">{selectedMovie.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (selectedMovie.streamUrl) {
                    setCurrentStreamUrl(selectedMovie.streamUrl);
                    setCurrentStreamTitle(selectedMovie.title);
                    setIsVideoPlayerOpen(true);
                  }
                  setSelectedMovie(null);
                }}
                disabled={!selectedMovie.streamUrl}
                className="flex-1 bg-accent text-accent-foreground py-2 rounded font-semibold disabled:opacity-50"
              >
                Play
              </button>
              <button
                onClick={() => {
                  addToList(selectedMovie);
                  setSelectedMovie(null);
                }}
                className="px-4 py-2 border border-border rounded hover:bg-foreground/5"
              >
                {isInList(selectedMovie.id) ? "In list" : "Add to my list"}
              </button>
              <button onClick={() => setSelectedMovie(null)} className="px-4 py-2 rounded border border-border hover:bg-foreground/5">Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedShow && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{selectedShow.title}</h3>
            <p className="text-foreground/60 text-sm mb-4 line-clamp-3">{selectedShow.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const url = selectedShow.streamUrl || selectedShow.episodes?.[0]?.streamUrl;
                  if (url) {
                    setCurrentStreamUrl(url);
                    setCurrentStreamTitle(selectedShow.title);
                    setIsVideoPlayerOpen(true);
                  }
                  setSelectedShow(null);
                }}
                disabled={!selectedShow.streamUrl && !selectedShow.episodes?.length}
                className="flex-1 bg-accent text-accent-foreground py-2 rounded font-semibold disabled:opacity-50"
              >
                Play
              </button>
              <button
                onClick={() => {
                  addToList(selectedShow);
                  setSelectedShow(null);
                }}
                className="px-4 py-2 border border-border rounded hover:bg-foreground/5"
              >
                {isInList(selectedShow.id) ? "In list" : "Add to my list"}
              </button>
              <button onClick={() => setSelectedShow(null)} className="px-4 py-2 rounded border border-border hover:bg-foreground/5">Close</button>
            </div>
          </div>
        </div>
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
