import { IPTVChannel } from "./types";
import { IPTV_LOGO_BASE_URL } from "./constants";

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

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=1a1a1a&color=fff&size=200`;
}

