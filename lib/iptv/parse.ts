import parser from "iptv-playlist-parser";
import { IPTVChannel } from "./types";

/**
 * Parses M3U playlist content into IPTV channels
 */
export function parseIPTVPlaylist(m3uContent: string): IPTVChannel[] {
  try {
    const parsed = parser.parse(m3uContent);
    return parsed.items.map((item, index) => {
      const qualityMatch = item.name.match(/\((\d+p)\)/i);
      const quality = qualityMatch ? qualityMatch[1] : undefined;

      let cleanName = item.name
        .replace(/\s*\(\d+p\)/gi, "")
        .replace(/\s*\[.*?\]/g, "")
        .trim();

      const generateId = (url: string, idx: number): string => {
        if (item.tvg?.id) return item.tvg.id;
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
          const char = url.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return `channel-${Math.abs(hash).toString(36)}-${idx}`;
      };

      return {
        id: generateId(item.url, index),
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

