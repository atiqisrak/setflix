import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";

interface UseVideoPlayerEnhancedProps {
  isOpen: boolean;
  streamUrl: string;
}

export interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

export function useVideoPlayerEnhanced({ isOpen, streamUrl }: UseVideoPlayerEnhancedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number | null>(null);


  // Initialize video player
  useEffect(() => {
    if (!isOpen || !videoRef.current || !streamUrl) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    setIsLoading(true);
    setError(null);

    const isHLS = streamUrl.includes(".m3u8") || streamUrl.includes("m3u8");
    const isM3U = streamUrl.includes(".m3u") || streamUrl.includes("m3u");
    const isDirectVideo = streamUrl.match(/\.(mp4|webm|ogg|mov)(\?|$)/i);

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
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          setIsLoading(false);
          setError(null);
          
          // Extract quality levels from HLS manifest
          if (data.levels && data.levels.length > 0) {
            const qualityList: QualityLevel[] = data.levels.map((level: any, index: number) => ({
              height: level.height || 0,
              width: level.width || 0,
              bitrate: level.bitrate || 0,
              label: level.height ? `${level.height}p` : `Auto`,
            }));
            
            // Add Auto option
            qualityList.unshift({ height: 0, width: 0, bitrate: 0, label: "Auto" });
            setQualities(qualityList);
            setCurrentQuality(0); // Default to Auto
          }
          
          video.play().catch((err) => {
            console.error("Error playing video:", err);
            setError("Failed to play video. Please try another stream.");
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (!data) return;

          if (data.fatal) {
            const errorType = data.type;

            switch (errorType) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Network error. Attempting to reconnect...");
                try {
                  if (hls) hls.startLoad();
                } catch (e) {
                  setError("Connection failed. Please try another stream.");
                  if (hls) hls.destroy();
                  setIsLoading(false);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Stream error. Attempting to recover...");
                try {
                  if (hls) hls.recoverMediaError();
                } catch (e) {
                  setError("Stream error. Please try another channel.");
                  if (hls) hls.destroy();
                  setIsLoading(false);
                }
                break;
              case Hls.ErrorTypes.MUX_ERROR:
                setError("Stream format error. Please try another channel.");
                if (hls) hls.destroy();
                setIsLoading(false);
                break;
              default:
                setError("Stream error. Please try another channel.");
                if (hls) hls.destroy();
                setIsLoading(false);
                break;
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
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

    // Set initial volume and playback rate (will be set after component mounts)

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
        case 1:
          errorMessage = "Video loading aborted";
          break;
        case 2:
          errorMessage = "Network error. Please check your connection.";
          break;
        case 3:
          errorMessage = "Video decoding error. Please try another stream.";
          break;
        case 4:
          errorMessage = "Video format not supported. Please try another stream.";
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
    const handleVolumeChange = () => {
      // Update state from video element - this won't cause reload since 
      // volume is no longer in the main effect dependencies
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    video.addEventListener("volumechange", handleVolumeChange);

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
      video.removeEventListener("volumechange", handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      video.pause();
      video.src = "";
      video.load();

      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
    };
  }, [isOpen, streamUrl]);

  // Update volume without reinitializing the player
  // This effect only runs when volume changes externally (like from controls)
  // and updates the video element without reloading the stream
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    
    const video = videoRef.current;
    // Only update if significantly different to avoid floating point issues
    if (Math.abs(video.volume - volume) > 0.001) {
      video.volume = volume;
    }
    if (video.muted && volume > 0) {
      video.muted = false;
    }
  }, [isOpen, volume]);

  // Define handlers first
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const setVolumeValue = useCallback((newVolume: number) => {
    if (!videoRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    // Update video element directly - volumechange event will sync state
    // This avoids triggering any effects that depend on volume
    videoRef.current.volume = clampedVolume;
    videoRef.current.muted = false;
  }, []);



  const toggleFullscreen = useCallback(() => {
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
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ": // Space - play/pause
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowUp": // Up arrow - volume up
          e.preventDefault();
          setVolumeValue(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown": // Down arrow - volume down
          e.preventDefault();
          setVolumeValue(Math.max(0, volume - 0.1));
          break;
        case "m":
        case "M": // M - mute/unmute
          e.preventDefault();
          toggleMute();
          break;
        case "f":
        case "F": // F - fullscreen
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, volume, togglePlay, toggleMute, toggleFullscreen, setVolumeValue]);

  const setQuality = useCallback((levelIndex: number) => {
    if (!hlsRef.current) return;
    
    if (levelIndex === 0 || levelIndex === -1) {
      // Auto quality
      hlsRef.current.currentLevel = -1;
    } else {
      hlsRef.current.currentLevel = levelIndex - 1; // Subtract 1 because Auto is index 0
    }
    
    setCurrentQuality(levelIndex);
  }, []);


  return {
    videoRef,
    hlsRef,
    isPlaying,
    isMuted,
    volume,
    isFullscreen,
    isLoading,
    error,
    qualities,
    currentQuality,
    togglePlay,
    toggleMute,
    setVolume: setVolumeValue,
    setQuality,
    toggleFullscreen,
  };
}

