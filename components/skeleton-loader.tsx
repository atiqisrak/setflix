"use client";

import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-36 md:w-44">
      <div className="relative bg-card rounded overflow-hidden">
        <div className="relative w-full aspect-[2/3] bg-secondary animate-pulse"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-secondary rounded animate-pulse"></div>
          <div className="h-3 bg-secondary rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCarousel() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 bg-secondary rounded animate-pulse"></div>
      <div className="flex gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[500px] md:h-[80vh] lg:h-screen bg-background overflow-hidden pt-16">
      <div className="absolute inset-0 bg-secondary animate-pulse"></div>
      <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-2xl pt-8 md:pt-0 z-10">
        <div className="space-y-4 mb-8">
          <div className="h-6 w-32 bg-card rounded animate-pulse"></div>
          <div className="h-16 md:h-20 bg-card rounded animate-pulse"></div>
          <div className="h-6 w-96 bg-card rounded animate-pulse"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-card rounded animate-pulse"></div>
          <div className="h-12 w-32 bg-card rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
