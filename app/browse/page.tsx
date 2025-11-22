"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContentCarousel from "@/components/content-carousel";
import VideoPlayer from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useAuth } from "@/contexts/auth-context";
import {
  SetflixContentItem,
  filterChannels,
  groupChannelsByCategory,
  transformIPTVToContent,
} from "@/lib/iptv";

export default function BrowsePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?callback=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (item.url) {
      setCurrentStreamUrl(item.url);
      setCurrentStreamTitle(item.title);
      setIsVideoPlayerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8 relative">
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

        <div className="space-y-12 relative">
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

          {/* Gradient Overlay for Non-Authenticated Users */}
          {!isAuthenticated && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Gradient from transparent at top to black at bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
              
              {/* Get In Section */}
              <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 py-12 pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl mx-auto text-center"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Get In to Browse All Channels
                  </h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Sign in to explore thousands of channels across all genres and categories
                  </p>
                  <Link href={`/login?callback=${encodeURIComponent("/browse")}`}>
                    <Button
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold flex items-center gap-2 mx-auto"
                    >
                      <LogIn size={24} />
                      Sign In to Continue
                    </Button>
                  </Link>
                </motion.div>
              </div>
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
    </div>
  );
}
