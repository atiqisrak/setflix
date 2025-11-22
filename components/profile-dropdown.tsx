"use client";

import { useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Settings, User, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { useAuth } from "@/contexts/auth-context";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
}: ProfileDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

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
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-foreground/60 text-center">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <>
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
                <button
                  onClick={async () => {
                    onClose();
                    await logout();
                    router.push("/");
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition w-full text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href={`/login${pathname && pathname !== "/" ? `?callback=${encodeURIComponent(pathname)}` : ""}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-foreground/10 transition w-full text-left"
              >
                <User size={18} />
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
