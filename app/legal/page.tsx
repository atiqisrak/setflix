import type { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";
import Link from "next/link";

export const metadata: Metadata = generateSEOMetadata({
  title: "Legal Notices",
  description:
    "Legal notices, copyright information, and corporate legal details for Setflix IPTV.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <PageLayout>
      <HeroSection
        title="Legal Notices"
        subtitle="Important legal information and notices"
        query="legal documents law"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none text-foreground/80">
            <ContentSection
              title="Copyright Notice"
              content={
                <p>
                  © {new Date().getFullYear()} Setflix IPTV. All rights
                  reserved. All content, features, and functionality of this
                  website, including but not limited to text, graphics, logos,
                  icons, images, audio clips, digital downloads, and software,
                  are the property of Setflix or its content suppliers and are
                  protected by international copyright laws.
                </p>
              }
            />
            <ContentSection
              title="Trademarks"
              content={
                <p>
                  Setflix, the Setflix logo, and all related names, logos,
                  product and service names, designs, and slogans are trademarks
                  of Setflix or its affiliates or licensors. You must not use
                  such marks without the prior written permission of Setflix.
                </p>
              }
            />
            <ContentSection
              title="DMCA Copyright Policy"
              content={
                <>
                  <p className="mb-4">
                    Setflix respects the intellectual property rights of others
                    and expects its users to do the same. In accordance with the
                    Digital Millennium Copyright Act (DMCA), we will respond to
                    notices of alleged copyright infringement.
                  </p>
                  <p className="mb-4">
                    If you believe that your copyrighted work has been copied in
                    a way that constitutes copyright infringement, please provide
                    our Copyright Agent with the following information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>A physical or electronic signature of the copyright owner</li>
                    <li>Identification of the copyrighted work claimed to have been infringed</li>
                    <li>Identification of the material that is claimed to be infringing</li>
                    <li>Your contact information</li>
                    <li>A statement of good faith belief that the use is not authorized</li>
                    <li>A statement that the information is accurate and you are authorized to act</li>
                  </ul>
                  <p>
                    Send notices to:{" "}
                    <a
                      href="mailto:copyright@setflix.com"
                      className="text-accent hover:underline"
                    >
                      copyright@setflix.com
                    </a>
                  </p>
                </>
              }
            />
            <ContentSection
              title="Disclaimers"
              content={
                <>
                  <p className="mb-4">
                    THE INFORMATION ON THIS WEBSITE IS PROVIDED ON AN &quot;AS
                    IS&quot; BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, THIS
                    COMPANY:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Excludes all representations and warranties relating to this website</li>
                    <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
                    <li>Does not warrant that the website will be available at all times or error-free</li>
                  </ul>
                </>
              }
            />
            <ContentSection
              title="Governing Law"
              content={
                <p>
                  These legal notices and any disputes arising out of or related
                  to the Service shall be governed by and construed in
                  accordance with the laws of the State of California, without
                  regard to its conflict of law provisions.
                </p>
              }
            />
            <ContentSection
              title="Related Legal Documents"
              content={
                <div className="space-y-2">
                  <p className="mb-4">For more information, please review:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <Link href="/terms" className="text-accent hover:underline">
                        Terms of Use
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-accent hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/cookies" className="text-accent hover:underline">
                        Cookie Preferences
                      </Link>
                    </li>
                  </ul>
                </div>
              }
            />
            <ContentSection
              title="Contact Legal Department"
              content={
                <p>
                  For legal inquiries, please contact:{" "}
                  <a
                    href="mailto:legal@setflix.com"
                    className="text-accent hover:underline"
                  >
                    legal@setflix.com
                  </a>
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

