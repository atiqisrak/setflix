"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import { useMyList } from "@/hooks/use-my-list";
import type { MovieItem } from "@/lib/content/types";
import { Play, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState("");
  const [currentStreamTitle, setCurrentStreamTitle] = useState("");
  const { addToList, isInList } = useMyList();

  useEffect(() => {
    fetch("/api/catalog/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(Array.isArray(data) ? data : []);
      })
      .catch(() => setMovies([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handlePlay = (movie: MovieItem) => {
    if (movie.streamUrl) {
      setCurrentStreamUrl(movie.streamUrl);
      setCurrentStreamTitle(movie.title);
      setIsVideoPlayerOpen(true);
    }
  };

  const handleAddToList = (movie: MovieItem) => {
    addToList(movie);
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
          Movies
        </h1>
        <p className="text-foreground/60 mb-8">
          Browse and play movies from the catalog.
        </p>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-foreground/60">No movies in the catalog yet.</p>
            <p className="text-foreground/40 text-sm mt-2">
              Add entries to <code className="bg-card px-1 rounded">data/movies.json</code> to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-lg overflow-hidden bg-card/50 aspect-[2/3] cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  {movie.year && (
                    <p className="text-white/70 text-xs mb-2">{movie.year}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(movie);
                      }}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-2 rounded flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                      disabled={!movie.streamUrl}
                    >
                      <Play size={14} fill="currentColor" />
                      Play
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToList(movie);
                      }}
                      className="w-9 h-9 border-2 border-white/30 hover:border-accent rounded flex items-center justify-center transition bg-black/50 hover:bg-accent/20"
                      aria-label={isInList(movie.id) ? "In list" : "Add to my list"}
                      title={isInList(movie.id) ? "In list" : "Add to my list"}
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
        {selectedMovie && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-card rounded-lg border border-border overflow-hidden"
            >
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-2 right-2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
                aria-label="Close"
              >
                <X size={20} className="text-white" />
              </button>
              <div className="aspect-video bg-muted">
                <img
                  src={selectedMovie.image || "/placeholder.svg"}
                  alt={selectedMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {selectedMovie.title}
                </h2>
                {(selectedMovie.year || selectedMovie.genres?.length) && (
                  <p className="text-foreground/60 text-sm mb-3">
                    {[selectedMovie.year, selectedMovie.genres?.join(", ")].filter(Boolean).join(" · ")}
                  </p>
                )}
                {selectedMovie.description && (
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-4">
                    {selectedMovie.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlay(selectedMovie)}
                    disabled={!selectedMovie.streamUrl}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Play size={18} fill="currentColor" />
                    Play
                  </button>
                  <button
                    onClick={() => handleAddToList(selectedMovie)}
                    className="px-4 py-2 border border-border rounded font-medium flex items-center justify-center gap-2 hover:bg-foreground/5"
                  >
                    <Plus size={18} />
                    {isInList(selectedMovie.id) ? "In list" : "Add to my list"}
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
        }}
        streamUrl={currentStreamUrl}
        title={currentStreamTitle}
      />

      <Footer />
    </div>
  );
}
