import parser from "iptv-playlist-parser";

export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  tvgId?: string;
  tvgLogo?: string;
  group?: string;
  quality?: string;
}

export interface SetflixContentItem {
  id: number;
  title: string;
  image: string;
  url?: string;
  rating?: number;
  year?: number;
  duration?: string;
  genres?: string[];
  description?: string;
  match?: number;
  maturity?: string;
}

const IPTV_PLAYLIST_URL = "https://iptv-org.github.io/iptv/index.m3u";
const IPTV_API_ROUTE = "/api/iptv";
const IPTV_LOGO_BASE_URL = "https://logo.iptv.org/";

/**
 * Fetches M3U playlist from API route (proxied to avoid CORS)
 */
export async function fetchIPTVPlaylist(
  url?: string
): Promise<string> {
  try {
    // Use API route by default to avoid CORS issues
    const fetchUrl = url || IPTV_API_ROUTE;
    
    const response = await fetch(fetchUrl, {
      cache: "no-store", // Always fetch fresh data from API route
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

/**
 * Parses M3U playlist content into IPTV channels
 */
export function parseIPTVPlaylist(m3uContent: string): IPTVChannel[] {
  try {
    const parsed = parser.parse(m3uContent);
    return parsed.items.map((item) => {
      // Extract quality from name (e.g., "Channel Name (720p)")
      const qualityMatch = item.name.match(/\((\d+p)\)/i);
      const quality = qualityMatch ? qualityMatch[1] : undefined;

      // Clean name by removing quality and brackets
      let cleanName = item.name
        .replace(/\s*\(\d+p\)/gi, "")
        .replace(/\s*\[.*?\]/g, "")
        .trim();

      return {
        id: item.tvg?.id || `channel-${Math.random().toString(36).substr(2, 9)}`,
        name: cleanName,
        url: item.url,
        tvgId: item.tvg?.id,
        tvgLogo: item.tvg?.logo,
        group: item.group?.title,
        quality,
      };
    });
  } catch (error) {
    console.error("Error parsing IPTV playlist:", error);
    throw error;
  }
}

/**
 * Gets channel logo URL
 */
export function getChannelLogo(channel: IPTVChannel): string {
  if (channel.tvgLogo) {
    return channel.tvgLogo.startsWith("http")
      ? channel.tvgLogo
      : `${IPTV_LOGO_BASE_URL}${channel.tvgLogo}`;
  }

  if (channel.tvgId) {
    return `${IPTV_LOGO_BASE_URL}${channel.tvgId}.png`;
  }

  // Generate placeholder with channel initials
  return generatePlaceholderLogo(channel.name);
}

/**
 * Generates a placeholder logo URL with channel initials
 */
function generatePlaceholderLogo(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Use a placeholder service or return a data URL
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=1a1a1a&color=fff&size=200`;
}

/**
 * Transforms IPTV channel to Setflix content format
 */
export function transformIPTVToContent(
  channel: IPTVChannel,
  index: number
): SetflixContentItem {
  // Generate a reasonable match percentage for live channels (85-98%)
  // This is just for UI display, not actual quality rating
  const matchPercentage = Math.floor(Math.random() * 14) + 85; // Random between 85-98
  
  return {
    id: index + 1,
    title: channel.name,
    image: getChannelLogo(channel),
    url: channel.url,
    // Don't set rating - quality (720p, 1080p) is not a rating percentage
    rating: undefined,
    match: matchPercentage, // Use generated match percentage instead
    genres: channel.group ? [channel.group] : undefined,
    description: `Live streaming channel${channel.quality ? ` - ${channel.quality}` : ""}`,
  };
}

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

/**
 * Groups channels by category/group
 */
export function groupChannelsByCategory(
  channels: IPTVChannel[]
): Record<string, IPTVChannel[]> {
  const grouped: Record<string, IPTVChannel[]> = {};

  channels.forEach((channel) => {
    const category = channel.group || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(channel);
  });

  return grouped;
}

/**
 * Filters channels by search query
 */
export function filterChannels(
  channels: IPTVChannel[],
  query: string
): IPTVChannel[] {
  const lowerQuery = query.toLowerCase();
  return channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(lowerQuery) ||
      channel.group?.toLowerCase().includes(lowerQuery)
  );
}

