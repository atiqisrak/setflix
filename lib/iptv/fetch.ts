import { IPTV_PLAYLIST_URL } from "./constants";

/**
 * Fetches M3U playlist directly from IPTV source
 * TanStack Query handles caching automatically
 */
export async function fetchIPTVPlaylist(url?: string): Promise<string> {
  try {
    const fetchUrl = url || IPTV_PLAYLIST_URL;
    
    const response = await fetch(fetchUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Setflix/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error fetching IPTV playlist:", error);
    throw error;
  }
}

