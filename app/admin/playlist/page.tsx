"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoPlayer from "@/components/video-player";
import { useAuth } from "@/contexts/auth-context";

interface PlaylistItem {
  title: string;
  url: string;
  tvgLogo?: string;
  group?: string;
}

function parseM3U(text: string): PlaylistItem[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const items: PlaylistItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.startsWith("#EXTINF")) {
      // Extract title after last comma
      const commaIdx = line.indexOf(",");
      const title = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : line;

      // tvg-logo attr
      const logoMatch = line.match(/tvg-logo=\"([^\"]+)\"/i);
      const groupMatch = line.match(/group-title=\"([^\"]+)\"/i);

      // find next non-empty, non-comment line as URL
      let url = "";
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        if (!next) continue;
        if (next.startsWith("#")) continue;
        url = next;
        break;
      }

      if (url) {
        items.push({ title, url, tvgLogo: logoMatch?.[1], group: groupMatch?.[1] });
      }
    }
  }

  return items;
}

export default function AdminPlaylistPage() {
  const { isAdmin } = useAuth();
  const [m3uUrl, setM3uUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);

  if (!isAdmin) return null;

  const loadPlaylist = async () => {
    setError(null);
    setItems([]);
    if (!m3uUrl) return setError("Please provide an M3U URL");

    try {
      setLoading(true);
      const res = await fetch(m3uUrl);
      if (!res.ok) throw new Error(`Failed to fetch playlist: ${res.status}`);
      const text = await res.text();
      const parsed = parseM3U(text);
      setItems(parsed);
      if (parsed.length === 0) setError("No playlist items found in the file");
    } catch (err: any) {
      setError(err?.message || "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (item: PlaylistItem) => {
    setStreamUrl(item.url);
    setStreamTitle(item.title);
    setPlayerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="">
        <h2 className="text-2xl font-bold text-foreground">Admin: Load M3U Playlist</h2>
        <p className="text-foreground/60 mt-1">Paste a public M3U URL to preview and play channels.</p>
      </div>


      {error && <div className="text-destructive">{error}</div>}

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Playlist ({items.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <div key={`${it.url}-${idx}`} 
            className="flex items-center gap-3 px-3 py-6 bg-card rounded 
            border border-border cursor-pointer hover:bg-accent/50 transition"
            onClick={() => handlePlay(it)}>
              {it.tvgLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.tvgLogo} alt={it.title} className="w-12 h-8 object-contain rounded" />
              ) : (
                <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center text-xs text-foreground/60">No logo</div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-2xl truncate">{it.title}</div>
                {it.group && <div className="text-xs text-foreground/60">{it.group}</div>}
                {/* <div className="text-xs text-foreground/50 truncate">{it.url}</div> */}
              </div>

              {/* <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={() => handlePlay(it)}>
                  Play
                </Button>
                <Button variant="link" onClick={() => window.open(it.url, "_blank")}>Open</Button>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      <VideoPlayer isOpen={playerOpen} onClose={() => setPlayerOpen(false)} streamUrl={streamUrl} title={streamTitle} />

      {/* Floating M3U loader (bottom center) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-4 py-2 bg-card/95 backdrop-blur-md border border-border rounded-full shadow-lg ring-2 ring-amber-400/25">
          <Input
            placeholder="Paste M3U URL here (https://...)"
            value={m3uUrl}
            onChange={(e: any) => setM3uUrl(e.target.value)}
            className="min-w-[220px] md:min-w-[520px] bg-transparent border-none focus:ring-0"
          />
          <Button onClick={loadPlaylist} disabled={loading}>
            {loading ? "Loading…" : "Load"}
          </Button>
          <Button variant="ghost" onClick={() => { setM3uUrl(""); setItems([]); setError(null); }}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
