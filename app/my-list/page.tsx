"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Heart, Trash2, Play, Info } from "lucide-react";
import { useMyList } from "@/hooks/use-my-list";
import { useAuth } from "@/contexts/auth-context";
import ContentDetailModal from "@/components/content-detail-modal";
import VideoPlayer from "@/components/video-player";
import { SetflixContentItem } from "@/lib/iptv";
import { motion, AnimatePresence } from "framer-motion";

export default function MyListPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { listItems, isLoading, removeFromList } = useMyList();
  const [selectedContent, setSelectedContent] =
    useState<SetflixContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState<string>("");
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?callback=${encodeURIComponent("/my-list")}`);
    }
  }, [isAuthenticated, authLoading, router]);

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

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 px-4 md:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-foreground/60">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleMoreInfo = (item: SetflixContentItem) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const handleRemove = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromList(itemId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 px-4 md:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-foreground/60">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            My List
          </h1>
          <p className="text-foreground/60 text-lg">
            Your favorite shows and movies ({listItems.length})
          </p>
        </div>

        {listItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} className="text-foreground/30 mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No items yet
            </h2>
            <p className="text-foreground/60">
              Start adding your favorite shows and movies to your list
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {listItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-lg overflow-hidden bg-card/50 aspect-video md:aspect-[2/3] cursor-pointer"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  onClick={() => handleMoreInfo(item)}
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(item);
                        }}
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-2 rounded flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                        disabled={!item.url}
                      >
                        <Play size={14} fill="currentColor" />
                        Play
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(item);
                        }}
                        className="w-9 h-9 border-2 border-white/30 hover:border-white rounded flex items-center justify-center transition bg-black/50"
                        aria-label="More info"
                      >
                        <Info size={16} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => handleRemove(item.id, e)}
                        className="w-9 h-9 border-2 border-white/30 hover:border-red-500 rounded flex items-center justify-center transition bg-black/50 hover:bg-red-500/20"
                        aria-label="Remove from list"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  {hoveredItemId === item.id && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => handleRemove(item.id, e)}
                        className="w-8 h-8 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center transition"
                        aria-label="Remove from list"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

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

      <Footer />
    </div>
  );
}
