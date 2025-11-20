"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Grid3x3, List, TrendingUp, Radio } from "lucide-react";

const QUICK_LINKS = [
  {
    title: "Browse All",
    description: "Explore all available channels",
    icon: Grid3x3,
    href: "/channels",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Search",
    description: "Find specific channels",
    icon: Search,
    href: "/search",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Trending",
    description: "Most popular channels",
    icon: TrendingUp,
    href: "/search?sort=trending",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Live Radio",
    description: "Music and talk radio",
    icon: Radio,
    href: "/search?category=Music",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function QuickAccessSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-background via-background/50 to-background border-y border-foreground/10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Quick Access
        </h2>
        <p className="text-foreground/60">
          Jump to your favorite sections
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {QUICK_LINKS.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={link.href}>
                <div className="group relative bg-card border border-foreground/10 rounded-xl p-6 md:p-8 hover:border-accent/50 transition-all cursor-pointer h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex p-3 md:p-4 rounded-lg bg-gradient-to-br ${link.gradient} mb-4`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
                      {link.title}
                    </h3>
                    <p className="text-sm md:text-base text-foreground/60">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

