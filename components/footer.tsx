"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Investor Relations", href: "/investor-relations" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help-center" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Speed Test", href: "/speed-test" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Preferences", href: "/cookies" },
      { label: "Legal Notices", href: "/legal" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "My List", href: "/my-list" },
      { label: "Ways to Watch", href: "/ways-to-watch" },
      { label: "Corporate Info", href: "/corporate-info" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <footer className="relative bg-gradient-to-b from-background via-background/95 to-background border-t border-border/50 mt-20 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16 max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative">
                <Image
                  src="/logo-setflix.svg"
                  alt="Setflix"
                  width={120}
                  height={40}
                  className="h-auto w-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </div>
            </Link>
            <p className="text-foreground/70 text-sm md:text-base mb-6 leading-relaxed max-w-md">
              Your ultimate streaming platform for live TV and on-demand
              entertainment. Watch anywhere, anytime.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+1-800-SETFLIX"
                className="flex items-center gap-3 text-foreground/70 hover:text-accent transition-colors group text-sm md:text-base"
              >
                <div className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/10 transition-all">
                  <Phone
                    size={18}
                    className="text-foreground/60 group-hover:text-accent"
                  />
                </div>
                <span className="font-medium">1-800-SETFLIX</span>
              </a>
              <a
                href="mailto:support@setflix.com"
                className="flex items-center gap-3 text-foreground/70 hover:text-accent transition-colors group text-sm md:text-base"
              >
                <div className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/10 transition-all">
                  <Mail
                    size={18}
                    className="text-foreground/60 group-hover:text-accent"
                  />
                </div>
                <span className="font-medium">support@setflix.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon
                      size={18}
                      className="text-foreground/60 group-hover:text-accent transition-colors"
                    />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {footerLinks.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <h3 className="text-foreground font-semibold mb-4 text-sm md:text-base">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors text-sm"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Language Selector */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center group-hover:border-accent/50 transition-all">
                <Globe
                  className="text-foreground/60 group-hover:text-accent transition-colors"
                  size={18}
                />
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-card border border-border/50 text-foreground px-4 py-2.5 pr-10 rounded-lg appearance-none cursor-pointer hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm md:text-base font-medium"
                aria-label="Select language"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Italian">Italiano</option>
                <option value="Portuguese">Português</option>
              </select>
              <ChevronRight
                size={16}
                className="absolute right-3 text-foreground/40 pointer-events-none rotate-90"
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-foreground/60 text-xs sm:text-sm">
            <p className="mb-1">
              &copy; {new Date().getFullYear()} Setflix IPTV. All rights
              reserved.
            </p>
            <p className="text-foreground/40">
              Made with <span className="text-red-500">♥</span> for streaming
              enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
