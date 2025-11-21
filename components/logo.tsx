"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({
  className = "",
  width = 120,
  height = 40,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Image
        src="/logo-setflix.svg"
        alt="Setflix"
        width={width}
        height={height}
        className="h-8 w-auto md:h-10 object-contain"
        priority
      />
    </div>
  );
}
