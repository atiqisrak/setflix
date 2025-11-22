"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Settings, Crown, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, isPremium, isAdmin } = useAuth();
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with callback URL to return to account page
      router.push("/login?callback=/account");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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

  const userRole = user?.role || 'free_subscriber';
  const isFreeUser = userRole === 'free_subscriber';
  const planName = isAdmin ? 'Admin' : isPremium ? 'Setflix+' : 'Free';
  const planColor = isAdmin ? 'text-purple-500' : isPremium ? 'text-accent' : 'text-foreground/60';

  const freeBenefits = [
    'Access to 1 provider',
    'Basic channel selection',
    'Standard streaming quality',
    'Limited features',
  ];

  const premiumBenefits = [
    'Access to all providers',
    'Unlimited channels',
    'HD & 4K streaming quality',
    'Priority support',
    'Advanced features',
    'Ad-free experience',
  ];

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
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.email}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-accent-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.name || "User"}
                </h2>
                <p className="text-foreground/60">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-foreground/80 flex items-center gap-2">
                  <Mail size={18} />
                  Email Address
                </span>
                <span className="text-foreground">{user?.email || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-foreground/80 flex items-center gap-2">
                  <Settings size={18} />
                  Subscription Plan
                </span>
                <div className="flex items-center gap-2">
                  {isPremium && <Crown size={18} className="text-accent" />}
                  <span className={`font-semibold ${planColor}`}>{planName}</span>
                </div>
              </div>

              {/* Current Plan Benefits */}
              <div className="py-3 border-b border-border/50">
                <span className="text-foreground/80 block mb-3">What You're Getting:</span>
                <ul className="space-y-2">
                  {(isPremium ? premiumBenefits : freeBenefits).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-foreground/70 text-sm">
                      <Check size={16} className="text-accent flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isFreeUser && (
                <div className="pt-4">
                  <Button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2"
                  >
                    {showComparison ? (
                      <>
                        <ChevronUp size={18} />
                        Hide Setflix+ Comparison
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} />
                        View Setflix+ Benefits
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Setflix+ Comparison Table */}
          {isFreeUser && (
            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card rounded-lg p-6 md:p-8 mb-8 border border-border overflow-hidden"
                >
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Crown size={24} className="text-accent" />
                    Setflix+ vs Free Comparison
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 text-foreground/80 font-semibold">Feature</th>
                          <th className="text-center py-3 px-4 text-foreground/60 font-semibold">Free</th>
                          <th className="text-center py-3 px-4 text-accent font-semibold">Setflix+</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Providers Access</td>
                          <td className="py-3 px-4 text-center text-foreground/60">1 Provider</td>
                          <td className="py-3 px-4 text-center text-accent">All Providers</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Channels</td>
                          <td className="py-3 px-4 text-center text-foreground/60">Limited</td>
                          <td className="py-3 px-4 text-center text-accent">Unlimited</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Streaming Quality</td>
                          <td className="py-3 px-4 text-center text-foreground/60">Standard</td>
                          <td className="py-3 px-4 text-center text-accent">HD & 4K</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Support</td>
                          <td className="py-3 px-4 text-center text-foreground/60">Standard</td>
                          <td className="py-3 px-4 text-center text-accent">Priority</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Ads</td>
                          <td className="py-3 px-4 text-center text-foreground/60">With Ads</td>
                          <td className="py-3 px-4 text-center text-accent">Ad-Free</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-foreground">Advanced Features</td>
                          <td className="py-3 px-4 text-center text-foreground/60">Limited</td>
                          <td className="py-3 px-4 text-center text-accent">Full Access</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-semibold flex items-center justify-center gap-2"
                      onClick={() => {
                        // TODO: Implement upgrade flow
                        alert('Upgrade functionality coming soon!');
                      }}
                    >
                      <Crown size={24} />
                      Upgrade to Setflix+
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Upgrade Button for Free Users */}
          {isFreeUser && !showComparison && (
            <div className="bg-card rounded-lg p-6 md:p-8 mb-8 border border-accent/50 bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Crown size={24} className="text-accent" />
                    Unlock Setflix+ Features
                  </h3>
                  <p className="text-foreground/70">
                    Get access to all providers, unlimited channels, and Setflix+ features
                  </p>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 font-semibold flex items-center gap-2 whitespace-nowrap"
                  onClick={() => {
                    // TODO: Implement upgrade flow
                    alert('Upgrade functionality coming soon!');
                  }}
                >
                  <Crown size={20} />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/account/edit" className="block">
              <Button className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded transition">
                Edit Profile
              </Button>
            </Link>
            <Link href="/account/password" className="block">
              <Button className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded transition">
                Change Password
              </Button>
            </Link>
            <Link href="/account/settings" className="block">
              <Button className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded transition">
                Settings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded transition flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
