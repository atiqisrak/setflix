import { NextRequest, NextResponse } from "next/server";
import type { MovieItem, SeriesItem } from "@/lib/content/types";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  if (!q) {
    return NextResponse.json({ movies: [], shows: [] });
  }
  try {
    const moviesPath = path.join(process.cwd(), "data", "movies.json");
    const showsPath = path.join(process.cwd(), "data", "shows.json");
    const movies: MovieItem[] = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));
    const shows: SeriesItem[] = JSON.parse(fs.readFileSync(showsPath, "utf-8"));
    const filteredMovies = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genres?.some((g) => g.toLowerCase().includes(q))
    );
    const filteredShows = shows.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genres?.some((g) => g.toLowerCase().includes(q))
    );
    return NextResponse.json({ movies: filteredMovies, shows: filteredShows });
  } catch (error) {
    console.error("Catalog search error:", error);
    return NextResponse.json({ movies: [], shows: [] });
  }
}
