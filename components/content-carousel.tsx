"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "@/components/content-card";
import ContentDetailModal from "@/components/content-detail-modal";

interface ContentCarouselProps {
  title: string;
  category: string;
  hideTitle?: boolean;
}

const CONTENT_DATA = {
  trending: [
    { id: 1, title: "News Channel", image: "/tv-channel-news-broadcast.jpg" },
    { id: 2, title: "Sports HD", image: "/sports-broadcast-stadium-live.jpg" },
    {
      id: 3,
      title: "Entertainment",
      image: "/entertainment-television-live-studio.jpg",
    },
    {
      id: 4,
      title: "Movies Plus",
      image: "/action-thriller-cinematic-dark.jpg",
    },
    {
      id: 5,
      title: "Documentary",
      image: "/science-fiction-professional-streaming.jpg",
    },
    {
      id: 6,
      title: "Music Channel",
      image: "/music-channel-live-broadcast.jpg",
    },
    {
      id: 7,
      title: "Comedy Central",
      image: "/drama-romantic-professional-television.jpg",
    },
    {
      id: 8,
      title: "Drama Channel",
      image: "/crime-thriller-dark-professional-series.jpg",
    },
  ],
  live: [
    {
      id: 9,
      title: "Breaking News",
      image: "/live-news-broadcast-professional.jpg",
    },
    {
      id: 10,
      title: "Sports Live",
      image: "/sports-broadcast-stadium-live.jpg",
    },
    { id: 11, title: "Music Hits", image: "/music-channel-live-broadcast.jpg" },
    {
      id: 12,
      title: "Movies Now",
      image: "/classic-movies-cinema-broadcast.jpg",
    },
    {
      id: 13,
      title: "Nature Docs",
      image: "/documentary-nature-professional-cinema.jpg",
    },
    {
      id: 14,
      title: "Kids Zone",
      image: "/entertainment-television-live-studio.jpg",
    },
  ],
};

export default function ContentCarousel({
  title,
  category,
  hideTitle = false,
}: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedItem, setSelectedItem] = useState<
    (typeof CONTENT_DATA.trending)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", updateScrollButtons);
      return () =>
        scrollElement.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;

      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      scrollRef.current.scroll({ left: newScrollLeft, behavior: "smooth" });

      setTimeout(updateScrollButtons, 300);
    }
  };

  const items =
    CONTENT_DATA[category as keyof typeof CONTENT_DATA] ||
    CONTENT_DATA.trending;

  return (
    <div className="group relative">
      {!hideTitle && (
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          {title}
        </h2>
      )}

      <div className="relative">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        )}

        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-scroll scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onMoreInfo={() => {
                setSelectedItem(item);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        {selectedItem && (
          <ContentDetailModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
          />
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight size={32} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
