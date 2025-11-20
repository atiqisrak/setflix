"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContentCard from "@/components/content-card";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const CONTENT_DATA = [
  {
    id: 1,
    title: "News Channel",
    image: "/live-news-broadcast-professional.jpg",
    rating: 95,
  },
  {
    id: 2,
    title: "Sports HD",
    image: "/sports-broadcast-stadium-live.jpg",
    rating: 88,
  },
  {
    id: 3,
    title: "Entertainment",
    image: "/entertainment-television-live-studio.jpg",
    rating: 92,
  },
  {
    id: 4,
    title: "Movies Plus",
    image: "/action-thriller-cinematic-dark.jpg",
    rating: 85,
  },
  {
    id: 5,
    title: "Documentary",
    image: "/science-fiction-professional-streaming.jpg",
    rating: 90,
  },
  {
    id: 6,
    title: "Music Channel",
    image: "/music-channel-live-broadcast.jpg",
    rating: 87,
  },
  {
    id: 7,
    title: "Comedy Central",
    image: "/drama-romantic-professional-television.jpg",
    rating: 83,
  },
  {
    id: 8,
    title: "Drama Channel",
    image: "/crime-thriller-dark-professional-series.jpg",
    rating: 89,
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const updated = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      setSearchQuery(query);
    }
  };

  const filteredContent = searchQuery
    ? CONTENT_DATA.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Search for titles, people, genres..."
                className="w-full bg-card border border-border rounded px-12 py-4 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {!searchQuery && recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/80 mb-3">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 bg-card border border-border rounded text-sm text-foreground hover:bg-foreground/10 transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {searchQuery && (
            <div>
              {filteredContent.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Search Results for "{searchQuery}"
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredContent.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Search size={48} className="text-foreground/30 mb-4" />
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    No results found
                  </h2>
                  <p className="text-foreground/60">
                    Try searching for something else
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={48} className="text-foreground/30 mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Search Setflix
              </h2>
              <p className="text-foreground/60">
                Find your favorite shows and channels
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
