"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({
  isOpen,
  onClose,
}: NotificationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const notifications = [
    { id: 1, text: "New episode available", time: "2 hours ago" },
    { id: 2, text: "Your list was updated", time: "1 day ago" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeVariants}
          className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
          </div>
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-foreground/10 transition cursor-pointer"
                >
                  <p className="text-sm text-foreground">{notification.text}</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    {notification.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-foreground/60 text-sm">
                No notifications
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
