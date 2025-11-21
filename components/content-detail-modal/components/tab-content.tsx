import ContentCarousel from "@/components/content-carousel";

interface TabContentProps {
  activeTab: "overview" | "episodes" | "details";
  item: {
    genres?: string[];
    cast?: string[];
    director?: string;
    releaseDate?: string;
    rating?: number;
  };
}

export default function TabContent({ activeTab, item }: TabContentProps) {
  if (activeTab === "overview") {
    return (
      <div>
        {item.genres && item.genres.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-card border border-border rounded text-sm text-foreground/80"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
            More Like This
          </h3>
          <ContentCarousel title="" category="trending" hideTitle />
        </div>
      </div>
    );
  }

  if (activeTab === "episodes") {
    return (
      <div>
        <p className="text-foreground/60">Episodes coming soon</p>
      </div>
    );
  }

  if (activeTab === "details") {
    return (
      <div className="space-y-4">
        {item.cast && item.cast.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Cast
            </h3>
            <p className="text-foreground/80">{item.cast.join(", ")}</p>
          </div>
        )}
        {item.director && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Director
            </h3>
            <p className="text-foreground/80">{item.director}</p>
          </div>
        )}
        {item.releaseDate && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Release Date
            </h3>
            <p className="text-foreground/80">{item.releaseDate}</p>
          </div>
        )}
        {item.rating && (
          <div>
            <h3 className="text-sm font-semibold text-foreground/60 mb-2">
              Rating
            </h3>
            <p className="text-foreground/80">{item.rating}%</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

