"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Heart } from "lucide-react"

export default function MyListPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">My List</h1>
          <p className="text-foreground/60 text-lg">Your favorite shows and movies</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="group relative rounded-lg overflow-hidden bg-card/50 aspect-video md:aspect-auto">
              <img
                src={`/placeholder.svg?height=300&width=200&query=saved%20content%20${i + 1}`}
                alt={`Saved item ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center gap-3">
                <button className="bg-accent hover:bg-accent/90 text-accent-foreground p-3 rounded-full transition">
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.from({ length: 8 }).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart size={48} className="text-foreground/30 mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No items yet</h2>
            <p className="text-foreground/60">Start adding your favorite shows and movies to your list</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
