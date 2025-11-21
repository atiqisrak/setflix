"use client";

import { SetflixContentItem } from "@/lib/iptv";
import ListView from "./components/list-view";
import GridView from "./components/grid-view";

type ViewMode = "grid-small" | "grid-medium" | "grid-large" | "list";

interface ChannelCardProps {
  item: SetflixContentItem;
  onPlay?: () => void;
  onMoreInfo?: () => void;
  viewMode?: ViewMode;
}

export default function ChannelCard({
  item,
  onPlay,
  onMoreInfo,
  viewMode = "grid-medium",
}: ChannelCardProps) {
  if (viewMode === "list") {
    return (
      <ListView item={item} onPlay={onPlay} onMoreInfo={onMoreInfo} />
    );
  }

  return (
    <GridView
      item={item}
      viewMode={viewMode}
      onPlay={onPlay}
      onMoreInfo={onMoreInfo}
    />
  );
}

