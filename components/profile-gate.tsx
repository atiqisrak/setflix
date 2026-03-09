"use client";

import { usePathname } from "next/navigation";
import { useFamily } from "@/contexts/family-context";
import UserProfiles from "@/components/user-profiles";

export default function ProfileGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentProfile, isLoading } = useFamily();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    );
  }

  // Allow /settings (device settings) without a selected profile
  if (pathname === "/settings") {
    return <>{children}</>;
  }

  // No profile selected: show Who's watching until they select or go to Manage profiles
  if (!currentProfile) {
    return (
      <UserProfiles
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  return <>{children}</>;
}
