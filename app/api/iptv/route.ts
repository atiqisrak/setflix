import { NextResponse } from "next/server";

const IPTV_PLAYLIST_URL = "https://iptv-org.github.io/iptv/index.m3u";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const response = await fetch(IPTV_PLAYLIST_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch IPTV playlist" },
        { status: response.status }
      );
    }

    const playlist = await response.text();

    return new NextResponse(playlist, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error proxying IPTV playlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

