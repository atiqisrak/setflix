"use client";

import { motion } from "framer-motion";
import { Tv, Radio, Globe, Clock } from "lucide-react";

const STATS = [
  {
    icon: Tv,
    value: "10,000+",
    label: "Live Channels",
    color: "text-blue-500",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Countries",
    color: "text-green-500",
  },
  {
    icon: Radio,
    value: "24/7",
    label: "Streaming",
    color: "text-purple-500",
  },
  {
    icon: Clock,
    value: "Instant",
    label: "Access",
    color: "text-orange-500",
  },
];

export default function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-card/50 via-background to-card/50 border-y border-foreground/10">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Platform at a Glance
        </h2>
        <p className="text-foreground/60">
          Everything you need for live TV streaming
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 md:p-5 rounded-2xl bg-card border border-foreground/10 mb-4">
                <Icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-foreground/60">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

