"use client";

import { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoPlayer from "@/components/video-player";
import { Play, RotateCcw, ListVideo, Search } from "lucide-react";

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
    if (!line || !line.startsWith("#EXTINF")) continue;

    const commaIdx = line.indexOf(",");
    const title = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : line;
    const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
    const groupMatch = line.match(/group-title="([^"]+)"/i);

    let url = "";
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j];
      if (!next || next.startsWith("#")) continue;
      url = next;
      break;
    }

    if (url) {
      items.push({ title, url, tvgLogo: logoMatch?.[1], group: groupMatch?.[1] });
    }
  }

  return items;
}

export default function PlaylistPage() {
  const [m3uUrl, setM3uUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PlaylistItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [playerOpen, setPlayerOpen] = useState(false);

  const loadPlaylist = async () => {
    setError(null);
    setItems([]);
    setSearch("");
    setActiveGroup("All");
    const trimmed = m3uUrl.trim();
    if (!trimmed) return setError("Paste an M3U URL first.");

    try {
      setLoading(true);
      const res = await fetch(`/api/playlist?url=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const text = await res.text();
      const parsed = parseM3U(text);
      if (parsed.length === 0) setError("No channels found in this playlist.");
      setItems(parsed);
    } catch (err: any) {
      setError(err?.message || "Failed to load playlist.");
    } finally {
      setLoading(false);
    }
  };

  const groups = useMemo(() => {
    const g = new Set(items.map((i) => i.group || "Ungrouped"));
    return ["All", ...Array.from(g).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchGroup = activeGroup === "All" || (item.group || "Ungrouped") === activeGroup;
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
      return matchGroup && matchSearch;
    });
  }, [items, activeGroup, search]);

  const handlePlay = (item: PlaylistItem) => {
    setStreamUrl(item.url);
    setStreamTitle(item.title);
    setPlayerOpen(true);
  };

  const reset = () => {
    setM3uUrl("");
    setItems([]);
    setError(null);
    setSearch("");
    setActiveGroup("All");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ListVideo size={32} className="text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                My Playlist
              </h1>
            </div>
            <p className="text-foreground/60">
              Load any public M3U playlist URL to browse and play its channels.
            </p>
          </div>

          {/* M3U Loader */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <label className="block text-sm font-semibold text-foreground/80 uppercase tracking-wide">
              M3U Playlist URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://example.com/playlist.m3u"
                value={m3uUrl}
                onChange={(e) => { setM3uUrl(e.target.value); setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") loadPlaylist(); }}
                className="flex-1 text-base"
              />
              <Button
                onClick={loadPlaylist}
                disabled={loading || !m3uUrl.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 px-6"
              >
                <Play size={16} />
                {loading ? "Loading…" : "Load"}
              </Button>
              <Button variant="outline" onClick={reset} className="flex items-center gap-2">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          {/* Results */}
          {items.length > 0 && (
            <div className="space-y-6">
              {/* Stats + Search */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-foreground/70 text-sm">
                  <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{items.length}</span> channels
                </p>
                <div className="relative w-full sm:w-72">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search channels…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Group tabs */}
              {groups.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {groups.map((g) => (
                    <button
                      key={g}
                      onClick={() => setActiveGroup(g)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        activeGroup === g
                          ? "bg-accent text-accent-foreground"
                          : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {/* Channel grid */}
              {filtered.length === 0 ? (
                <p className="text-foreground/60 py-8 text-center">No channels match your search.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filtered.map((item, idx) => (
                    <button
                      key={`${item.url}-${idx}`}
                      onClick={() => handlePlay(item)}
                      className="flex items-center gap-3 px-4 py-4 bg-card rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition text-left group"
                    >
                      {item.tvgLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.tvgLogo}
                          alt={item.title}
                          className="w-12 h-8 object-contain rounded flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-8 bg-foreground/10 rounded flex items-center justify-center flex-shrink-0">
                          <Play size={14} className="text-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-accent transition text-sm">
                          {item.title}
                        </p>
                        {item.group && (
                          <p className="text-xs text-foreground/50 truncate">{item.group}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
