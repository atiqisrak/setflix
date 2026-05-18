"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import ContentDetailModal from "@/components/content-detail-modal";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useSearch } from "@/contexts/search-context";
import {
  SetflixContentItem,
  groupChannelsByCategory,
  transformIPTVToContent,
  getUniqueCountries,
} from "@/lib/iptv";
import { SlidersHorizontal, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FilterSidebar from "@/components/channels/filter-sidebar";
import SearchBar from "@/components/channels/search-bar";
import ViewControls from "@/components/channels/view-controls";
import ChannelsGrid from "@/components/channels/channels-grid";
import Pagination from "@/components/channels/pagination";
import ProviderTabs from "@/components/channels/provider-tabs";
import { useProviderContext } from "@/contexts/provider-context";
import { localStorageUtils } from "@/lib/storage/storage-utils";
import { useRecentlyWatched } from "@/hooks/use-recently-watched";

type ViewMode = "grid-small" | "grid-medium" | "grid-large" | "list";

const SELECTED_PROVIDER_KEY = "setflix-channels-selected-provider";

export default function AllChannelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [selectedContent, setSelectedContent] =
    useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid-medium");
  const [recentFilters, setRecentFilters] = useState<string[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const { currentProvider, selectProvider } = useProviderContext();
  const { addItem } = useRecentlyWatched();

  useEffect(() => {
    const saved = localStorage.getItem("recent-filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentFilters(parsed);
      } catch {}
    }

    const savedProvider = localStorageUtils.get<string>(SELECTED_PROVIDER_KEY);
    if (savedProvider) {
      setSelectedProviderId(savedProvider);
    } else if (currentProvider) {
      setSelectedProviderId(currentProvider.id);
    }
  }, [currentProvider]);

  useEffect(() => {
    if (selectedProviderId) {
      localStorageUtils.set(SELECTED_PROVIDER_KEY, selectedProviderId);
      selectProvider(selectedProviderId);
    }
  }, [selectedProviderId, selectProvider]);

  const ITEMS_PER_PAGE = 24;

  const { channels, isLoading, error } = useIPTVChannels(selectedProviderId || undefined);
  const { setSearchQuery } = useSearch();

  const countries = useMemo(() => getUniqueCountries(channels), [channels]);

  const groupedChannels = useMemo(() => {
    if (!channels.length) return {};
    return groupChannelsByCategory(channels);
  }, [channels]);

  const categories = useMemo(() => {
    const cats = Object.keys(groupedChannels);
    return cats.sort((a, b) => (groupedChannels[b]?.length || 0) - (groupedChannels[a]?.length || 0));
  }, [groupedChannels]);

  const popularCategories = useMemo(() => categories.slice(0, 8), [categories]);

  const saveRecentFilter = useCallback((category: string) => {
    if (category === "all") return;
    setRecentFilters((prev) => {
      const updated = [category, ...prev.filter((f) => f !== category)].slice(0, 5);
      localStorage.setItem("recent-filters", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const filteredChannels = useMemo(() => {
    let filtered = channels;

    if (selectedCategory !== "all") {
      filtered = groupedChannels[selectedCategory] || [];
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((ch) => ch.country === selectedCountry);
    }

    if (localSearchQuery.trim()) {
      const query = localSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (ch) =>
          ch.name.toLowerCase().includes(query) ||
          ch.group?.toLowerCase().includes(query)
      );
    }

    return filtered.map((ch, index) => transformIPTVToContent(ch, index));
  }, [channels, selectedCategory, selectedCountry, groupedChannels, localSearchQuery]);

  const totalPages = Math.ceil(filteredChannels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedChannels = filteredChannels.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedCountry, localSearchQuery, selectedProviderId]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage]);

  const handlePlay = (item: SetflixContentItem) => {
    if (!item.url) return;
    addItem({ id: String(item.id), title: item.title, url: item.url, logo: item.image, group: item.genres?.[0] });
    setCurrentStreamUrl(item.url);
    setCurrentStreamTitle(item.title);
    setIsVideoPlayerOpen(true);
  };

  const handleMoreInfo = (item: SetflixContentItem) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query);
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    saveRecentFilter(category);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedCountry("all");
    setLocalSearchQuery("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedCountry !== "all") count++;
    if (localSearchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedCountry, localSearchQuery]);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                All Channels
              </h1>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 border border-red-600/50 rounded-lg text-red-400 hover:bg-red-600/30 transition text-sm"
                  >
                    <XCircle size={16} />
                    <span>Clear Filters</span>
                    <span className="bg-red-600/50 px-1.5 py-0.5 rounded text-xs font-medium">
                      {activeFiltersCount}
                    </span>
                  </motion.button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-900 transition relative"
                >
                  <SlidersHorizontal size={18} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <ProviderTabs
                selectedProviderId={selectedProviderId}
                onProviderSelect={setSelectedProviderId}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <SearchBar
                value={localSearchQuery}
                onChange={handleSearch}
                placeholder="Search channels..."
              />
              <div className="flex items-center gap-2">
                <ViewControls viewMode={viewMode} onViewModeChange={setViewMode} />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-900 transition relative"
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            categories={categories}
            popularCategories={popularCategories}
            groupedChannels={groupedChannels}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            channelsLength={channels.length}
            recentFilters={recentFilters}
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={setSelectedCountry}
          />

          {!isLoading && !error && filteredChannels.length > 0 && (
            <div className="mb-6 text-gray-400 text-sm">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredChannels.length)} of{" "}
              {filteredChannels.length} channel{filteredChannels.length !== 1 ? "s" : ""}
              {currentProvider && selectedProviderId && (
                <span> from {currentProvider.name}</span>
              )}
              {selectedCategory !== "all" && (
                <span> in {selectedCategory === "Undefined" ? "Browse" : selectedCategory}</span>
              )}
              {selectedCountry !== "all" && <span> from {selectedCountry}</span>}
              {localSearchQuery && <span> matching &ldquo;{localSearchQuery}&rdquo;</span>}
            </div>
          )}

          <div
            className={cn(
              "transition-all duration-300",
              showFilters && "md:ml-[320px]"
            )}
          >
            <ChannelsGrid
              channels={displayedChannels}
              viewMode={viewMode}
              onPlay={handlePlay}
              onMoreInfo={handleMoreInfo}
              isLoading={isLoading}
              error={error}
              searchQuery={localSearchQuery}
            />

            {!isLoading && !error && filteredChannels.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
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
