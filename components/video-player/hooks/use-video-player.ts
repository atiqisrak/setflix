import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface UseVideoPlayerProps {
  isOpen: boolean;
  streamUrl: string;
}

export function useVideoPlayer({ isOpen, streamUrl }: UseVideoPlayerProps) {
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

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setError(null);
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

  return {
    videoRef,
    isPlaying,
    isMuted,
    isFullscreen,
    isLoading,
    error,
    togglePlay,
    toggleMute,
    toggleFullscreen,
  };
}

