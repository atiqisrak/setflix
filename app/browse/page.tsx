"use client";

import { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContentCarousel from "@/components/content-carousel";
import VideoPlayer from "@/components/video-player";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import {
  SetflixContentItem,
  filterChannels,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";

export default function BrowsePage() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");

  const { contentItems, channels, isLoading, error } = useIPTVChannels();

  const genres = [
    "All",
    "News",
    "Sports",
    "Entertainment",
    "Movies",
    "Music",
    "Documentary",
  ];

  // Filter channels by selected genre
  const filteredChannels = useMemo(() => {
    if (selectedGenre === "all") {
      return contentItems;
    }
    const filtered = filterChannels(channels, selectedGenre);
    return filtered.map((channel, index) =>
      transformIPTVToContent(channel, index)
    );
  }, [selectedGenre, contentItems, channels]);

  // Group channels by category
  const groupedChannels = useMemo(() => {
    if (selectedGenre === "all") {
      const grouped = groupChannelsByCategory(channels);
      const result: Record<string, SetflixContentItem[]> = {};
      Object.keys(grouped).forEach((category) => {
        result[category] = grouped[category]
          .slice(0, 20)
          .map((channel, index) => transformIPTVToContent(channel, index));
      });
      return result;
    }
    return {};
  }, [selectedGenre, channels]);

  const handlePlay = (item: SetflixContentItem) => {
    if (item.url) {
      setCurrentStreamUrl(item.url);
      setCurrentStreamTitle(item.title);
      setIsVideoPlayerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Browse All
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre.toLowerCase())}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition ${
                  selectedGenre === genre.toLowerCase()
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {isLoading ? (
            <div className="text-foreground/60 py-8">Loading channels...</div>
          ) : error ? (
            <div className="text-foreground/60 py-8">
              Failed to load channels. Please try again later.
            </div>
          ) : selectedGenre === "all" ? (
            <>
              {Object.keys(groupedChannels)
                .slice(0, 5)
                .map((category) => (
                  <ContentCarousel
                    key={category}
                    title={category}
                    items={groupedChannels[category]}
                    onPlay={handlePlay}
                  />
                ))}
              <ContentCarousel
                title="All Channels"
                items={contentItems.slice(0, 50)}
                onPlay={handlePlay}
              />
            </>
          ) : (
            <ContentCarousel
              title={`${
                selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)
              } Channels`}
              items={filteredChannels.slice(0, 50)}
              onPlay={handlePlay}
            />
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
    </div>
  );
}
