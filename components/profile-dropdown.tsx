"use client";

import { useRef, useEffect } from "react";
import { Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { useFamily } from "@/contexts/family-context";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchProfile: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  onSwitchProfile,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentProfile } = useFamily();

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
            {currentProfile && (
              <div className="px-4 py-2 border-b border-border flex items-center gap-2">
                {currentProfile.avatarUrl ? (
                  <img
                    src={currentProfile.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                    <User size={16} className="text-accent-foreground" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground truncate">
                  {currentProfile.name}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                onSwitchProfile();
                onClose();
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition w-full text-left"
            >
              <Users size={18} />
              Switch profile
            </button>
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition"
            >
              <Settings size={18} />
              Manage profiles
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
