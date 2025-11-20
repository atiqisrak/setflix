"use client";

import { useState } from "react";
import Header from "@/components/header";
import HeroBanner from "@/components/hero-banner";
import ContentCarousel from "@/components/content-carousel";
import Footer from "@/components/footer";
import ContentDetailModal from "@/components/content-detail-modal";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreInfo = (content: any) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handlePlay = () => {
    // Handle play action
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner onPlay={handlePlay} onMoreInfo={() => handleMoreInfo(null)} />

      <main className="px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
        <ContentCarousel title="Trending Now" category="trending" />
        <ContentCarousel title="Live Channels" category="live" />
        <ContentCarousel title="More to Watch" category="trending" />
      </main>

      <Footer />

      {selectedContent && (
        <ContentDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedContent(null);
          }}
          item={selectedContent}
        />
      )}
    </div>
  );
}
