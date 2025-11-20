"use client";

import { Grid3x3, List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid-small" | "grid-medium" | "grid-large" | "list";

interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewControls({
  viewMode,
  onViewModeChange,
}: ViewControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-900/50 border border-gray-800 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid-small")}
        className={cn(
          "p-2 rounded-md transition",
          viewMode === "grid-small"
            ? "bg-white text-black"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        )}
        title="Small Grid"
      >
        <Grid3x3 size={18} />
      </button>
      <button
        onClick={() => onViewModeChange("grid-medium")}
        className={cn(
          "p-2 rounded-md transition",
          viewMode === "grid-medium"
            ? "bg-white text-black"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        )}
        title="Medium Grid"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => onViewModeChange("grid-large")}
        className={cn(
          "p-2 rounded-md transition",
          viewMode === "grid-large"
            ? "bg-white text-black"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        )}
        title="Large Grid"
      >
        <List size={18} />
      </button>
    </div>
  );
}
