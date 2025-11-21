import type { Metadata } from "next";
import {
  generateSEOMetadata,
  generateOrganizationStructuredData,
} from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us",
  description:
    "Learn about Setflix IPTV - your ultimate streaming platform for live TV and on-demand entertainment. Discover our mission, values, and commitment to delivering exceptional streaming experiences.",
  path: "/about",
});

const organizationSchema = generateOrganizationStructuredData();

export default function AboutPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HeroSection
        title="About Setflix"
        subtitle="Transforming how you experience entertainment, one stream at a time"
        query="streaming technology team"
      />
      <ContentSection
        title="Our Mission"
        imageQuery="team collaboration"
        imagePosition="right"
        content={
          <>
            <p className="mb-4">
              At Setflix, we believe that entertainment should be accessible,
              seamless, and enjoyable for everyone. Our mission is to provide
              the ultimate streaming experience that brings together live TV and
              on-demand content in one unified platform.
            </p>
            <p className="mb-4">
              We&apos;re committed to delivering high-quality streaming services
              that adapt to your lifestyle, whether you&apos;re at home or on
              the go. With cutting-edge technology and a user-centric approach,
              we&apos;re redefining what it means to stream.
            </p>
            <p>
              Our platform combines the best of traditional television with the
              flexibility of modern streaming, giving you complete control over
              your entertainment experience.
            </p>
          </>
        }
      />
      <ContentSection
        title="Our Story"
        imageQuery="technology innovation"
        imagePosition="left"
        reverse
        content={
          <>
            <p className="mb-4">
              Setflix was founded with a simple vision: to make premium
              entertainment accessible to everyone. What started as an idea to
              revolutionize IPTV streaming has grown into a comprehensive
              platform serving millions of users worldwide.
            </p>
            <p className="mb-4">
              We&apos;ve built our reputation on reliability, innovation, and
              exceptional customer service. Our team of engineers, designers,
              and content curators work tirelessly to ensure you have access to
              the best streaming experience possible.
            </p>
            <p>
              Today, Setflix continues to push boundaries, introducing new
              features and expanding our content library to meet the evolving
              needs of our community.
            </p>
          </>
        }
      />
      <ContentSection
        title="Our Values"
        imageQuery="business values"
        imagePosition="right"
        content={
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Innovation
                </h3>
                <p className="text-foreground/80">
                  We continuously invest in cutting-edge technology to enhance
                  your streaming experience and stay ahead of industry trends.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Quality</h3>
                <p className="text-foreground/80">
                  Every feature, every stream, and every interaction is designed
                  with quality in mind. We never compromise on excellence.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Accessibility
                </h3>
                <p className="text-foreground/80">
                  Entertainment should be available to everyone, everywhere. We
                  work to make our platform accessible across all devices and
                  regions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Community
                </h3>
                <p className="text-foreground/80">
                  Our users are at the heart of everything we do. We listen,
                  learn, and evolve based on your feedback and needs.
                </p>
              </div>
            </div>
          </>
        }
      />
      <ImageGallery
        query="technology office workspace"
        count={6}
        title="Our Workspace"
      />
    </PageLayout>
  );
}
