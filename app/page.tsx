"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Play, Clock, X } from "lucide-react";
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
import { useRecentlyWatched } from "@/hooks/use-recently-watched";
import {
  SetflixContentItem,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";

export default function Home() {
  const { settings } = useHomepageSettings();
  const { items: recentItems, removeItem, addItem } = useRecentlyWatched();
  const [selectedContent, setSelectedContent] = useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState("");

  const { channels, isLoading, error } = useIPTVChannels();

  const handleMoreInfo = (content: SetflixContentItem) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handlePlay = (item?: SetflixContentItem | { url?: string; title: string; [key: string]: any }) => {
    if (!item?.url) return;
    addItem({ id: String((item as any).id || item.url), title: item.title, url: item.url, logo: (item as any).image });
    setCurrentStreamUrl(item.url);
    setCurrentStreamTitle(item.title);
    setIsVideoPlayerOpen(true);
  };

  const groupedChannels = useMemo(() => {
    if (!channels.length) return {};
    return groupChannelsByCategory(channels);
  }, [channels]);

  const allCategories = useMemo(() => {
    const cats = Object.keys(groupedChannels);
    return cats.sort((a, b) => groupedChannels[b].length - groupedChannels[a].length);
  }, [groupedChannels]);

  const topCategories = useMemo(() => allCategories.slice(0, 4), [allCategories]);

  const allChannels = useMemo(
    () => channels.slice(0, 100).map((ch, i) => transformIPTVToContent(ch, i)),
    [channels]
  );

  const categorizedContent = useMemo(() => {
    const result: Record<string, SetflixContentItem[]> = {};
    Object.keys(groupedChannels).forEach((cat) => {
      result[cat] = groupedChannels[cat].slice(0, 30).map((ch, i) => transformIPTVToContent(ch, i));
    });
    return result;
  }, [groupedChannels]);

  const theme = settings?.theme || "entertainment";

  const themeClasses =
    theme === "sports"
      ? "bg-gradient-to-b from-green-900/20 via-green-800/10 to-background"
      : theme === "news"
      ? "bg-gradient-to-b from-blue-900/20 via-blue-800/10 to-background"
      : "bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-background";

  const renderThemeLayout = () => {
    if (isLoading) {
      return (
        <div className="px-4 md:px-8 py-12">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Loading Channels…</h2>
          <div className="text-foreground/60 py-8">Please wait while we load your channels…</div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="px-4 md:px-8 py-12">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Error Loading Channels</h2>
          <div className="text-foreground/60 py-8">Failed to load channels. Please try again later.</div>
        </div>
      );
    }
    const props = { channels: allChannels, categorizedContent, topCategories, onPlay: handlePlay, onMoreInfo: handleMoreInfo };
    if (theme === "sports") return <SportsLayout {...props} />;
    if (theme === "news") return <NewsLayout {...props} />;
    return <EntertainmentLayout {...props} />;
  };

  return (
    <div className={`min-h-screen bg-background ${themeClasses}`}>
      <Header />
      <HeroBanner onPlay={() => handlePlay()} onMoreInfo={() => handleMoreInfo(null as any)} />

      <main className="px-4 md:px-8">
        {/* Recently Watched */}
        {recentItems.length > 0 && (
          <section className="py-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-accent" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Continue Watching</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentItems.map((item) => (
                <div
                  key={item.url}
                  className="flex-shrink-0 w-40 group relative rounded-lg overflow-hidden bg-card border border-border cursor-pointer hover:border-accent/50 transition"
                >
                  <button
                    onClick={() => {
                      addItem(item);
                      setCurrentStreamUrl(item.url);
                      setCurrentStreamTitle(item.title);
                      setIsVideoPlayerOpen(true);
                    }}
                    className="w-full"
                  >
                    {item.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logo}
                        alt={item.title}
                        className="w-full h-24 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-24 bg-foreground/10 flex items-center justify-center">
                        <Play size={24} className="text-foreground/40" />
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                      {item.group && <p className="text-xs text-foreground/50 truncate">{item.group}</p>}
                    </div>
                  </button>
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(item.url); }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderThemeLayout()}
      </main>

      <Footer />

      {selectedContent && (
        <ContentDetailModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedContent(null); }}
          onPlay={handlePlay}
          item={selectedContent}
        />
      )}

      <VideoPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => { setIsVideoPlayerOpen(false); setCurrentStreamUrl(""); setCurrentStreamTitle(""); }}
        streamUrl={currentStreamUrl}
        title={currentStreamTitle}
      />
    </div>
  );
}
