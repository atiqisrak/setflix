interface ModalTabsProps {
  activeTab: "overview" | "episodes" | "details";
  onTabChange: (tab: "overview" | "episodes" | "details") => void;
}

export default function ModalTabs({
  activeTab,
  onTabChange,
}: ModalTabsProps) {
  return (
    <div className="flex gap-6 mb-8 border-b border-border">
      <button
        onClick={() => onTabChange("overview")}
        className={`pb-4 px-2 font-semibold transition ${
          activeTab === "overview"
            ? "text-foreground border-b-2 border-foreground"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => onTabChange("episodes")}
        className={`pb-4 px-2 font-semibold transition ${
          activeTab === "episodes"
            ? "text-foreground border-b-2 border-foreground"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        Episodes
      </button>
      <button
        onClick={() => onTabChange("details")}
        className={`pb-4 px-2 font-semibold transition ${
          activeTab === "details"
            ? "text-foreground border-b-2 border-foreground"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        Details
      </button>
    </div>
  );
}

