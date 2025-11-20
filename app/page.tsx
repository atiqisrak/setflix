"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import ContentCarousel from "@/components/content-carousel";
import Footer from "@/components/footer";
import ContentDetailModal from "@/components/content-detail-modal";
import VideoPlayer from "@/components/video-player";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { SetflixContentItem } from "@/lib/iptv";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");

  const { contentItems, isLoading, error } = useIPTVChannels();

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

  // Limit IPTV channels for display (first 50 for performance)
  const displayedIPTVChannels = contentItems.slice(0, 50);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner onPlay={() => handlePlay()} onMoreInfo={() => handleMoreInfo(null as any)} />

      <main className="px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        <ContentCarousel title="Trending Now" category="trending" />
        
        {/* Live Channels - IPTV */}
        {isLoading ? (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Live Channels
            </h2>
            <div className="text-foreground/60 py-8">Loading channels...</div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Live Channels
            </h2>
            <div className="text-foreground/60 py-8">
              Failed to load channels. Please try again later.
            </div>
          </div>
        ) : (
          <ContentCarousel
            title="Live Channels"
            items={displayedIPTVChannels}
            onPlay={handlePlay}
          />
        )}

        <ContentCarousel title="More to Watch" category="trending" />
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
