import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description:
    "Read Setflix IPTV's Privacy Policy to understand how we collect, use, and protect your personal information. GDPR and CCPA compliant.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Privacy Policy"
        subtitle="Your privacy is important to us"
        query="privacy security protection"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none text-foreground/80">
            <ContentSection
              title="1. Information We Collect"
              content={
                <>
                  <p className="mb-4">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Account registration information (name, email, password)</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                    <li>Profile information and preferences</li>
                    <li>Communications with our support team</li>
                  </ul>
                  <p className="mb-4">We also automatically collect certain information:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Device information and identifiers</li>
                    <li>Usage data and viewing history</li>
                    <li>IP address and location data</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="2. How We Use Your Information"
              content={
                <>
                  <p className="mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide, maintain, and improve our Service</li>
                    <li>Process transactions and send related information</li>
                    <li>Send technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Personalize your experience and content recommendations</li>
                    <li>Monitor and analyze usage patterns</li>
                    <li>Detect, prevent, and address technical issues</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="3. Information Sharing and Disclosure"
              content={
                <>
                  <p className="mb-4">
                    We do not sell your personal information. We may share your
                    information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>With service providers who assist in operating our Service</li>
                    <li>To comply with legal obligations or protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your consent or at your direction</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="4. Data Security"
              content={
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the Internet is 100% secure.
                </p>
              }
            />
            <ContentSection
              title="5. Your Rights and Choices"
              content={
                <>
                  <p className="mb-4">Depending on your location, you may have the right to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Access and receive a copy of your personal data</li>
                    <li>Rectify inaccurate or incomplete data</li>
                    <li>Request deletion of your personal data</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us at{" "}
                    <a
                      href="mailto:privacy@setflix.com"
                      className="text-accent hover:underline"
                    >
                      privacy@setflix.com
                    </a>
                    .
                  </p>
                </>
              }
            />
            <ContentSection
              title="6. Cookies and Tracking Technologies"
              content={
                <p>
                  We use cookies and similar technologies to collect information
                  and enhance your experience. You can control cookies through
                  your browser settings. For more information, please visit our{" "}
                  <a href="/cookies" className="text-accent hover:underline">
                    Cookie Preferences
                  </a>{" "}
                  page.
                </p>
              }
            />
            <ContentSection
              title="7. Children's Privacy"
              content={
                <p>
                  Our Service is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you believe we have collected
                  information from a child under 13, please contact us
                  immediately.
                </p>
              }
            />
            <ContentSection
              title="8. International Data Transfers"
              content={
                <p>
                  Your information may be transferred to and processed in
                  countries other than your country of residence. We ensure
                  appropriate safeguards are in place to protect your data in
                  accordance with this Privacy Policy.
                </p>
              }
            />
            <ContentSection
              title="9. Changes to This Privacy Policy"
              content={
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date.
                </p>
              }
            />
            <ContentSection
              title="10. Contact Us"
              content={
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at{" "}
                  <a
                    href="mailto:privacy@setflix.com"
                    className="text-accent hover:underline"
                  >
                    privacy@setflix.com
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

