"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, User, LogOut, ChevronUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { useAuth } from "@/hooks/use-auth";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <div className="px-4 py-2 text-sm font-semibold text-foreground border-b border-border">
                    {user.name}
                  </div>
                )}
                {user?.email && (
                  <div className="px-4 py-2 text-xs text-foreground/60 border-b border-border">
                    {user.email}
                  </div>
                )}
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition"
            >
              <User size={18} />
              Account
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition"
            >
              <Settings size={18} />
              Settings
            </Link>
            <div className="border-t border-border my-2"></div>
                <a
                  href="/api/auth/logout"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition w-full text-left"
            >
              <LogOut size={18} />
              Sign Out
                </a>
              </>
            ) : (
              <a
                href="/api/auth/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition w-full text-left"
              >
                <User size={18} />
                Sign In
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
