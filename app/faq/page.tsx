import type { Metadata } from "next";
import { generateSEOMetadata, generateFAQStructuredData } from "@/lib/seo/metadata";
import HeroSection from "@/components/seo/hero-section";
import FAQAccordion from "@/components/seo/faq-accordion";
import PageLayout from "@/components/seo/page-layout";

export const metadata: Metadata = generateSEOMetadata({
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Setflix IPTV, including account setup, streaming, billing, and technical support.",
  path: "/faq",
});

const faqs = [
  {
    question: "What is Setflix IPTV?",
    answer:
      "Setflix IPTV is a streaming platform that provides live TV channels and on-demand content over the internet. You can watch your favorite shows, movies, and live events on any device, anywhere, anytime.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is easy! Simply click on the 'Sign Up' button on our homepage, enter your email address, create a password, and choose a subscription plan. You'll be streaming in minutes.",
  },
  {
    question: "What devices are supported?",
    answer:
      "Setflix is compatible with a wide range of devices including smart TVs, smartphones, tablets, computers, streaming devices (Roku, Apple TV, Chromecast), and gaming consoles. You can also watch on web browsers.",
  },
  {
    question: "How much does Setflix cost?",
    answer:
      "We offer flexible subscription plans to suit your needs. Plans start at $9.99/month for basic access, with premium plans available for enhanced features and content. Check our pricing page for detailed information.",
  },
  {
    question: "Can I watch offline?",
    answer:
      "Yes! With our premium plans, you can download select content to watch offline on your mobile devices. This is perfect for travel or when you don't have internet access.",
  },
  {
    question: "How many devices can I use simultaneously?",
    answer:
      "The number of simultaneous streams depends on your subscription plan. Basic plans allow 1-2 streams, while premium plans support up to 4 simultaneous streams on different devices.",
  },
  {
    question: "What internet speed do I need?",
    answer:
      "For standard definition (SD) streaming, we recommend at least 3 Mbps. For high definition (HD), 5 Mbps is recommended. For 4K Ultra HD streaming, you'll need at least 25 Mbps for the best experience.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from your account settings. Go to 'My Account' > 'Subscription' and click 'Cancel Subscription'. Your access will continue until the end of your current billing period.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! We offer a 7-day free trial for new users. No credit card required to start your trial. You can explore all features and content during this period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital payment methods. All payments are processed securely through encrypted connections.",
  },
  {
    question: "How do I troubleshoot playback issues?",
    answer:
      "If you're experiencing playback issues, try these steps: 1) Check your internet connection speed, 2) Restart your device and app, 3) Clear your browser cache, 4) Update the app to the latest version, 5) Contact support if issues persist.",
  },
  {
    question: "Can I share my account with family?",
    answer:
      "Yes, you can share your account with family members. However, the number of simultaneous streams depends on your subscription plan. We recommend choosing a plan that matches your household's viewing needs.",
  },
];

const faqSchema = generateFAQStructuredData(faqs);

export default function FAQPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Setflix"
        query="question help support"
      />
      <FAQAccordion items={faqs} />
    </PageLayout>
  );
}

