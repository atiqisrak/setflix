"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContentCard from "@/components/content-card";
import VideoPlayer from "@/components/video-player";
import ContentDetailModal from "@/components/content-detail-modal";
import { Search, X } from "lucide-react";
import { useSearch } from "@/contexts/search-context";
import { SetflixContentItem } from "@/lib/iptv";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    recentSearches,
    addRecentSearch,
  } = useSearch();

  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync URL query param with search state
  useEffect(() => {
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
      addRecentSearch(queryParam);
    }
  }, [queryParam, setSearchQuery, addRecentSearch, searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      addRecentSearch(query.trim());
      // Update URL without reload
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePlay = (item: SetflixContentItem) => {
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

          {isSearching && (
            <div className="flex items-center justify-center py-20">
              <div className="text-foreground/60">Loading channels...</div>
            </div>
          )}

          {!isSearching && searchQuery && (
            <div>
              {searchResults.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.map((item) => (
                      <ContentCard
                        key={item.id}
                        item={item}
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
                    Try searching for something else
                  </p>
                </div>
              )}
            </div>
          )}

          {!isSearching && !searchQuery && (
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
          item={selectedContent}
        />
      )}
    </div>
  );
}
