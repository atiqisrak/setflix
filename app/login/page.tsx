"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to callback URL or home
      const callback = searchParams.get("callback") || "/";
      // Validate callback URL to prevent open redirects
      const isValidCallback = callback.startsWith("/") && !callback.startsWith("//");
      const redirectTo = isValidCallback ? callback : "/";
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    clearError();

    try {
      await login(email, password);
      // Redirect to callback URL or home after successful login
      const callback = searchParams.get("callback") || "/";
      // Validate callback URL to prevent open redirects
      const isValidCallback = callback.startsWith("/") && !callback.startsWith("//");
      const redirectTo = isValidCallback ? callback : "/";
      router.push(redirectTo);
    } catch (err: any) {
      setLocalError(err?.error || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 md:px-8 py-4">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg p-8 md:p-10 border border-border">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Sign In
            </h1>
            <p className="text-foreground/60 mb-8">Welcome back to Setflix</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {displayError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                  {displayError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm">
                New to Setflix?{" "}
                <Link
                  href={`/signup${searchParams.get("callback") ? `?callback=${encodeURIComponent(searchParams.get("callback")!)}` : ""}`}
                  className="text-accent hover:text-accent/80 font-medium transition"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
