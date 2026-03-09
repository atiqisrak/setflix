"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function SignupForm() {
  const router = useRouter();

  // Auth disabled: redirect to home when visiting signup page
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground/60">Redirecting...</div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
