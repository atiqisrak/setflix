import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";
import Link from "next/link";

export const metadata: Metadata = generateSEOMetadata({
  title: "Careers",
  description:
    "Join the Setflix team and help shape the future of streaming. Explore career opportunities in technology, design, content, and more.",
  path: "/careers",
});

const openPositions = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "New York, NY / Remote",
    type: "Full-time",
  },
  {
    title: "Content Curator",
    department: "Content",
    location: "Los Angeles, CA / Remote",
    type: "Full-time",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Austin, TX / Remote",
    type: "Full-time",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Join Our Team"
        subtitle="Build the future of streaming with us"
        query="team collaboration work"
      />
      <ContentSection
        title="Why Work at Setflix?"
        imageQuery="team meeting collaboration"
        imagePosition="right"
        content={
          <>
            <p className="mb-4">
              At Setflix, we&apos;re not just building a streaming platform;
              we&apos;re creating the future of entertainment. We offer a
              dynamic, inclusive work environment where innovation thrives and
              every team member has the opportunity to make a real impact.
            </p>
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Competitive Benefits
                </h3>
                <p className="text-foreground/80">
                  Comprehensive health insurance, flexible PTO, stock options,
                  and professional development opportunities.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Flexible Work
                </h3>
                <p className="text-foreground/80">
                  Work from anywhere with our remote-first policy, flexible
                  hours, and modern collaboration tools.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Growth Opportunities
                </h3>
                <p className="text-foreground/80">
                  Continuous learning, mentorship programs, and clear career
                  progression paths.
                </p>
              </div>
            </div>
          </>
        }
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Open Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {position.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-foreground/70 mb-4">
                  <span>{position.department}</span>
                  <span>•</span>
                  <span>{position.location}</span>
                  <span>•</span>
                  <span>{position.type}</span>
                </div>
                <Link
                  href="/contact"
                  className="text-accent hover:underline font-medium"
                >
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ImageGallery
        query="office culture team"
        count={6}
        title="Life at Setflix"
      />
    </PageLayout>
  );
}
