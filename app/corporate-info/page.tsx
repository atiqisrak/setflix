import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import ImageGallery from "@/components/seo/image-gallery";
import PageLayout from "@/components/seo/page-layout";
import Link from "next/link";

export const metadata: Metadata = generateSEOMetadata({
  title: "Corporate Information",
  description:
    "Corporate information about Setflix IPTV including company details, leadership, offices, and business information.",
  path: "/corporate-info",
});

const leadership = [
  {
    name: "John Smith",
    role: "Chief Executive Officer",
    bio: "20+ years of experience in streaming and media technology",
  },
  {
    name: "Sarah Johnson",
    role: "Chief Technology Officer",
    bio: "Expert in IPTV infrastructure and scalable systems",
  },
  {
    name: "Michael Chen",
    role: "Chief Content Officer",
    bio: "Former executive at major entertainment companies",
  },
];

const offices = [
  {
    city: "San Francisco",
    country: "United States",
    address: "123 Streaming Street, San Francisco, CA 94102",
  },
  {
    city: "New York",
    country: "United States",
    address: "456 Media Avenue, New York, NY 10001",
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "789 Entertainment Road, London, UK",
  },
];

export default function CorporateInfoPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Corporate Information"
        subtitle="Learn more about Setflix IPTV"
        query="corporate business office"
      />
      <ContentSection
        title="Company Overview"
        imageQuery="corporate business"
        imagePosition="right"
        content={
          <>
            <p className="mb-4">
              Setflix IPTV is a leading streaming platform that provides live TV
              and on-demand content to millions of users worldwide. Founded with
              a mission to make premium entertainment accessible to everyone, we
              continue to innovate and expand our services.
            </p>
            <p className="mb-4">
              Our company is headquartered in San Francisco, California, with
              offices in major cities around the world. We employ a diverse team
              of engineers, designers, content curators, and customer service
              professionals dedicated to delivering exceptional streaming
              experiences.
            </p>
            <p>
              Setflix is committed to transparency, innovation, and providing
              value to our customers, partners, and stakeholders.
            </p>
          </>
        }
      />
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">
                    {leader.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {leader.name}
                </h3>
                <p className="text-accent mb-2">{leader.role}</p>
                <p className="text-sm text-foreground/70">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContentSection
        title="Global Offices"
        imageQuery="office building corporate"
        imagePosition="left"
        reverse
        content={
          <>
            <p className="mb-6">
              Setflix operates offices in key locations around the world to
              serve our global customer base.
            </p>
            <div className="space-y-4">
              {offices.map((office, index) => (
                <div key={index} className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-foreground mb-1">
                    {office.city}, {office.country}
                  </h3>
                  <p className="text-foreground/80">{office.address}</p>
                </div>
              ))}
            </div>
          </>
        }
      />
      <ContentSection
        title="Business Information"
        imageQuery="business documents"
        imagePosition="right"
        content={
          <>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Company Registration
                </h3>
                <p className="text-foreground/80">
                  Setflix IPTV Inc. is registered in Delaware, United States.
                  Registration Number: SET-2024-001234.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Tax Information
                </h3>
                <p className="text-foreground/80">
                  Federal Tax ID: 12-3456789. For tax-related inquiries, please
                  contact our finance department.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Related Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-accent hover:underline">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="text-accent hover:underline">
                      Press & Media
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/investor-relations"
                      className="text-accent hover:underline"
                    >
                      Investor Relations
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-accent hover:underline">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </>
        }
      />
      <ImageGallery
        query="corporate office team"
        count={6}
        title="Our Offices"
      />
    </PageLayout>
  );
}

