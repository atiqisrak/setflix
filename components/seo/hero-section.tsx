"use client";

import Image from "next/image";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  query?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  query = "streaming technology",
  backgroundImage,
  children,
}: HeroSectionProps) {
  const { photo, loading } = usePexelsMedia({
    query,
    type: "photo",
    orientation: "landscape",
  });

  const imageUrl =
    backgroundImage ||
    photo?.src?.large2x ||
    photo?.src?.large ||
    "/cinematic-netflix-style-hero-banner-dark-professio.jpg";

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] md:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        {!loading && imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
