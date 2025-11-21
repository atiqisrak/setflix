import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Investor Relations",
  description:
    "Investor information, financial reports, and corporate governance for Setflix IPTV. Learn about our growth strategy and investment opportunities.",
  path: "/investor-relations",
});

const financialHighlights = [
  { metric: "Active Users", value: "10M+", description: "Worldwide" },
  { metric: "Revenue Growth", value: "150%", description: "Year over year" },
  { metric: "Content Library", value: "50K+", description: "Channels & shows" },
  { metric: "Market Presence", value: "180+", description: "Countries" },
];

export default function InvestorRelationsPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Investor Relations"
        subtitle="Building the future of streaming, one investment at a time"
        query="business finance growth"
      />
      <ContentSection
        title="Company Overview"
        imageQuery="business growth chart"
        imagePosition="right"
        content={
          <>
            <p className="mb-4">
              Setflix is a leading IPTV streaming platform that has
              revolutionized how millions of users consume entertainment. With a
              focus on innovation, quality, and user experience, we continue to
              expand our market presence and deliver exceptional value to our
              stakeholders.
            </p>
            <p className="mb-4">
              Our business model combines subscription revenue with strategic
              partnerships, creating a sustainable and scalable growth engine.
              We&apos;re committed to transparency, strong corporate governance,
              and delivering long-term value to our investors.
            </p>
            <p>
              As we continue to grow, we remain focused on expanding our content
              library, enhancing our technology platform, and entering new
              markets to drive continued success.
            </p>
          </>
        }
      />
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Financial Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialHighlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {highlight.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {highlight.metric}
                </div>
                <div className="text-sm text-foreground/60">
                  {highlight.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContentSection
        title="Investor Resources"
        imageQuery="financial documents"
        imagePosition="left"
        reverse
        content={
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Financial Reports
                </h3>
                <p className="text-foreground/80">
                  Access quarterly and annual financial reports, earnings
                  statements, and investor presentations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Corporate Governance
                </h3>
                <p className="text-foreground/80">
                  Information about our board of directors, corporate policies,
                  and governance practices.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Stock Information
                </h3>
                <p className="text-foreground/80">
                  Real-time stock quotes, historical data, and dividend
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Contact Investor Relations
                </h3>
                <p className="text-foreground/80">
                  For investor inquiries, please contact:{" "}
                  <a
                    href="mailto:investors@setflix.com"
                    className="text-accent hover:underline"
                  >
                    investors@setflix.com
                  </a>
                </p>
              </div>
            </div>
          </>
        }
      />
      <ImageGallery
        query="business finance meeting"
        count={6}
        title="Corporate Events"
      />
    </PageLayout>
  );
}

