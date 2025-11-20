"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { User, Plus } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  avatar?: string;
}

const PROFILES: Profile[] = [
  { id: "1", name: "User 1" },
  { id: "2", name: "User 2" },
  { id: "3", name: "Kids" },
];

interface UserProfilesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile?: (profile: Profile) => void;
}

export default function UserProfiles({
  isOpen,
  onClose,
  onSelectProfile,
}: UserProfilesProps) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    onSelectProfile?.(profile);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeVariants}
            className="max-w-4xl w-full px-4"
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground text-center mb-4">
                Who's watching?
              </h2>
            </div>

            <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
              {PROFILES.map((profile) => (
                <motion.button
                  key={profile.id}
                  onClick={() => handleSelect(profile)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded bg-accent flex items-center justify-center group-hover:ring-4 ring-accent transition">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full rounded"
                      />
                    ) : (
                      <User size={48} className="text-accent-foreground" />
                    )}
                  </div>
                  <span className="text-foreground/60 group-hover:text-foreground transition text-sm md:text-base">
                    {profile.name}
                  </span>
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded bg-card border-2 border-dashed border-foreground/30 flex items-center justify-center group-hover:border-foreground transition">
                  <Plus
                    size={32}
                    className="text-foreground/60 group-hover:text-foreground"
                  />
                </div>
                <span className="text-foreground/60 group-hover:text-foreground transition text-sm md:text-base">
                  Add Profile
                </span>
              </motion.button>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-foreground/30 hover:border-foreground text-foreground/60 hover:text-foreground transition rounded"
              >
                Manage Profiles
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
