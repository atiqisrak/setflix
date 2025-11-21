import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import SpeedTestWidget from "@/components/seo/speed-test-widget";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Speed Test",
  description:
    "Test your internet connection speed to ensure optimal streaming quality on Setflix IPTV. Check your download, upload, and ping speeds.",
  path: "/speed-test",
});

export default function SpeedTestPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Internet Speed Test"
        subtitle="Check your connection speed for optimal streaming"
        query="internet speed technology"
      />
      <SpeedTestWidget />
      <ContentSection
        title="Understanding Your Results"
        imageQuery="internet connection speed"
        imagePosition="right"
        content={
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Ping</h3>
                <p className="text-foreground/80">
                  Ping measures the response time of your connection. Lower ping
                  (under 50ms) is better for streaming, as it reduces buffering
                  and improves responsiveness.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Download Speed
                </h3>
                <p className="text-foreground/80">
                  Download speed determines how quickly data can be received. For
                  streaming, you need: 3 Mbps for SD, 5 Mbps for HD, and 25
                  Mbps for 4K content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Upload Speed
                </h3>
                <p className="text-foreground/80">
                  Upload speed affects how quickly you can send data. While less
                  critical for streaming, it&apos;s important for video calls and
                  sharing content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Tips for Better Streaming
                </h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Use a wired connection when possible</li>
                  <li>Close other applications using bandwidth</li>
                  <li>Position your router closer to your device</li>
                  <li>Update your router firmware regularly</li>
                  <li>Consider upgrading your internet plan if speeds are consistently low</li>
                </ul>
              </div>
            </div>
          </>
        }
      />
    </PageLayout>
  );
}

