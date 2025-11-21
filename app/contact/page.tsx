import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContactForm from "@/components/seo/contact-form";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Setflix IPTV support team. We're here to help with any questions, technical issues, or feedback.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Contact Us"
        subtitle="We're here to help. Reach out anytime."
        query="customer service contact"
      />
      <ContactForm />
    </PageLayout>
  );
}

