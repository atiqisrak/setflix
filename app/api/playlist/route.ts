import { NextRequest, NextResponse } from "next/server";

/**
 * API route to proxy playlist requests and bypass CORS
 * Fetches playlists server-side where CORS doesn't apply
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Validate URL
  try {
    const urlObj = new URL(url);
    // Only allow http/https protocols
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return NextResponse.json(
        { error: "Invalid protocol. Only HTTP/HTTPS allowed." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  try {
    // Fetch playlist server-side (no CORS restrictions)
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
        "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
      },
      // Timeout after 30 seconds
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `Failed to fetch playlist: ${response.statusText}`,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Get playlist content as text
    const playlistContent = await response.text();

    if (!playlistContent || playlistContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Empty playlist content" },
        { status: 500 }
      );
    }

    // Return playlist content with appropriate headers
    return new NextResponse(playlistContent, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error: any) {
    console.error("Error proxying playlist:", error);
    
    // Handle timeout errors
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timeout. Playlist server took too long to respond." },
        { status: 504 }
      );
    }

    // Handle network errors
    if (error.message?.includes("fetch failed") || error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Network error. Unable to reach playlist server." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch playlist" },
      { status: 500 }
    );
  }
}

