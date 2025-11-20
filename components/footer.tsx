"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="px-4 md:px-8 py-12 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-foreground/60 text-sm mb-4">
            Questions? Call{" "}
            <Link href="tel:+1-800-SETFLIX" className="hover:underline">
              1-800-SETFLIX
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <ul className="space-y-3 text-foreground/60 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Speed Test
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-foreground/60 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Legal Notices
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-foreground/60 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Ways to Watch
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Corporate Information
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Only on Setflix
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-foreground/60 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Media Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative inline-block">
            <Globe
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60"
              size={16}
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-card border border-border text-foreground px-10 py-2 pr-8 rounded appearance-none cursor-pointer hover:border-foreground/50 transition focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="text-foreground/60 text-sm">
          <p>&copy; 2025 Setflix IPTV. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
