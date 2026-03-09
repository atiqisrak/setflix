"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { QualityLevel } from "../hooks/use-video-player-enhanced";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  qualities?: QualityLevel[];
  currentQuality?: number | null;
  currentTime?: number;
  duration?: number;
  playbackRate?: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onQualityChange?: (levelIndex: number) => void;
  onToggleFullscreen: () => void;
  onSeek?: (time: number) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onPlaybackRateChange?: (rate: number) => void;
}

export default function VideoControls({
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  qualities = [],
  currentQuality = null,
  currentTime = 0,
  duration = 0,
  playbackRate = 1,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onQualityChange,
  onToggleFullscreen,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onPlaybackRateChange,
}: VideoControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const isVod = Number.isFinite(duration) && duration > 0;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0)
      return <VolumeX size={20} className="text-white" />;
    if (volume < 0.5) return <Volume1 size={20} className="text-white" />;
    return <Volume2 size={20} className="text-white" />;
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-opacity"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowVolumeSlider(false);
        setShowSettings(false);
        setShowSpeed(false);
      }}
    >
      {/* Progress bar (VOD: seekable) */}
      {isVod && (
        <div className="mb-3 px-1">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => onSeek?.(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent"
            aria-label="Seek"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white" />
          )}
        </button>

        {/* Skip back 10s / Forward 10s (VOD) */}
        {isVod && onSkipBackward && onSkipForward && (
          <>
            <button
              onClick={onSkipBackward}
              className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
              aria-label="Skip back 10 seconds"
            >
              <RotateCcw size={18} className="text-white" />
            </button>
            <button
              onClick={onSkipForward}
              className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
              aria-label="Skip forward 10 seconds"
            >
              <RotateCw size={18} className="text-white" />
            </button>
          </>
        )}

        {/* Time (VOD) */}
        {isVod && (
          <span className="text-white/90 text-sm tabular-nums min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        )}

        {/* Volume Control */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={onToggleMute}
            onMouseEnter={() => setShowVolumeSlider(true)}
            className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {getVolumeIcon()}
          </button>

          <AnimatePresence>
            {showVolumeSlider && isHovering && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 100 }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    onVolumeChange(newVolume);
                  }}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        {/* Quality Settings Menu */}
        {qualities.length > 1 && onQualityChange && (
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
              aria-label="Quality Settings"
            >
              <Settings size={20} className="text-white" />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 bg-black/95 border border-white/20 rounded-lg p-2 min-w-[150px] shadow-xl"
                >
                  {/* Quality Selector */}
                  <div>
                    <div className="text-white text-xs font-medium mb-2 px-2">
                      Quality
                    </div>
                    <div className="space-y-1">
                      {qualities.map((quality, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onQualityChange(index);
                            setShowSettings(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-1.5 rounded text-sm transition",
                            currentQuality === index
                              ? "bg-accent text-accent-foreground"
                              : "text-gray-300 hover:bg-white/10"
                          )}
                        >
                          {quality.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Playback speed (VOD) */}
        {isVod && onPlaybackRateChange && (
          <div className="relative">
            <button
              onClick={() => setShowSpeed(!showSpeed)}
              className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition text-white text-sm font-medium"
              aria-label="Playback speed"
            >
              {playbackRate}x
            </button>
            <AnimatePresence>
              {showSpeed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 bg-black/95 border border-white/20 rounded-lg p-2 min-w-[100px] shadow-xl"
                >
                  <div className="text-white text-xs font-medium mb-2 px-2">
                    Speed
                  </div>
                  <div className="space-y-1">
                    {PLAYBACK_RATES.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          onPlaybackRateChange(rate);
                          setShowSpeed(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded text-sm transition",
                          playbackRate === rate
                            ? "bg-accent text-accent-foreground"
                            : "text-gray-300 hover:bg-white/10"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize size={20} className="text-white" />
          ) : (
            <Maximize size={20} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
