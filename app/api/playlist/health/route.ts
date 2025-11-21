import { NextRequest, NextResponse } from "next/server";

/**
 * API route to check playlist provider health
 * Proxies HEAD requests server-side to bypass CORS
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

  const startTime = Date.now();

  try {
    // Try HEAD request first (faster)
    let response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
        "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      // Try to get channel count by fetching first few lines
      let channelCount: number | undefined;
      try {
        const contentResponse = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
            "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
            "Range": "bytes=0-10000", // Fetch first 10KB only
          },
          signal: AbortSignal.timeout(10000),
        });

        if (contentResponse.ok) {
          const text = await contentResponse.text();
          channelCount = (text.match(/#EXTINF/g) || []).length;
        }
      } catch {
        // Ignore errors in counting, not critical
      }

      return NextResponse.json({
        status: responseTime > 5000 ? "degraded" : "online",
        responseTime,
        channelCount,
        successRate: 1,
        consecutiveFailures: 0,
      });
    } else {
      return NextResponse.json(
        {
          status: "offline",
          responseTime,
          error: `HTTP ${response.status}`,
          successRate: 0,
          consecutiveFailures: 1,
        },
        { status: response.status }
      );
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Handle timeout
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return NextResponse.json({
        status: "offline",
        responseTime,
        error: "Request timeout",
        successRate: 0,
        consecutiveFailures: 1,
      });
    }

    // Handle network errors
    if (error.message?.includes("fetch failed") || error.code === "ECONNREFUSED") {
      return NextResponse.json({
        status: "offline",
        responseTime,
        error: "Network error",
        successRate: 0,
        consecutiveFailures: 1,
      });
    }

    return NextResponse.json({
      status: "offline",
      responseTime,
      error: error.message || "Unknown error",
      successRate: 0,
      consecutiveFailures: 1,
    });
  }
}

