"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import Footer from "@/components/footer";
import ContentDetailModal from "@/components/content-detail-modal";
import VideoPlayer from "@/components/video-player";
import SportsLayout from "@/components/homepage-layouts/sports-layout";
import NewsLayout from "@/components/homepage-layouts/news-layout";
import EntertainmentLayout from "@/components/homepage-layouts/entertainment-layout";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useHomepageSettings } from "@/hooks/use-homepage-settings";
import { useAuth } from "@/contexts/auth-context";
import {
  SetflixContentItem,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { settings } = useHomepageSettings();
  const [selectedContent, setSelectedContent] =
    useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");

  const { channels, isLoading, error } = useIPTVChannels();

  const handleMoreInfo = (content: SetflixContentItem) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handlePlay = (
    item?:
      | SetflixContentItem
      | { url?: string; title: string; [key: string]: any }
  ) => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?callback=${encodeURIComponent(currentPath)}`);
      return;
    }
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
    return categories.sort(
      (a, b) => groupedChannels[b].length - groupedChannels[a].length
    );
  }, [groupedChannels]);

  // Get top categories for spotlight
  const topCategories = useMemo(() => {
    return allCategories.slice(0, 4);
  }, [allCategories]);

  // Get all channels for live spotlight
  const allChannels = useMemo(() => {
    return channels
      .slice(0, 100)
      .map((channel, index) => transformIPTVToContent(channel, index));
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

  // Get theme-based styling and layout
  const theme = settings?.theme || "entertainment";
  const themeClasses = theme === "sports"
    ? "bg-gradient-to-b from-green-900/20 via-green-800/10 to-background"
    : theme === "news"
    ? "bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-background"
    : theme === "entertainment"
    ? "bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-background"
    : "";

  // Render theme-specific layout
  const renderThemeLayout = () => {
    if (isLoading) {
      return (
        <div className="px-4 md:px-8 py-12 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Loading Channels...
          </h2>
          <div className="text-foreground/60 py-8">
            Please wait while we load your channels...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-4 md:px-8 py-12 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Error Loading Channels
          </h2>
          <div className="text-foreground/60 py-8">
            Failed to load channels. Please try again later.
          </div>
        </div>
      );
    }

    const layoutProps = {
      channels: allChannels,
      categorizedContent,
      topCategories,
      onPlay: handlePlay,
      onMoreInfo: handleMoreInfo,
    };

    switch (theme) {
      case "sports":
        return <SportsLayout {...layoutProps} />;
      case "news":
        return <NewsLayout {...layoutProps} />;
      case "entertainment":
      default:
        return <EntertainmentLayout {...layoutProps} />;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${themeClasses}`}>
      <Header />
      <HeroBanner
        onPlay={() => handlePlay()}
        onMoreInfo={() => handleMoreInfo(null as any)}
      />

      <main className="px-4 md:px-8">
        {renderThemeLayout()}
      </main>

      <Footer />

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
