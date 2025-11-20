"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChannelCard from "@/components/channel-card";
import VideoPlayer from "@/components/video-player";
import ContentDetailModal from "@/components/content-detail-modal";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useSearch } from "@/contexts/search-context";
import { SetflixContentItem, groupChannelsByCategory, transformIPTVToContent } from "@/lib/iptv";
import { Search, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function AllChannelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 24;

  const { channels, isLoading, error } = useIPTVChannels();
  const { setSearchQuery } = useSearch();

  // Group channels by category
  const groupedChannels = useMemo(() => {
    if (!channels.length) return {};
    return groupChannelsByCategory(channels);
  }, [channels]);

  // Get all categories sorted by channel count
  const categories = useMemo(() => {
    const cats = Object.keys(groupedChannels);
    return ["all", ...cats.sort((a, b) => {
      const countA = groupedChannels[a]?.length || 0;
      const countB = groupedChannels[b]?.length || 0;
      return countB - countA;
    })];
  }, [groupedChannels]);

  // Filter channels based on selected category and search
  const filteredChannels = useMemo(() => {
    let filtered = channels;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = groupedChannels[selectedCategory] || [];
    }

    // Apply search filter
    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (channel) =>
          channel.name.toLowerCase().includes(query) ||
          channel.group?.toLowerCase().includes(query)
      );
    }

    return filtered.map((channel, index) => transformIPTVToContent(channel, index));
  }, [channels, selectedCategory, groupedChannels, localSearchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredChannels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedChannels = filteredChannels.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, localSearchQuery]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              All Channels
            </h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition"
                />
                {localSearchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-900 transition"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className={`flex flex-wrap gap-2 transition-all duration-200 ${showFilters ? 'opacity-100 max-h-96 mb-4' : 'opacity-0 max-h-0 overflow-hidden mb-0'} md:opacity-100 md:max-h-none md:mb-0`}>
              {categories.map((category) => {
                const count = category !== "all" ? groupedChannels[category]?.length || 0 : channels.length;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                      selectedCategory === category
                        ? "bg-white text-black"
                        : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <span className="ml-2 text-xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count */}
          {!isLoading && !error && filteredChannels.length > 0 && (
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredChannels.length)} of {filteredChannels.length} channel{filteredChannels.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {localSearchQuery && ` matching "${localSearchQuery}"`}
              </div>
            </div>
          )}

          {/* Channels Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] bg-gray-900/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-red-400 mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Failed to load channels
              </h2>
              <p className="text-gray-400">
                Please try again later
              </p>
            </div>
          ) : filteredChannels.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
                {displayedChannels.map((item) => (
                  <ChannelCard
                    key={item.id}
                    item={item}
                    onPlay={() => handlePlay(item)}
                    onMoreInfo={() => handleMoreInfo(item)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-900">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition flex items-center gap-2 text-sm"
                    >
                      <ChevronLeft size={18} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {/* First page */}
                      {currentPage > 4 && totalPages > 7 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800 transition"
                          >
                            1
                          </button>
                          {currentPage > 5 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </>
                      )}

                      {/* Page range around current */}
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 7) {
                          pageNum = i + 1;
                        } else if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                              currentPage === pageNum
                                ? "bg-white text-black"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Last page */}
                      {currentPage < totalPages - 3 && totalPages > 7 && (
                        <>
                          {currentPage < totalPages - 4 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800 transition"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition flex items-center gap-2 text-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  {/* Page info */}
                  <div className="text-gray-400 text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={48} className="text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No channels found
              </h2>
              <p className="text-gray-400">
                {localSearchQuery
                  ? "Try a different search term"
                  : "No channels available in this category"}
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

