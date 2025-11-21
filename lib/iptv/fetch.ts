import { IPTV_PLAYLIST_URL } from "./constants";

/**
 * Fetches M3U playlist from IPTV source
 * Uses API proxy route to bypass CORS when running client-side
 * Uses direct fetch when running server-side
 * TanStack Query handles caching automatically
 */
export async function fetchIPTVPlaylist(url?: string): Promise<string> {
  try {
    const fetchUrl = url || IPTV_PLAYLIST_URL;
    
    // When running client-side, use API proxy route to bypass CORS
    // When running server-side, fetch directly (no CORS restrictions)
    const isClientSide = typeof window !== "undefined";
    
    if (isClientSide) {
      // Use API route proxy on client-side to bypass CORS
      const proxyUrl = `/api/playlist?url=${encodeURIComponent(fetchUrl)}`;
      const response = await fetch(proxyUrl, {
        cache: "no-store",
        headers: {
          "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch playlist: ${response.statusText}`
        );
      }

      return await response.text();
    } else {
      // Server-side: fetch directly (no CORS restrictions)
      const response = await fetch(fetchUrl, {
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
          "Accept": "application/vnd.apple.mpegurl, application/x-mpegURL, text/plain, */*",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }

      return await response.text();
    }
  } catch (error: any) {
    console.error("Error fetching IPTV playlist:", error);
    
    // Provide more helpful error messages
    if (error.message?.includes("CORS") || error.message?.includes("cors")) {
      throw new Error(
        "CORS error: Unable to fetch playlist. Please try a different provider."
      );
    }
    
    if (error.message?.includes("timeout")) {
      throw new Error(
        "Request timeout: Playlist server took too long to respond. Please try again."
      );
    }
    
    if (error.message?.includes("Network error")) {
      throw new Error(
        "Network error: Unable to reach playlist server. Please check your connection."
      );
    }
    
    throw error;
  }
}

