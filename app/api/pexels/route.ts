import { NextRequest, NextResponse } from "next/server";
import { getPexelsPhoto, getPexelsPhotos, getPexelsVideo } from "@/lib/seo/pexels";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "photo";
  const query = searchParams.get("query") || "technology";
  const count = parseInt(searchParams.get("count") || "1", 10);
  const orientation =
    (searchParams.get("orientation") as "landscape" | "portrait" | "square") ||
    "landscape";

  try {
    if (type === "video") {
      const video = await getPexelsVideo(query);
      return NextResponse.json({ video });
    }

    if (count > 1) {
      const photos = await getPexelsPhotos(query, count, orientation);
      return NextResponse.json({ photos });
    }

    const photo = await getPexelsPhoto(query, orientation);
    return NextResponse.json({ photo });
  } catch (error: any) {
    // Handle rate limiting gracefully - return null instead of error
    if (error?.status === 429 || error?.message?.includes("Too Many Requests")) {
      console.warn("Pexels API rate limit reached");
      // Return null values so components can use fallback images
      if (type === "video") {
        return NextResponse.json({ video: null });
      }
      if (count > 1) {
        return NextResponse.json({ photos: [] });
      }
      return NextResponse.json({ photo: null });
    }
    
    console.error("Pexels API error:", error);
    // For other errors, return null values gracefully
    if (type === "video") {
      return NextResponse.json({ video: null });
    }
    if (count > 1) {
      return NextResponse.json({ photos: [] });
    }
    return NextResponse.json({ photo: null });
  }
}

