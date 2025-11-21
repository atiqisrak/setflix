import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";
import { Smartphone, Tablet, Monitor, Tv, Gamepad2, Laptop } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Ways to Watch",
  description:
    "Watch Setflix IPTV on any device - smart TVs, smartphones, tablets, computers, and streaming devices. Stream your favorite content anywhere, anytime.",
  path: "/ways-to-watch",
});

const devices = [
  {
    icon: Smartphone,
    title: "Smartphones",
    description: "Watch on iOS and Android devices with our mobile app",
    imageQuery: "smartphone mobile phone",
  },
  {
    icon: Tablet,
    title: "Tablets",
    description: "Enjoy content on iPad, Android tablets, and more",
    imageQuery: "tablet device",
  },
  {
    icon: Monitor,
    title: "Computers",
    description: "Stream on Windows, Mac, or Linux via web browser",
    imageQuery: "computer laptop",
  },
  {
    icon: Tv,
    title: "Smart TVs",
    description: "Watch on Samsung, LG, Sony, and other smart TV platforms",
    imageQuery: "smart tv television",
  },
  {
    icon: Gamepad2,
    title: "Gaming Consoles",
    description: "Access Setflix on PlayStation, Xbox, and Nintendo Switch",
    imageQuery: "gaming console",
  },
  {
    icon: Laptop,
    title: "Streaming Devices",
    description: "Use Roku, Apple TV, Chromecast, Fire TV, and more",
    imageQuery: "streaming device",
  },
];

export default function WaysToWatchPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Ways to Watch"
        subtitle="Stream Setflix on any device, anywhere"
        query="devices streaming technology"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device, index) => {
              const Icon = device.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {device.title}
                  </h3>
                  <p className="text-foreground/70">{device.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <ContentSection
        title="Download Our Apps"
        imageQuery="mobile app download"
        imagePosition="right"
        content={
          <>
            <p className="mb-4">
              Get the best streaming experience with our native apps, available
              on all major platforms.
            </p>
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  iOS App Store
                </h3>
                <p className="text-foreground/80">
                  Download from the App Store for iPhone and iPad. Optimized for
                  iOS with support for offline viewing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Google Play Store
                </h3>
                <p className="text-foreground/80">
                  Available on Android devices through Google Play. Full
                  feature support including downloads and casting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Web Browser
                </h3>
                <p className="text-foreground/80">
                  No download required! Stream directly from your web browser on
                  any computer. Works with Chrome, Firefox, Safari, and Edge.
                </p>
              </div>
            </div>
          </>
        }
      />
      <ContentSection
        title="Streaming Quality"
        imageQuery="4k ultra hd quality"
        imagePosition="left"
        reverse
        content={
          <>
            <p className="mb-4">
              Setflix automatically adjusts video quality based on your internet
              connection to ensure smooth playback. You can also manually select
              your preferred quality.
            </p>
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">4K Ultra HD</h3>
                <p className="text-foreground/80">
                  Experience stunning 4K resolution on supported devices and
                  content. Requires 25 Mbps internet connection.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Full HD</h3>
                <p className="text-foreground/80">
                  High definition streaming at 1080p. Recommended for most
                  viewing experiences. Requires 5 Mbps connection.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Standard Definition
                </h3>
                <p className="text-foreground/80">
                  Perfect for slower connections or data-saving mode. Requires
                  3 Mbps connection.
                </p>
              </div>
            </div>
          </>
        }
      />
      <ImageGallery
        query="streaming devices technology"
        count={6}
        title="Supported Devices"
      />
    </PageLayout>
  );
}

