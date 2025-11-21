import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms of Use",
  description:
    "Read Setflix IPTV's Terms of Use. Understand the terms and conditions for using our streaming platform and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Terms of Use"
        subtitle="Please read these terms carefully before using our service"
        query="legal documents contract"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none text-foreground/80">
            <ContentSection
              title="1. Acceptance of Terms"
              content={
                <p>
                  By accessing and using Setflix IPTV (&quot;Service&quot;), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              }
            />
            <ContentSection
              title="2. Service Description"
              content={
                <p>
                  Setflix provides an IPTV streaming platform that offers live TV
                  channels and on-demand content. We reserve the right to modify,
                  suspend, or discontinue any aspect of the Service at any time.
                </p>
              }
            />
            <ContentSection
              title="3. User Accounts"
              content={
                <>
                  <p className="mb-4">
                    To access certain features of the Service, you must register
                    for an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain and update your account information</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="4. Subscription and Billing"
              content={
                <>
                  <p className="mb-4">
                    Subscription fees are billed in advance on a monthly or
                    annual basis. You agree to pay all fees associated with your
                    subscription. We reserve the right to change our pricing with
                    30 days notice.
                  </p>
                  <p>
                    You may cancel your subscription at any time. Cancellation
                    will take effect at the end of your current billing period.
                  </p>
                </>
              }
            />
            <ContentSection
              title="5. Acceptable Use"
              content={
                <>
                  <p className="mb-4">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Share your account credentials with others</li>
                    <li>Use the Service for any illegal purpose</li>
                    <li>Attempt to reverse engineer or hack the Service</li>
                    <li>Distribute content obtained through the Service</li>
                    <li>Interfere with or disrupt the Service</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="6. Intellectual Property"
              content={
                <p>
                  All content available through the Service, including but not
                  limited to text, graphics, logos, and software, is the
                  property of Setflix or its content suppliers and is protected
                  by copyright and other intellectual property laws.
                </p>
              }
            />
            <ContentSection
              title="7. Limitation of Liability"
              content={
                <p>
                  Setflix shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages resulting from your
                  use or inability to use the Service.
                </p>
              }
            />
            <ContentSection
              title="8. Changes to Terms"
              content={
                <p>
                  We reserve the right to modify these terms at any time. We will
                  notify users of any material changes via email or through the
                  Service. Your continued use of the Service after such
                  modifications constitutes acceptance of the updated terms.
                </p>
              }
            />
            <ContentSection
              title="9. Contact Information"
              content={
                <p>
                  If you have any questions about these Terms of Use, please
                  contact us at{" "}
                  <a
                    href="mailto:legal@setflix.com"
                    className="text-accent hover:underline"
                  >
                    legal@setflix.com
                  </a>
                  .
                </p>
              }
            />
            <div className="mt-8 pt-8 border-t border-border text-sm text-foreground/60">
              <p>Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

