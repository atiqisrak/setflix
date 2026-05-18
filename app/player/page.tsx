"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoPlayer from "@/components/video-player";
import { Play, RotateCcw, ExternalLink, Tv } from "lucide-react";

const EXAMPLES = [
  { label: "Big Buck Bunny (MP4)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { label: "Elephant Dream (HLS)", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" },
];

function isValidVideoUrl(u: string): boolean {
  try {
    if (!u) return false;
    const parsed = new URL(u);
    return /\.(mp4|m3u8|webm|mov|mpd|ogg|mp3)(\?|$)/i.test(
      parsed.pathname + (parsed.search || "")
    );
  } catch {
    return false;
  }
}

export default function PlayerPage() {
  const [url, setUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAndPlay = async () => {
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) return setError("Paste a video URL first.");
    if (!isValidVideoUrl(trimmed))
      return setError("URL must end with .mp4, .m3u8, .webm, .mov, or .mpd");

    setLoading(true);
    try {
      const proxied = useProxy
        ? `/api/proxy?url=${encodeURIComponent(trimmed)}`
        : trimmed;
      setStreamUrl(proxied);
      try {
        const p = new URL(trimmed).pathname;
        setStreamTitle(decodeURIComponent(p.split("/").pop() || trimmed));
      } catch {
        setStreamTitle(trimmed);
      }
      setPlayerOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUrl("");
    setError(null);
    setStreamUrl("");
    setPlayerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Tv size={32} className="text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Stream Player
              </h1>
            </div>
            <p className="text-foreground/60 mt-1">
              Paste any direct video or HLS stream URL and play it instantly — no account needed.
            </p>
          </div>

          {/* URL Input */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wide">
              Stream URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://example.com/stream.m3u8"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") loadAndPlay(); }}
                className="flex-1 text-base"
              />
              <Button
                onClick={loadAndPlay}
                disabled={loading || !url.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 px-6"
              >
                <Play size={16} />
                {loading ? "Loading…" : "Play"}
              </Button>
              <Button variant="outline" onClick={reset} className="flex items-center gap-2">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useProxy}
                onChange={(e) => setUseProxy(e.target.checked)}
                className="accent-accent"
              />
              <span className="text-foreground/70">
                Use built-in CORS proxy (recommended for most streams)
              </span>
            </label>
          </div>

          {/* Currently loaded */}
          {streamUrl && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                Now Playing
              </p>
              <p className="font-medium text-foreground truncate">{streamTitle}</p>
              <button
                onClick={() => setPlayerOpen(true)}
                className="flex items-center gap-2 text-accent hover:text-accent/80 text-sm transition"
              >
                <Play size={14} /> Open player
              </button>
            </div>
          )}

          {/* Example streams */}
          <div>
            <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide mb-3">
              Try an example
            </p>
            <div className="flex flex-wrap gap-3">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.url}
                  onClick={() => { setUrl(ex.url); setError(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-full text-sm text-foreground transition"
                >
                  <ExternalLink size={13} />
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supported formats */}
          <div className="text-xs text-foreground/40 space-y-1">
            <p className="font-semibold uppercase tracking-wide">Supported formats</p>
            <p>HLS (.m3u8) · MP4 · WebM · MOV · MPEG-DASH (.mpd) · MP3</p>
          </div>
        </div>
      </main>

      <Footer />

      <VideoPlayer
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        streamUrl={streamUrl}
        title={streamTitle}
      />
    </div>
  );
}
