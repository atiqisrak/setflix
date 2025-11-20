"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants } from "@/lib/animations";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current || !streamUrl) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    // Reset states
    setIsLoading(true);
    setError(null);

    // Determine stream type
    const isHLS = streamUrl.includes(".m3u8") || streamUrl.includes("m3u8");
    const isM3U = streamUrl.includes(".m3u") || streamUrl.includes("m3u");
    const isDirectVideo = streamUrl.match(/\.(mp4|webm|ogg|mov)(\?|$)/i);

    // Handle HLS/M3U8 streams
    if (isHLS || isM3U) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          debug: false,
          xhrSetup: (xhr, url) => {
            // Handle CORS
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setError(null);
          video.play().catch((err) => {
            console.error("Error playing video:", err);
            setError("Failed to play video. Please try another stream.");
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          // Only handle fatal errors - non-fatal errors are common and handled automatically
          if (!data) {
            // Empty error object - ignore (sometimes hls.js sends empty error objects)
            return;
          }

          if (data.fatal) {
            const errorType = data.type;
            const errorDetails = data.details || "";

            switch (errorType) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("HLS Network error, attempting recovery...");
                setError("Network error. Attempting to reconnect...");
                try {
                  if (hls) {
                    hls.startLoad();
                  }
                } catch (e) {
                  console.error("Failed to recover from network error:", e);
                  setError("Connection failed. Please try another stream.");
                  if (hls) {
                    hls.destroy();
                  }
                  setIsLoading(false);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("HLS Media error, attempting recovery...");
                setError("Stream error. Attempting to recover...");
                try {
                  if (hls) {
                    hls.recoverMediaError();
                  }
                } catch (e) {
                  console.error("Failed to recover from media error:", e);
                  setError("Stream error. Please try another channel.");
                  if (hls) {
                    hls.destroy();
                  }
                  setIsLoading(false);
                }
                break;
              case Hls.ErrorTypes.MUX_ERROR:
                console.log("HLS Mux error");
                setError("Stream format error. Please try another channel.");
                if (hls) {
                  hls.destroy();
                }
                setIsLoading(false);
                break;
              case Hls.ErrorTypes.OTHER_ERROR:
                console.log("HLS Other error:", errorDetails);
                setError("Stream error. Please try another channel.");
                if (hls) {
                  hls.destroy();
                }
                setIsLoading(false);
                break;
              default:
                console.log(
                  "HLS Unknown fatal error:",
                  errorType,
                  errorDetails
                );
                setError("Stream error. Please try another channel.");
                if (hls) {
                  hls.destroy();
                }
                setIsLoading(false);
                break;
            }
          } else if (data) {
            // Log non-fatal errors for debugging (but don't show to user)
            // These are common and usually handled automatically by hls.js
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR && !data.fatal) {
              // Non-fatal network errors are usually retried automatically
              console.debug("HLS non-fatal network error (auto-recovering)");
            } else if (
              data.type === Hls.ErrorTypes.MEDIA_ERROR &&
              !data.fatal
            ) {
              // Non-fatal media errors are usually retried automatically
              console.debug("HLS non-fatal media error (auto-recovering)");
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.crossOrigin = "anonymous";
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          setError(null);
          video.play().catch((err) => {
            console.error("Error playing video:", err);
            setError("Failed to play video. Please try another stream.");
          });
        });
      } else {
        setError("HLS is not supported in this browser");
        setIsLoading(false);
      }
    } else if (isDirectVideo) {
      // Handle direct video files (MP4, WebM, etc.)
      video.crossOrigin = "anonymous";
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        setError(null);
        video.play().catch((err) => {
          console.error("Error playing video:", err);
          setError("Failed to play video. Please try another stream.");
        });
      });
    } else {
      // Try as direct stream
      video.crossOrigin = "anonymous";
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        setError(null);
        video.play().catch((err) => {
          console.error("Error playing video:", err);
          setError("Failed to play video. Please try another stream.");
        });
      });
    }

    // Handle play/pause
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedData = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      const videoError = (video.error && video.error.code) || 0;
      let errorMessage = "Failed to load video stream";

      switch (videoError) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage = "Video loading aborted";
          break;
        case 2: // MEDIA_ERR_NETWORK
          errorMessage = "Network error. Please check your connection.";
          break;
        case 3: // MEDIA_ERR_DECODE
          errorMessage = "Video decoding error. Please try another stream.";
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage =
            "Video format not supported. Please try another stream.";
          break;
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Handle fullscreen
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      // Clean up video source
      video.pause();
      video.src = "";
      video.load();

      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [isOpen, streamUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error("Error entering fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200]">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm"
        />

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full h-full flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Title */}
            {title && (
              <div className="absolute top-4 left-4 z-30 bg-black/70 px-4 py-2 rounded">
                <h3 className="text-white font-semibold">{title}</h3>
              </div>
            )}

            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full"
              playsInline
              muted={isMuted}
            />

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white">Loading stream...</div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center text-white px-4">
                  <p className="text-lg font-semibold mb-2">{error}</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Controls */}
            {!error && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} className="text-white" />
                    )}
                  </button>

                  {/* Mute/Unmute */}
                  <button
                    onClick={toggleMute}
                    className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX size={24} className="text-white" />
                    ) : (
                      <Volume2 size={24} className="text-white" />
                    )}
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition ml-auto"
                    aria-label={
                      isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                    }
                  >
                    {isFullscreen ? (
                      <Minimize size={24} className="text-white" />
                    ) : (
                      <Maximize size={24} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
