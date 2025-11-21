"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants, backdropVariants } from "@/lib/animations";
import HeroSection from "./components/hero-section";
import ModalTabs from "./components/modal-tabs";
import TabContent from "./components/tab-content";

interface ContentDetailModalItem {
  id: number;
  title: string;
  image: string;
  url?: string;
  rating?: number;
  year?: number;
  duration?: string;
  genres?: string[];
  description?: string;
  match?: number;
  maturity?: string;
  cast?: string[];
  director?: string;
  releaseDate?: string;
}

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay?: (item: ContentDetailModalItem) => void;
  item: ContentDetailModalItem;
}

export default function ContentDetailModal({
  isOpen,
  onClose,
  onPlay,
  item,
}: ContentDetailModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "episodes" | "details"
  >("overview");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 min-h-screen"
          >
            <HeroSection
              item={item}
              isLiked={isLiked}
              isInList={isInList}
              onClose={onClose}
              onPlay={onPlay ? () => onPlay(item) : undefined}
              onToggleLike={() => setIsLiked(!isLiked)}
              onToggleList={() => setIsInList(!isInList)}
            />

            <div className="bg-background px-8 md:px-12 py-8">
              <div className="max-w-4xl">
                <ModalTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="space-y-8">
                  <TabContent activeTab={activeTab} item={item} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
