"use client";

import { useState, useMemo } from "react";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import ContentCarousel from "@/components/content-carousel";
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

  // Get top categories for homepage (sorted by channel count)
  const topCategories = useMemo(() => {
    const categories = Object.keys(groupedChannels);
    return categories
      .sort((a, b) => groupedChannels[b].length - groupedChannels[a].length)
      .slice(0, 5);
  }, [groupedChannels]);

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

      <main className="px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        {isLoading ? (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Loading Channels...
            </h2>
            <div className="text-foreground/60 py-8">Please wait while we load your channels...</div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Error Loading Channels
            </h2>
            <div className="text-foreground/60 py-8">
              Failed to load channels. Please try again later.
            </div>
          </div>
        ) : (
          <>
            {/* Show top categories */}
            {topCategories.map((category) => (
              <ContentCarousel
                key={category}
                title={category}
                items={categorizedContent[category] || []}
                onPlay={handlePlay}
              />
            ))}
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
