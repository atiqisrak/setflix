"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings");
  }, [router]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground/60">Redirecting to settings...</div>
    </div>
  );
}
