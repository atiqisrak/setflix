"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePexelsMedia } from "@/hooks/use-pexels-media";
import { useMemo } from "react";

const CATEGORIES = [
  {
    name: "News",
    query: "news broadcast television studio",
    description: "24/7 Breaking News",
    color: "from-blue-600/80 to-blue-800/80",
    href: "/search?category=News",
  },
  {
    name: "Sports",
    query: "sports broadcast stadium live",
    description: "Live Sports Action",
    color: "from-green-600/80 to-green-800/80",
    href: "/search?category=Sports",
  },
  {
    name: "Entertainment",
    query: "entertainment television live studio",
    description: "Shows & Series",
    color: "from-purple-600/80 to-purple-800/80",
    href: "/search?category=Entertainment",
  },
  {
    name: "Movies",
    query: "classic movies cinema broadcast",
    description: "Cinema Classics",
    color: "from-red-600/80 to-red-800/80",
    href: "/search?category=Movies",
  },
  {
    name: "Music",
    query: "music channel live broadcast",
    description: "Live Music Channels",
    color: "from-pink-600/80 to-pink-800/80",
    href: "/search?category=Music",
  },
  {
    name: "Documentary",
    query: "documentary nature professional cinema",
    description: "Nature & Science",
    color: "from-amber-600/80 to-amber-800/80",
    href: "/search?category=Documentary",
  },
];

interface CategoryCardProps {
  category: typeof CATEGORIES[0];
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const { photo, loading } = usePexelsMedia({
    query: category.query,
    type: "photo",
    orientation: "landscape",
    enabled: true,
  });

  const imageUrl = useMemo(() => {
    if (photo?.src?.large2x) return photo.src.large2x;
    if (photo?.src?.large) return photo.src.large;
    return "/live-news-broadcast-professional.jpg";
  }, [photo]);

  return (
    <motion.div
      key={category.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={category.href}>
        <div className="group relative h-48 md:h-64 lg:h-72 rounded-xl overflow-hidden cursor-pointer">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${category.color}`}></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  {category.description}
                </p>
              </div>
              <motion.div
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 group-hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="text-white w-4 h-4 md:w-5 md:h-5" />
              </motion.div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedCategoriesShowcase() {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
          Explore by Category
        </h2>
        <p className="text-foreground/70 text-lg md:text-xl">
          Discover channels organized by your interests
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
        {CATEGORIES.map((category, index) => (
          <CategoryCard key={category.name} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}

