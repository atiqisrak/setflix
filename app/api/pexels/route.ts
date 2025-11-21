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
  } catch (error) {
    console.error("Pexels API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

