"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
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
              Sign Up
            </h1>
            <p className="text-foreground/60 mb-8">
              Start your streaming journey today
            </p>

            <div className="space-y-6">
              <p className="text-foreground/80 text-sm">
                Create your account with Auth0 to start streaming
              </p>

              <a href="/api/auth/login?screen_hint=signup">
                <Button
                  type="button"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold"
                >
                  Sign Up with Auth0
                </Button>
              </a>

              <div className="flex items-start gap-2 text-sm pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-input bg-input text-accent focus:ring-accent focus:ring-offset-0"
                />
                <label htmlFor="terms" className="text-foreground/80 cursor-pointer">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-accent hover:text-accent/80 transition"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-accent hover:text-accent/80 transition"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent/80 font-medium transition"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
