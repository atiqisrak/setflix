"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { userApi } from "@/lib/api/user";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?callback=/account/settings");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
    }
  }, [isAuthenticated]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getPreferences();
      setPreferences(response.preferences || {});
    } catch (err: any) {
      setError(err?.error || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await userApi.updatePreferences({
        themePreference: preferences?.themePreference || "dark",
        autoplayNext: preferences?.autoplayNext ?? true,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err?.error || "Failed to update settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 px-4 md:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center text-foreground/60">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 md:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition"
          >
            <ArrowLeft size={18} />
            Back to Account
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Settings
          </h1>

          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-red-500/10 border border-green-500/20 text-green-500 text-sm p-3 rounded-md">
                  Settings updated successfully!
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={
                          (preferences?.themePreference || "dark") === "dark"
                        }
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            themePreference: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-accent"
                        disabled={isSubmitting}
                      />
                      <span className="text-foreground">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={preferences?.themePreference === "light"}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            themePreference: e.target.value,
                          })
                        }
                        className="w-4 h-4 text-accent"
                        disabled={isSubmitting}
                      />
                      <span className="text-foreground">Light</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences?.autoplayNext ?? true}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          autoplayNext: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-input bg-input text-accent focus:ring-accent"
                      disabled={isSubmitting}
                    />
                    <span className="text-foreground">
                      Autoplay Next Episode
                    </span>
                  </label>
                  <p className="text-sm text-foreground/60 ml-7">
                    Automatically play the next episode when the current one
                    ends
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/account")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
