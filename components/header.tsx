"use client";

import { useState, useEffect } from "react";
import { Search, Bell, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import ProfileDropdown from "@/components/profile-dropdown";
import NotificationsDropdown from "@/components/notifications-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/search-context";

export default function Header() {
  const router = useRouter();
  const { setSearchQuery, addRecentSearch } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "All Channels", href: "/channels" },
    { label: "Browse", href: "/browse" },
    { label: "My List", href: "/my-list" },
  ];

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isScrolled ? "#000000" : "rgba(0, 0, 0, 0)",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black/80 to-transparent"
    >
      <div className="px-4 md:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex gap-6 text-foreground/80 text-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition duration-200
              hover:scale-110"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 300 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="absolute right-0 top-0"
                >
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search channels..."
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => setIsSearchOpen(false), 200);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const query = searchInput.trim();
                        if (query) {
                          setSearchQuery(query);
                          addRecentSearch(query);
                          router.push(`/search?q=${encodeURIComponent(query)}`);
                          setIsSearchOpen(false);
                          setSearchInput("");
                        }
                      }
                    }}
                    className="bg-background/95 text-foreground px-4 py-2 rounded border border-border/50 focus:outline-none focus:ring-2 focus:ring-accent w-full text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                if (!isSearchOpen) {
                  setIsSearchOpen(true);
                } else {
                  const query = searchInput.trim();
                  if (query) {
                    setSearchQuery(query);
                    addRecentSearch(query);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsSearchOpen(false);
                    setSearchInput("");
                  } else {
                    setIsSearchOpen(false);
                  }
                }
              }}
              className="p-2 hover:bg-foreground/10 rounded transition"
            >
              <Search size={18} className="text-foreground" />
            </button>
          </div>

          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 hover:bg-foreground/10 rounded transition relative"
            >
              <Bell size={18} className="text-foreground" />
            </button>
            <NotificationsDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="p-2 hover:bg-foreground/10 rounded transition"
            >
              <User size={18} className="text-foreground" />
            </button>
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-foreground/10 rounded transition"
          >
            {isMobileMenuOpen ? (
              <X size={18} className="text-foreground" />
            ) : (
              <Menu size={18} className="text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 border-t border-border px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-foreground/80 hover:text-foreground transition py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </motion.header>
  );
}
