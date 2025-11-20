"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import ContentCarousel from "@/components/content-carousel"
import { useState } from "react"

export default function BrowsePage() {
  const [selectedGenre, setSelectedGenre] = useState("all")

  const genres = ["All", "Action", "Comedy", "Drama", "Documentary", "Live TV", "Sports"]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Browse All</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre.toLowerCase())}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition ${
                  selectedGenre === genre.toLowerCase()
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <ContentCarousel title="Trending Now" category="trending" />
          <ContentCarousel title="Live Channels" category="live" />
          <ContentCarousel title="More Trending" category="trending" />
          <ContentCarousel title="Recommended for You" category="live" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
