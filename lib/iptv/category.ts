import { IPTVChannel } from "./types";

/**
 * Detects category from channel name and group
 */
export function detectCategory(channel: IPTVChannel): string {
  const name = channel.name.toLowerCase();
  const group = channel.group?.toLowerCase() || "";

  if (
    name.includes("news") ||
    name.includes("cnn") ||
    name.includes("bbc") ||
    name.includes("fox news") ||
    name.includes("al jazeera") ||
    group.includes("news")
  ) {
    return "News";
  }

  if (
    name.includes("sport") ||
    name.includes("espn") ||
    name.includes("football") ||
    name.includes("soccer") ||
    name.includes("basketball") ||
    name.includes("baseball") ||
    name.includes("tennis") ||
    name.includes("golf") ||
    group.includes("sport")
  ) {
    return "Sports";
  }

  if (
    name.includes("movie") ||
    name.includes("cinema") ||
    name.includes("film") ||
    name.includes("hbo") ||
    name.includes("showtime") ||
    group.includes("movie")
  ) {
    return "Movies";
  }

  if (
    name.includes("music") ||
    name.includes("mtv") ||
    name.includes("vh1") ||
    name.includes("radio") ||
    group.includes("music")
  ) {
    return "Music";
  }

  if (
    name.includes("entertainment") ||
    name.includes("comedy") ||
    name.includes("drama") ||
    name.includes("reality") ||
    group.includes("entertainment")
  ) {
    return "Entertainment";
  }

  if (
    name.includes("documentary") ||
    name.includes("discovery") ||
    name.includes("national geographic") ||
    name.includes("history") ||
    name.includes("nature") ||
    group.includes("documentary")
  ) {
    return "Documentary";
  }

  if (
    name.includes("kids") ||
    name.includes("cartoon") ||
    name.includes("disney") ||
    name.includes("nickelodeon") ||
    group.includes("kids")
  ) {
    return "Kids";
  }

  const category = channel.group || "Other";
  // Replace "Undefined" with "Browse"
  return category === "Undefined" ? "Browse" : category;
}

/**
 * Groups channels by category/group with smart categorization
 */
export function groupChannelsByCategory(
  channels: IPTVChannel[]
): Record<string, IPTVChannel[]> {
  const grouped: Record<string, IPTVChannel[]> = {};

  channels.forEach((channel) => {
    let category = detectCategory(channel);
    // Ensure "Undefined" is converted to "Browse" (in case it slips through)
    if (category === "Undefined") {
      category = "Browse";
    }
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(channel);
  });

  return grouped;
}

