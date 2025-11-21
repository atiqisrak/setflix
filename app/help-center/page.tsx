import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";
import Link from "next/link";
import { HelpCircle, Book, MessageSquare, Video } from "lucide-react";

export const metadata: Metadata = generateSEOMetadata({
  title: "Help Center",
  description:
    "Get help with Setflix IPTV. Find answers to common questions, troubleshooting guides, and support resources.",
  path: "/help-center",
});

const helpCategories = [
  {
    icon: HelpCircle,
    title: "Getting Started",
    description: "Learn how to set up and start using Setflix",
    link: "/faq",
  },
  {
    icon: Video,
    title: "Streaming Guide",
    description: "Troubleshoot streaming issues and optimize your experience",
    link: "/faq",
  },
  {
    icon: Book,
    title: "Account Management",
    description: "Manage your account, subscription, and preferences",
    link: "/account",
  },
  {
    icon: MessageSquare,
    title: "Contact Support",
    description: "Get in touch with our support team for assistance",
    link: "/contact",
  },
];

const quickLinks = [
  { title: "How to create an account", href: "/faq" },
  { title: "Troubleshooting playback issues", href: "/faq" },
  { title: "Update payment information", href: "/account" },
  { title: "Change password", href: "/account" },
  { title: "Cancel subscription", href: "/account" },
  { title: "Device compatibility", href: "/faq" },
];

export default function HelpCenterPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Help Center"
        subtitle="Find answers and get the support you need"
        query="customer support help"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={index}
                  href={category.link}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-foreground/70">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <ContentSection
        title="Quick Links"
        imageQuery="help support assistance"
        imagePosition="right"
        content={
          <>
            <p className="mb-6">
              Find quick answers to the most common questions and issues.
            </p>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block text-accent hover:underline py-2"
                >
                  {link.title} →
                </Link>
              ))}
            </div>
          </>
        }
      />
      <ContentSection
        title="Still Need Help?"
        imageQuery="customer service"
        imagePosition="left"
        reverse
        content={
          <>
            <p className="mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help you 24/7.
            </p>
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Live Chat
                </h3>
                <p className="text-foreground/80">
                  Chat with our support team in real-time for immediate
                  assistance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-foreground/80">
                  Send us an email at{" "}
                  <a
                    href="mailto:support@setflix.com"
                    className="text-accent hover:underline"
                  >
                    support@setflix.com
                  </a>{" "}
                  and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-foreground/80">
                  Call us at{" "}
                  <a
                    href="tel:+1-800-SETFLIX"
                    className="text-accent hover:underline"
                  >
                    1-800-SETFLIX
                  </a>{" "}
                  Monday through Friday, 9 AM - 6 PM EST.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </>
        }
      />
    </PageLayout>
  );
}

