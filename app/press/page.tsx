import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Press",
  description:
    "Press releases, media kit, and press contacts for Setflix IPTV. Stay updated with our latest news and announcements.",
  path: "/press",
});

const pressReleases = [
  {
    date: "2024-01-15",
    title: "Setflix Launches New 4K Streaming Support",
    excerpt:
      "Setflix announces comprehensive 4K streaming support across all major platforms, enhancing the viewing experience for millions of users.",
  },
  {
    date: "2023-12-10",
    title: "Setflix Reaches 10 Million Active Users",
    excerpt:
      "Setflix celebrates a major milestone, reaching 10 million active users worldwide, marking significant growth in the IPTV streaming market.",
  },
  {
    date: "2023-11-05",
    title: "New Mobile App Update with Enhanced Features",
    excerpt:
      "Setflix releases a major mobile app update with improved performance, new features, and enhanced user interface design.",
  },
];

export default function PressPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Press & Media"
        subtitle="Latest news and announcements from Setflix"
        query="press conference media"
      />
      <ContentSection
        title="Press Releases"
        imageQuery="news press conference"
        imagePosition="right"
        content={
          <>
            <p className="mb-6">
              Stay informed about the latest developments, product launches, and
              company news from Setflix. For media inquiries, please contact our
              press team.
            </p>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div
                  key={index}
                  className="border-l-4 border-accent pl-4 py-2"
                >
                  <div className="text-sm text-foreground/60 mb-2">
                    {new Date(release.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {release.title}
                  </h3>
                  <p className="text-foreground/80">{release.excerpt}</p>
                </div>
              ))}
            </div>
          </>
        }
      />
      <ContentSection
        title="Media Kit"
        imageQuery="branding design"
        imagePosition="left"
        reverse
        content={
          <>
            <p className="mb-4">
              Download our media kit for logos, brand guidelines, product
              screenshots, and other assets for press and media use.
            </p>
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Brand Assets
                </h3>
                <p className="text-foreground/80">
                  High-resolution logos, brand colors, and typography guidelines.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Product Screenshots
                </h3>
                <p className="text-foreground/80">
                  Latest product screenshots and interface designs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Press Contacts
                </h3>
                <p className="text-foreground/80">
                  For media inquiries, please contact:{" "}
                  <a
                    href="mailto:press@setflix.com"
                    className="text-accent hover:underline"
                  >
                    press@setflix.com
                  </a>
                </p>
              </div>
            </div>
          </>
        }
      />
      <ImageGallery
        query="media press conference"
        count={6}
        title="Press Events"
      />
    </PageLayout>
  );
}

