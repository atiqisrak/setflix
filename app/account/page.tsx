"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Settings } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const isAuthenticated = false;
  const isLoading = false;
  const user = null;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Account
          </h1>

          {/* Profile Section */}
          <div className="bg-card rounded-lg p-6 md:p-8 mb-8 border border-border">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                <User size={40} className="text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">User</h2>
                <p className="text-foreground/60"></p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-foreground/80 flex items-center gap-2">
                  <Mail size={18} />
                  Email Address
                </span>
                <span className="text-foreground">N/A</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-foreground/80 flex items-center gap-2">
                  <Settings size={18} />
                  Subscription Plan
                </span>
                <span className="text-accent font-semibold">Premium</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-foreground/80">Renewal Date</span>
                <span className="text-foreground">Dec 20, 2025</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded transition">
              Edit Profile
            </Button>
            <Button className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded transition">
              Change Password
            </Button>
            <Link href="/login" className="block">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded transition flex items-center justify-center gap-2">
                <LogOut size={18} />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
