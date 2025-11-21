import type { Metadata } from "next";

interface SEOOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: SEOOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://setflix.com";
  const fullUrl = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | Setflix IPTV`,
    description,
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      title: `${title} | Setflix IPTV`,
      description,
      url: fullUrl,
      siteName: "Setflix IPTV",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Setflix IPTV`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Setflix IPTV",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://setflix.com",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "https://setflix.com"}/logo-setflix.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-SETFLIX",
      contactType: "customer service",
      email: "support@setflix.com",
    },
    sameAs: [
      "https://facebook.com/setflix",
      "https://twitter.com/setflix",
      "https://instagram.com/setflix",
      "https://youtube.com/setflix",
      "https://linkedin.com/company/setflix",
    ],
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

