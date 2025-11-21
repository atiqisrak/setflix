"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/seo/hero-section";
import ContentSection from "@/components/seo/content-section";
import PageLayout from "@/components/seo/page-layout";
import { Switch } from "@/components/ui/switch";

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions made by you.",
    enabled: true,
    disabled: true,
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    enabled: false,
    disabled: false,
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description:
      "These cookies are used to deliver advertisements that are more relevant to you and your interests.",
    enabled: false,
    disabled: false,
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description:
      "These cookies enable enhanced functionality and personalization, such as remembering your preferences.",
    enabled: false,
    disabled: false,
  },
];

export default function CookiesPage() {
  const [preferences, setPreferences] = useState(
    cookieCategories.reduce(
      (acc, cat) => ({ ...acc, [cat.id]: cat.enabled }),
      {} as Record<string, boolean>
    )
  );

  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setPreferences({ ...preferences, [id]: value });
  };

  const handleSave = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    alert("Cookie preferences saved!");
  };

  return (
    <PageLayout>
      <HeroSection
        title="Cookie Preferences"
        subtitle="Manage your cookie settings"
        query="privacy cookies settings"
      />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ContentSection
            title="About Cookies"
            content={
              <p className="mb-6">
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our site.
              </p>
            }
          />
          <div className="space-y-6">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-foreground/70">{category.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Switch
                      checked={preferences[category.id]}
                      onCheckedChange={(checked) =>
                        handleToggle(category.id, checked)
                      }
                      disabled={category.disabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={() => {
                const allEnabled = cookieCategories.reduce(
                  (acc, cat) => ({ ...acc, [cat.id]: !cat.disabled }),
                  {} as Record<string, boolean>
                );
                setPreferences(allEnabled);
              }}
              className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent/10 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={() => {
                const essentialOnly = cookieCategories.reduce(
                  (acc, cat) => ({ ...acc, [cat.id]: cat.disabled }),
                  {} as Record<string, boolean>
                );
                setPreferences(essentialOnly);
              }}
              className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-accent/10 transition-colors"
            >
              Reject All
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

