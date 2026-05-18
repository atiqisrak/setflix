"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Play,
  Globe,
  Calendar,
  MapPin,
  Tv,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VideoPlayer from "@/components/video-player";
import ChannelCard from "@/components/channel-card";
import { Button } from "@/components/ui/button";
import { useIPTVChannels } from "@/hooks/use-iptv-channels";
import { useRecentlyWatched } from "@/hooks/use-recently-watched";
import {
  SetflixContentItem,
  filterChannels,
  transformIPTVToContent,
} from "@/lib/iptv";

const OPENING_MATCH = new Date("2026-06-11T20:00:00-06:00");

const TOURNAMENT_PHASES = [
  {
    name: "Group Stage",
    dates: "Jun 11 – Jun 26",
    matches: 72,
    emoji: "⚽",
    from: "from-emerald-600",
    to: "to-emerald-800",
  },
  {
    name: "Round of 32",
    dates: "Jun 27 – Jul 2",
    matches: 16,
    emoji: "🏟️",
    from: "from-blue-600",
    to: "to-blue-800",
  },
  {
    name: "Round of 16",
    dates: "Jul 3 – Jul 7",
    matches: 8,
    emoji: "⚡",
    from: "from-violet-600",
    to: "to-violet-800",
  },
  {
    name: "Quarter-Finals",
    dates: "Jul 9 – Jul 11",
    matches: 4,
    emoji: "🎯",
    from: "from-orange-600",
    to: "to-orange-800",
  },
  {
    name: "Semi-Finals",
    dates: "Jul 14 – Jul 15",
    matches: 2,
    emoji: "🌟",
    from: "from-yellow-600",
    to: "to-yellow-800",
  },
  {
    name: "The Final",
    dates: "Jul 19, 2026",
    matches: 1,
    emoji: "🏆",
    from: "from-red-600",
    to: "to-red-900",
    note: "MetLife Stadium · NJ / NY",
  },
];

const HOST_VENUES: Record<
  string,
  { name: string; city: string; capacity: string; role?: string }[]
> = {
  "🇲🇽 Mexico": [
    {
      name: "Estadio Azteca",
      city: "Mexico City",
      capacity: "80,000",
      role: "Opening Match",
    },
    { name: "Estadio BBVA", city: "Monterrey", capacity: "51,000" },
    { name: "Estadio Akron", city: "Guadalajara", capacity: "49,000" },
  ],
  "🇨🇦 Canada": [
    { name: "BC Place", city: "Vancouver", capacity: "54,000" },
    { name: "BMO Field", city: "Toronto", capacity: "45,000" },
  ],
  "🇺🇸 United States": [
    {
      name: "MetLife Stadium",
      city: "New York / New Jersey",
      capacity: "82,500",
      role: "Final Venue",
    },
    { name: "AT&T Stadium", city: "Dallas", capacity: "80,000" },
    { name: "Rose Bowl", city: "Pasadena", capacity: "92,000" },
    { name: "SoFi Stadium", city: "Los Angeles", capacity: "70,000" },
    { name: "Hard Rock Stadium", city: "Miami", capacity: "65,000" },
    {
      name: "Mercedes-Benz Stadium",
      city: "Atlanta",
      capacity: "71,000",
    },
    {
      name: "Lincoln Financial Field",
      city: "Philadelphia",
      capacity: "69,000",
    },
    { name: "Gillette Stadium", city: "Boston", capacity: "65,000" },
    { name: "Arrowhead Stadium", city: "Kansas City", capacity: "76,000" },
    { name: "NRG Stadium", city: "Houston", capacity: "72,000" },
    { name: "Levi's Stadium", city: "Santa Clara", capacity: "68,000" },
  ],
};

const KEY_FACTS = [
  { label: "Teams", value: "48", emoji: "👥" },
  { label: "Matches", value: "104", emoji: "⚽" },
  { label: "Venues", value: "16", emoji: "🏟️" },
  { label: "Host Nations", value: "3", emoji: "🌎" },
  { label: "Days", value: "39", emoji: "📅" },
  { label: "Groups", value: "12", emoji: "🔢" },
];

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [over, setOver] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = OPENING_MATCH.getTime() - Date.now();
      if (diff <= 0) { setOver(true); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (over) {
    return (
      <p className="text-2xl font-bold text-yellow-400 animate-pulse">
        🔴 Tournament is Underway!
      </p>
    );
  }

  return (
    <div className="flex gap-3 md:gap-5 justify-center">
      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
        <div key={unit} className="text-center">
          <div className="bg-black/60 backdrop-blur border border-yellow-500/30 rounded-xl px-3 md:px-5 py-2 md:py-4 min-w-[60px] md:min-w-[80px]">
            <span className="text-2xl md:text-4xl font-black text-yellow-400 tabular-nums">
              {String(time[unit]).padStart(2, "0")}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1.5 uppercase tracking-widest">
            {unit}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function WorldCupPage() {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [activeCountry, setActiveCountry] = useState("🇲🇽 Mexico");

  const { channels, isLoading } = useIPTVChannels();
  const { addItem } = useRecentlyWatched();

  const sportChannels = useMemo(() => {
    if (!channels.length) return [];
    const sports = filterChannels(channels, "sport");
    const base = sports.length > 0 ? sports : channels;
    return base.slice(0, 12).map((ch, i) => transformIPTVToContent(ch, i));
  }, [channels]);

  const handlePlay = (item: SetflixContentItem) => {
    if (!item.url) return;
    addItem({
      id: String(item.id),
      title: item.title,
      url: item.url,
      logo: item.image,
      group: item.genres?.[0],
    });
    setStreamUrl(item.url);
    setStreamTitle(item.title);
    setIsPlayerOpen(true);
  };

  const countryKeys = Object.keys(HOST_VENUES);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-black to-red-950/60" />

        {/* decorative footballs */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-5xl opacity-[0.04]"
              style={{ left: `${(i * 19 + 5) % 95}%`, top: `${(i * 13 + 8) % 90}%` }}
              animate={{ rotate: [0, 360], y: [0, -30, 0] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            >
              ⚽
            </motion.span>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl md:text-8xl mb-6 inline-block"
            >
              🏆
            </motion.div>

            <p className="text-yellow-400 font-bold text-xs md:text-sm uppercase tracking-[0.35em] mb-5">
              FIFA World Cup 2026
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-5 leading-[0.95]">
              THE GREATEST
              <span className="block bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                SHOW ON EARTH
              </span>
            </h1>

            <p className="text-base md:text-xl text-white/70 mb-3 tracking-wide">
              USA · Canada · Mexico · 48 Teams · 104 Matches · 16 Venues
            </p>

            <div className="mb-10 mt-8">
              <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-5">
                Countdown to Opening Match
              </p>
              <Countdown />
              <p className="text-white/40 text-xs mt-4">
                June 11, 2026 · Estadio Azteca · Mexico City
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/channels">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-400 text-white px-8 py-6 text-base md:text-lg font-bold gap-2 shadow-lg shadow-green-900/50"
                >
                  <Tv size={22} />
                  Watch Live Channels
                </Button>
              </Link>
              <a href="#venues">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-6 text-base md:text-lg font-semibold bg-white/5 backdrop-blur-sm gap-2"
                >
                  <MapPin size={22} />
                  Explore Venues
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Key Facts ── */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-black to-background">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {KEY_FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-4 text-center hover:border-yellow-500/40 transition"
            >
              <div className="text-3xl mb-2">{fact.emoji}</div>
              <div className="text-3xl font-black text-foreground">{fact.value}</div>
              <div className="text-xs text-foreground/50 uppercase tracking-wider mt-1">
                {fact.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <main className="px-4 md:px-8 pb-24 space-y-20 max-w-7xl mx-auto">

        {/* ── Tournament Schedule ── */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="text-yellow-400" size={28} />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tournament Schedule
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOURNAMENT_PHASES.map((phase, i) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-xl p-6 bg-gradient-to-br ${phase.from} ${phase.to} overflow-hidden`}
              >
                <div className="absolute right-4 top-4 text-6xl opacity-10 pointer-events-none">
                  {phase.emoji}
                </div>
                <div className="text-3xl mb-3">{phase.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">{phase.name}</h3>
                <p className="text-white/70 text-sm mb-3">{phase.dates}</p>
                <p className="text-white font-semibold">
                  {phase.matches} {phase.matches === 1 ? "Match" : "Matches"}
                </p>
                {phase.note && (
                  <p className="mt-2 text-xs text-yellow-300 font-bold uppercase tracking-wider">
                    {phase.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Host Venues ── */}
        <section id="venues">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="text-yellow-400" size={28} />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Host Venues
            </h2>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {countryKeys.map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition ${
                  activeCountry === country
                    ? "bg-yellow-500 text-black shadow-md shadow-yellow-900/30"
                    : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {HOST_VENUES[activeCountry].map((venue, i) => (
                <motion.div
                  key={venue.name}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-yellow-500/50 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-foreground text-base leading-tight">
                        {venue.name}
                      </h3>
                      <p className="text-foreground/50 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={11} />
                        {venue.city}
                      </p>
                    </div>
                    {venue.role && (
                      <span className="flex-shrink-0 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full font-semibold border border-yellow-500/30">
                        {venue.role}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/50 text-sm">
                    👥 {venue.capacity} capacity
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Live Sports Channels ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Watch Live Sports Now
              </h2>
            </div>
            <Link href="/channels">
              <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 gap-2 hidden sm:flex">
                All Channels <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video bg-foreground/10 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : sportChannels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {sportChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  item={channel}
                  viewMode="grid-small"
                  onPlay={() => handlePlay(channel)}
                  onMoreInfo={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/40">
              <Tv size={48} className="mx-auto mb-4 opacity-30" />
              <p className="mb-4">Loading sports channels…</p>
              <Link href="/channels">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Browse All Channels
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* ── Why Watch on Setflix ── */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Why Watch World Cup 2026 on Setflix?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📡",
                title: "Live Streams",
                desc: "Access thousands of live sports channels from USA, Canada, and Mexico — all in one place.",
              },
              {
                icon: "🌎",
                title: "Global Coverage",
                desc: "Watch matches in any language. Spanish, English, French, Portuguese and more.",
              },
              {
                icon: "📱",
                title: "Any Device",
                desc: "Stream on your phone, tablet, laptop, or smart TV — no subscription required.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 text-center hover:border-yellow-500/40 transition"
              >
                <div className="text-5xl mb-5">{card.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-800 via-green-700 to-yellow-700 p-10 md:p-16 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-[220px] opacity-[0.06]">
            🏆
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Don&apos;t Miss a Single Match
            </h2>
            <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Stream every World Cup 2026 match live. Access thousands of sports
              channels from three host nations — completely free.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/channels">
                <Button
                  size="lg"
                  className="bg-white text-green-800 hover:bg-white/90 px-8 py-6 text-lg font-black gap-2"
                >
                  <Play size={22} fill="currentColor" />
                  Watch Now
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold gap-2"
                >
                  <Globe size={22} />
                  Browse Channels
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />

      <VideoPlayer
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setStreamUrl("");
          setStreamTitle("");
        }}
        streamUrl={streamUrl}
        title={streamTitle}
      />
    </div>
  );
}
