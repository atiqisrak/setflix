import type React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SearchProvider } from "@/contexts/search-context";
import { ProviderProvider } from "@/contexts/provider-context";
import { AuthProvider } from "@/contexts/auth-context";
import { FamilyProvider } from "@/contexts/family-context";
import ProfileGate from "@/components/profile-gate";
import { QueryProvider } from "@/lib/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setflix - Stream Your Favorite Content",
  description:
    "Setflix IPTV - Your ultimate streaming platform for live TV and on-demand entertainment",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-setflix.png",
        sizes: "32x32",
      },
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        url: "/favicon/favicon.ico",
      },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e27",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <FamilyProvider>
              <ProviderProvider>
                <SearchProvider>
                  <ProfileGate>{children}</ProfileGate>
                </SearchProvider>
              </ProviderProvider>
            </FamilyProvider>
          </AuthProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
