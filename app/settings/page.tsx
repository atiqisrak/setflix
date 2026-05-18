"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Check, Tv, Newspaper, Trophy } from "lucide-react";

type Theme = "entertainment" | "sports" | "news";

const THEME_OPTIONS: { value: Theme; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "entertainment",
    label: "Entertainment",
    description: "Movies, TV shows, music and lifestyle channels",
    icon: <Tv size={22} />,
  },
  {
    value: "sports",
    label: "Sports",
    description: "Live sports, matches and sports news",
    icon: <Trophy size={22} />,
  },
  {
    value: "news",
    label: "News",
    description: "Breaking news, world events and analysis",
    icon: <Newspaper size={22} />,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("entertainment");
  const [autoplay, setAutoplay] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTheme(read("setflix-theme", "entertainment") as Theme);
    setAutoplay(read("setflix-autoplay", false));
  }, []);

  const handleSave = () => {
    save("setflix-theme", theme);
    save("setflix-autoplay", autoplay);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <SlidersHorizontal size={30} className="text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
            </div>
            <p className="text-foreground/60">Preferences are saved locally on this device.</p>
          </div>

          {/* Homepage Theme */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Homepage Theme</h2>
              <p className="text-sm text-foreground/60 mt-1">
                Choose the layout and content focus shown on the home page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEME_OPTIONS.map((opt) => {
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition text-left ${
                      active
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 text-accent">
                        <Check size={16} />
                      </span>
                    )}
                    <span className={active ? "text-accent" : "text-foreground/60"}>
                      {opt.icon}
                    </span>
                    <span className={`font-semibold text-sm ${active ? "text-accent" : "text-foreground"}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-foreground/50 leading-snug">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Playback</h2>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <p className="font-medium text-foreground">Autoplay next channel</p>
                <p className="text-sm text-foreground/60">Automatically play the next channel when one ends</p>
              </div>
              <button
                onClick={() => setAutoplay((v) => !v)}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  autoplay ? "bg-accent" : "bg-foreground/20"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
                    autoplay ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 flex items-center gap-2"
            >
              {saved ? <Check size={16} /> : null}
              {saved ? "Saved!" : "Save Settings"}
            </Button>
            {saved && (
              <p className="text-sm text-foreground/60">
                Reload the home page to see theme changes.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
