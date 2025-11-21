"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants } from "@/lib/animations";
import { useVideoPlayer } from "./hooks/use-video-player";
import VideoControls from "./components/video-controls";
import VideoError from "./components/video-error";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string;
  title?: string;
}

export default function VideoPlayer({
  isOpen,
  onClose,
  streamUrl,
  title,
}: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    isMuted,
    isFullscreen,
    isLoading,
    error,
    togglePlay,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer({ isOpen, streamUrl });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200]">
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-full flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>

            {title && (
              <div className="absolute top-4 left-4 z-30 bg-black/70 px-4 py-2 rounded">
                <h3 className="text-white font-semibold">{title}</h3>
              </div>
            )}

            <video
              ref={videoRef}
              className="w-full h-full"
              playsInline
              muted={isMuted}
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white">Loading stream...</div>
              </div>
            )}

            {error && <VideoError error={error} onClose={onClose} />}

            {!error && (
              <VideoControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                isFullscreen={isFullscreen}
                onTogglePlay={togglePlay}
                onToggleMute={toggleMute}
                onToggleFullscreen={toggleFullscreen}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

