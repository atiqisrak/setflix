import { IPTV_API_ROUTE } from "./constants";

/**
 * Fetches M3U playlist from API route (proxied to avoid CORS)
 */
export async function fetchIPTVPlaylist(url?: string): Promise<string> {
  try {
    const fetchUrl = url || IPTV_API_ROUTE;
    
    const response = await fetch(fetchUrl, {
      cache: "no-store",
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

