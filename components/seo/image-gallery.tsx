"use client";

import Image from "next/image";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  query: string;
  count?: number;
  title?: string;
  className?: string;
}

export default function ImageGallery({
  query,
  count = 6,
  title,
  className = "",
}: ImageGalleryProps) {
  const { photos, loading } = usePexelsMedia({
    query,
    type: "photos",
    count,
    orientation: "landscape",
  });

  if (loading) {
    return (
      <section className={`py-12 md:py-16 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={photo.src.large}
                alt={photo.photographer || "Gallery image"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium">
                  Photo by {photo.photographer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
