"use client";

import { useState, useMemo } from "react";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import FeaturedCategoriesShowcase from "@/components/featured-categories-showcase";
import QuickAccessSection from "@/components/quick-access-section";
import LiveSpotlight from "@/components/live-spotlight";
import StatsSection from "@/components/stats-section";
import CategoryGrid from "@/components/category-grid";
import Footer from "@/components/footer";
import ContentDetailModal from "@/components/content-detail-modal";
import VideoPlayer from "@/components/video-player";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { SetflixContentItem, groupChannelsByCategory, transformIPTVToContent } from "@/lib/iptv";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");

  const { channels, isLoading, error } = useIPTVChannels();
  
  const handleMoreInfo = (content: SetflixContentItem) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handlePlay = (item?: SetflixContentItem) => {
    if (item?.url) {
      setCurrentStreamUrl(item.url);
      setCurrentStreamTitle(item.title);
      setIsVideoPlayerOpen(true);
    }
  };

  // Get categorized channels
  const groupedChannels = useMemo(() => {
    if (!channels.length) return {};
    return groupChannelsByCategory(channels);
  }, [channels]);

  // Get all categories for homepage (sorted by channel count)
  const allCategories = useMemo(() => {
    const categories = Object.keys(groupedChannels);
    return categories.sort((a, b) => groupedChannels[b].length - groupedChannels[a].length);
  }, [groupedChannels]);

  // Get top categories for spotlight
  const topCategories = useMemo(() => {
    return allCategories.slice(0, 4);
  }, [allCategories]);

  // Get all channels for live spotlight
  const allChannels = useMemo(() => {
    return channels.slice(0, 100).map((channel, index) => transformIPTVToContent(channel, index));
  }, [channels]);

  // Convert grouped channels to content items
  const categorizedContent = useMemo(() => {
    const result: Record<string, SetflixContentItem[]> = {};
    Object.keys(groupedChannels).forEach((category) => {
      result[category] = groupedChannels[category]
        .slice(0, 30)
        .map((channel, index) => transformIPTVToContent(channel, index));
    });
    return result;
  }, [groupedChannels]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner onPlay={() => handlePlay()} onMoreInfo={() => handleMoreInfo(null as any)} />

      <main>
        {isLoading ? (
          <div className="px-4 md:px-8 py-12 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Loading Channels...
            </h2>
            <div className="text-foreground/60 py-8">Please wait while we load your channels...</div>
          </div>
        ) : error ? (
          <div className="px-4 md:px-8 py-12 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Error Loading Channels
            </h2>
            <div className="text-foreground/60 py-8">
              Failed to load channels. Please try again later.
            </div>
          </div>
        ) : (
          <>
            {/* Static: Featured Categories Showcase */}
            <div className="px-4 md:px-8">
              <FeaturedCategoriesShowcase />
            </div>

            {/* Static: Quick Access Section */}
            <div className="px-4 md:px-8">
              <QuickAccessSection />
            </div>

            {/* Dynamic: Live Spotlight */}
            <div className="px-4 md:px-8">
              <LiveSpotlight
                channels={allChannels}
                onPlay={handlePlay}
                onMoreInfo={handleMoreInfo}
              />
            </div>

            {/* Static: Stats Section */}
            <div className="px-4 md:px-8">
              <StatsSection />
            </div>

            {/* Mixed: Category Grid with Carousels */}
            <div className="px-4 md:px-8">
              <CategoryGrid
                categories={topCategories}
                categorizedContent={categorizedContent}
                onPlay={handlePlay}
              />
            </div>
          </>
        )}
      </main>

      <Footer />

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
