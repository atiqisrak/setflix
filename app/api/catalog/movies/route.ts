import { NextResponse } from "next/server";
import type { MovieItem } from "@/lib/content/types";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "movies.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const movies: MovieItem[] = JSON.parse(raw);
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Catalog movies error:", error);
    return NextResponse.json([]);
  }
}
