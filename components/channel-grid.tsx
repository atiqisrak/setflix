"use client";

import { SetflixContentItem } from "@/lib/iptv";
import ContentCard from "@/components/content-card";

interface ChannelGridProps {
  channels: SetflixContentItem[];
  maxItems?: number;
  onPlay?: (item: SetflixContentItem) => void;
  onMoreInfo?: (item: SetflixContentItem) => void;
}

export default function ChannelGrid({
  channels,
  maxItems = 4,
  onPlay,
  onMoreInfo,
}: ChannelGridProps) {
  const displayChannels = channels.slice(0, maxItems);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {displayChannels.map((channel) => (
        <ContentCard
          key={channel.id}
          item={channel}
          onPlay={onPlay ? () => onPlay(channel) : undefined}
          onMoreInfo={onMoreInfo ? () => onMoreInfo(channel) : undefined}
        />
      ))}
    </div>
  );
}

