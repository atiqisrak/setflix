"use client";

import Image from "next/image";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { motion } from "framer-motion";

interface ContentSectionProps {
  title?: string;
  content: React.ReactNode;
  imageQuery?: string;
  imageUrl?: string;
  imagePosition?: "left" | "right";
  className?: string;
  reverse?: boolean;
}

export default function ContentSection({
  title,
  content,
  imageQuery,
  imageUrl,
  imagePosition = "right",
  className = "",
  reverse = false,
}: ContentSectionProps) {
  const { photo, loading } = usePexelsMedia({
    query: imageQuery || "technology",
    type: "photo",
    orientation: "landscape",
    enabled: !!imageQuery && !imageUrl,
  });

  const finalImageUrl =
    imageUrl ||
    photo?.src?.large ||
    photo?.src?.medium ||
    "/cinematic-netflix-style-hero-banner-dark-professio.jpg";

  const isImageRight = reverse
    ? imagePosition === "left"
    : imagePosition === "right";

  return (
    <section className={`py-12 md:py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 ${
            imageQuery || imageUrl ? "lg:grid-cols-2" : ""
          } gap-8 md:gap-12 items-center ${
            isImageRight ? "" : "lg:flex-row-reverse"
          }`}
        >
          {(imageQuery || imageUrl) && (
            <motion.div
              initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`${isImageRight ? "lg:order-2" : "lg:order-1"}`}
            >
              <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                {!loading && finalImageUrl && (
                  <Image
                    src={finalImageUrl}
                    alt={title || "Content image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: isImageRight ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`${isImageRight ? "lg:order-1" : "lg:order-2"}`}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {title}
              </h2>
            )}
            <div className="text-foreground/80 prose prose-lg max-w-none">
              {content}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
