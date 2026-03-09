import { NextResponse } from "next/server";
import type { SeriesItem } from "@/lib/content/types";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "shows.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const shows: SeriesItem[] = JSON.parse(raw);
    return NextResponse.json(shows);
  } catch (error) {
    console.error("Catalog shows error:", error);
    return NextResponse.json([]);
  }
}
