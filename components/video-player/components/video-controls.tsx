import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}

export default function VideoControls({
  isPlaying,
  isMuted,
  isFullscreen,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white" />
          )}
        </button>

        <button
          onClick={onToggleMute}
          className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={24} className="text-white" />
          ) : (
            <Volume2 size={24} className="text-white" />
          )}
        </button>

        <button
          onClick={onToggleFullscreen}
          className="w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition ml-auto"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize size={24} className="text-white" />
          ) : (
            <Maximize size={24} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

