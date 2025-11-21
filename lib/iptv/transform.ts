import { IPTVChannel, SetflixContentItem } from "./types";
import { detectCategory } from "./category";
import { getChannelLogo } from "./logo";

/**
 * Transforms IPTV channel to Setflix content format
 */
export function transformIPTVToContent(
  channel: IPTVChannel,
  index: number
): SetflixContentItem {
  const category = detectCategory(channel);
  let description = `Live ${category.toLowerCase()} channel`;
  if (channel.quality) {
    description += ` - ${channel.quality}`;
  }
  if (channel.group && channel.group !== category) {
    description += ` • ${channel.group}`;
  }
  
  return {
    id: index + 1,
    title: channel.name,
    image: getChannelLogo(channel),
    url: channel.url,
    rating: undefined,
    match: undefined,
    genres: [category, ...(channel.group && channel.group !== category ? [channel.group] : [])],
    description,
  };
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

