"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import { useMyList } from "@/hooks/use-my-list";
import type { SeriesItem, EpisodeItem } from "@/lib/content/types";
import { Play, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShowsPage() {
  const [shows, setShows] = useState<SeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState<SeriesItem | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeItem | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState("");
  const { addToList, isInList } = useMyList();

  useEffect(() => {
    fetch("/api/catalog/shows")
      .then((res) => res.json())
      .then((data) => {
        setShows(Array.isArray(data) ? data : []);
      })
      .catch(() => setShows([]))
      .finally(() => setIsLoading(false));
  }, []);

  const getPlayUrl = (show: SeriesItem): string | undefined => {
    if (selectedEpisode) return selectedEpisode.streamUrl;
    if (show.episodes?.length) return show.episodes[0].streamUrl;
    return show.streamUrl;
  };

  const handlePlay = (show: SeriesItem, episode?: EpisodeItem) => {
    const url = episode?.streamUrl ?? show.episodes?.[0]?.streamUrl ?? show.streamUrl;
    if (url) {
      setSelectedEpisode(episode ?? null);
      setCurrentStreamUrl(url);
      setCurrentStreamTitle(episode?.title ? `${show.title} - ${episode.title}` : show.title);
      setIsVideoPlayerOpen(true);
    }
  };

  const handleAddToList = (show: SeriesItem) => {
    addToList(show);
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
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          TV Shows
        </h1>
        <p className="text-foreground/60 mb-8">
          Browse and play TV series from the catalog.
        </p>

        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-foreground/60">No TV shows in the catalog yet.</p>
            <p className="text-foreground/40 text-sm mt-2">
              Add entries to <code className="bg-card px-1 rounded">data/shows.json</code> to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {shows.map((show) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-lg overflow-hidden bg-card/50 aspect-[2/3] cursor-pointer"
                onClick={() => setSelectedShow(show)}
              >
                <img
                  src={show.image || "/placeholder.svg"}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {show.title}
                  </h3>
                  {show.year && (
                    <p className="text-white/70 text-xs mb-2">{show.year}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(show);
                      }}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-2 rounded flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                      disabled={!getPlayUrl(show)}
                    >
                      <Play size={14} fill="currentColor" />
                      Play
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToList(show);
                      }}
                      className="w-9 h-9 border-2 border-white/30 hover:border-accent rounded flex items-center justify-center transition bg-black/50 hover:bg-accent/20"
                      aria-label={isInList(show.id) ? "In list" : "Add to my list"}
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedShow && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-card rounded-lg border border-border overflow-hidden my-8"
            >
              <button
                onClick={() => {
                  setSelectedShow(null);
                  setSelectedEpisode(null);
                }}
                className="absolute top-2 right-2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
                aria-label="Close"
              >
                <X size={20} className="text-white" />
              </button>
              <div className="aspect-video bg-muted">
                <img
                  src={selectedShow.image || "/placeholder.svg"}
                  alt={selectedShow.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {selectedShow.title}
                </h2>
                {(selectedShow.year || selectedShow.genres?.length) && (
                  <p className="text-foreground/60 text-sm mb-3">
                    {[selectedShow.year, selectedShow.genres?.join(", ")].filter(Boolean).join(" · ")}
                  </p>
                )}
                {selectedShow.description && (
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-4">
                    {selectedShow.description}
                  </p>
                )}
                {selectedShow.episodes && selectedShow.episodes.length > 0 ? (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Episodes</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {selectedShow.episodes.map((ep, i) => (
                        <button
                          key={i}
                          onClick={() => handlePlay(selectedShow, ep)}
                          className="w-full text-left px-3 py-2 rounded bg-background/50 hover:bg-foreground/10 text-foreground text-sm flex items-center gap-2"
                        >
                          <Play size={14} className="shrink-0" />
                          <span>
                            S{ep.season} E{ep.episode}
                            {ep.title ? ` - ${ep.title}` : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlay(selectedShow)}
                    disabled={!getPlayUrl(selectedShow)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Play size={18} fill="currentColor" />
                    Play
                  </button>
                  <button
                    onClick={() => handleAddToList(selectedShow)}
                    className="px-4 py-2 border border-border rounded font-medium flex items-center justify-center gap-2 hover:bg-foreground/5"
                  >
                    <Plus size={18} />
                    {isInList(selectedShow.id) ? "In list" : "Add to my list"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VideoPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => {
          setIsVideoPlayerOpen(false);
          setCurrentStreamUrl("");
          setCurrentStreamTitle("");
          setSelectedEpisode(null);
        }}
        streamUrl={currentStreamUrl}
        title={currentStreamTitle}
      />

      <Footer />
    </div>
  );
}
