"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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

            <div className="space-y-6">
              <p className="text-foreground/80 text-sm">Sign in to continue</p>

              <Button
                type="button"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold"
              >
                Sign In
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm">
                New to Setflix?{" "}
                <Link
                  href="/signup"
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
