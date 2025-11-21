import type React from "react";
import type { Metadata, Viewport } from "next";
import { Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SearchProvider } from "@/contexts/search-context";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Auth0Provider } from "@/lib/providers/auth0-provider";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

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
      <body
        className={`${bebasNeue.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Auth0Provider>
        <QueryProvider>
          <SearchProvider>{children}</SearchProvider>
        </QueryProvider>
        </Auth0Provider>
        <Analytics />
      </body>
    </html>
  );
}
