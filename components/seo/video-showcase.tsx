"use client";

import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoShowcaseProps {
  query: string;
  title?: string;
  className?: string;
}

export default function VideoShowcase({
  query,
  title,
  className = "",
}: VideoShowcaseProps) {
  const { video, loading } = usePexelsMedia({
    query,
    type: "video",
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
          <div className="aspect-video bg-muted rounded-lg animate-pulse" />
        </div>
      </section>
    );
  }

  if (!video) {
    return null;
  }

  const hdVideo = video.video_files.find(
    (file) => file.quality === "hd" || file.quality === "sd"
  );

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {title}
          </h2>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video rounded-lg overflow-hidden bg-muted"
        >
          {hdVideo && (
            <video
              src={hdVideo.link}
              poster={video.image}
              controls
              className="w-full h-full object-cover"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {!hdVideo && (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-16 h-16 text-foreground/40" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
