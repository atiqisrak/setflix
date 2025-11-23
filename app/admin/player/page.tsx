"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoPlayer from "@/components/video-player";
import { useAuth } from "@/contexts/auth-context";

export default function AdminPlayerPage() {
  const { isAdmin } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  if (!isAdmin) return null;

  const isValidVideoUrl = (u: string) => {
    try {
      if (!u) return false;
      const parsed = new URL(u);
      // accept common streaming/video file extensions (including HLS .m3u8)
      return /\.(mp4|m3u8|webm|mov|mpd|ogg|mp3)(\?|$)/i.test(parsed.pathname + (parsed.search || ""));
    } catch (e) {
      return false;
    }
  };

  const loadAndPlay = async () => {
    setError(null);
    if (!url) return setError("Please paste a video URL");
    if (!isValidVideoUrl(url)) return setError("URL does not look like a supported video (mp4, m3u8, webm, mov)");

    try {
      setLoading(true);
      // Quick HEAD check to see if resource exists (but keep optional: many hosts block HEAD)
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!res.ok) {
          // fall through, but warn user
          console.debug("HEAD request returned", res.status);
        }
      } catch (e) {
        console.debug("HEAD request failed", e);
      }

      // use local proxy by default to avoid CORS issues in the browser
      const proxied = useProxy ? `/api/proxy?url=${encodeURIComponent(url)}` : url;
      setStreamUrl(proxied);
      // derive a simple title from filename
      try {
        const p = new URL(url).pathname;
        const name = p.split("/").pop() || url;
        setStreamTitle(decodeURIComponent(name));
      } catch (e) {
        setStreamTitle(url);
      }
      setPlayerOpen(true);
    } catch (err: any) {
      setError(err?.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin: Player</h2>
        <p className="text-foreground/60 mt-1">Paste a direct video or HLS link and click Load to play it.</p>
      </div>

      {error && <div className="text-destructive">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <Input
          placeholder="https://example.com/video.mp4 or https://example.com/stream.m3u8"
          value={url}
          onChange={(e: any) => setUrl(e.target.value)}
          className="w-full"
          onKeyDown={(e: any) => {
            if (e.key === "Enter") loadAndPlay();
          }}
        />

        <Button onClick={loadAndPlay} disabled={loading}>
          {loading ? "Loading…" : "Load & Play"}
        </Button>

        <Button variant="ghost" onClick={() => { setUrl(""); setError(null); setStreamUrl(""); setPlayerOpen(false); }}>
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useProxy} onChange={(e) => setUseProxy(e.target.checked)} />
          <span className="text-foreground/70">Use local proxy (fix CORS)</span>
        </label>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground">Now playing</h3>
        <div className="text-sm text-foreground/60 truncate">{streamTitle || "—"}</div>
        <div className="text-xs text-foreground/50 truncate">{streamUrl || ""}</div>
      </div>

      <VideoPlayer isOpen={playerOpen} onClose={() => setPlayerOpen(false)} streamUrl={streamUrl} title={streamTitle} />
    </div>
  );
}
