export * from "./types";
export * from "./fetch";
export * from "./parse";
export * from "./category";
export * from "./transform";
export * from "./logo";
export * from "./country";

import { fetchIPTVPlaylist } from "./fetch";
import { parseIPTVPlaylist } from "./parse";
import { IPTVChannel } from "./types";

/**
 * Fetches and parses IPTV channels
 */
export async function getIPTVChannels(): Promise<IPTVChannel[]> {
  try {
    const m3uContent = await fetchIPTVPlaylist();
    return parseIPTVPlaylist(m3uContent);
  } catch (error) {
    console.error("Error getting IPTV channels:", error);
    throw error;
  }
}

