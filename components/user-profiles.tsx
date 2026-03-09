"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants } from "@/lib/animations";
import { User, Plus, X } from "lucide-react";
import { useFamily } from "@/contexts/family-context";
import type { FamilyProfile } from "@/contexts/family-context";

interface UserProfilesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile?: (profile: FamilyProfile) => void;
}

export default function UserProfiles({
  isOpen,
  onClose,
  onSelectProfile,
}: UserProfilesProps) {
  const { profiles, setCurrentProfile, addProfile } = useFamily();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const handleSelect = (profile: FamilyProfile) => {
    setCurrentProfile(profile.id);
    onSelectProfile?.(profile);
    setTimeout(() => onClose(), 300);
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const profile = addProfile({
      name,
      avatarUrl: newAvatarUrl.trim() || undefined,
      isKids: false,
    });
    setNewName("");
    setNewAvatarUrl("");
    setShowAddForm(false);
    handleSelect(profile);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
              Who&apos;s watching?
            </h2>
          </div>

          {showAddForm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto bg-card rounded-lg border border-border p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">Add profile</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName("");
                    setNewAvatarUrl("");
                  }}
                  className="p-1 hover:bg-foreground/10 rounded"
                  aria-label="Close"
                >
                  <X size={20} className="text-foreground" />
                </button>
              </div>
              <form onSubmit={handleAddProfile} className="space-y-4">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-foreground/80 mb-1">
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter name"
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="profile-avatar" className="block text-sm font-medium text-foreground/80 mb-1">
                    Avatar URL (optional)
                  </label>
                  <input
                    id="profile-avatar"
                    type="url"
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-accent-foreground rounded font-medium hover:bg-accent/90"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-border text-foreground rounded hover:bg-foreground/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
              {profiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  onClick={() => handleSelect(profile)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded bg-accent flex items-center justify-center group-hover:ring-4 ring-accent transition overflow-hidden">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
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
                onClick={() => setShowAddForm(true)}
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
          )}

          <div className="mt-12 text-center">
            <Link
              href="/settings"
              onClick={onClose}
              className="inline-block px-6 py-2 border border-foreground/30 hover:border-foreground text-foreground/60 hover:text-foreground transition rounded"
            >
              Manage Profiles
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
