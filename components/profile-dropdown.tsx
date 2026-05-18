"use client";

import { useRef, useEffect } from "react";
import { SlidersHorizontal, Heart, ListVideo, Tv } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { href: "/my-list", label: "My List", icon: Heart },
  { href: "/playlist", label: "My Playlist", icon: ListVideo },
  { href: "/player", label: "Stream Player", icon: Tv },
  { href: "/settings", label: "Settings", icon: SlidersHorizontal },
];

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeVariants}
          className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded shadow-lg z-50"
        >
          <div className="py-2">
            {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
