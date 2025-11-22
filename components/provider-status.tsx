"use client";

import { useProviderContext } from "@/contexts/provider-context";
import { ProviderHealthStatus } from "@/lib/iptv/provider-health";
import { cn } from "@/lib/utils";

interface ProviderStatusProps {
  className?: string;
  showText?: boolean;
}

export default function ProviderStatus({
  className,
  showText = false,
}: ProviderStatusProps) {
  const { currentProvider, health } = useProviderContext();

  if (!currentProvider) {
    return null;
  }

  const providerHealth = health[currentProvider.id];
  const status = providerHealth?.status || "unknown";

  const getStatusColor = (status: ProviderHealthStatus | "unknown") => {
    switch (status) {
      case "online":
        return "bg-red-500";
      case "degraded":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      case "checking":
        return "bg-blue-500 animate-pulse";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: ProviderHealthStatus | "unknown") => {
    switch (status) {
      case "online":
        return "Online";
      case "degraded":
        return "Degraded";
      case "offline":
        return "Offline";
      case "checking":
        return "Checking";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("w-2 h-2 rounded-full", getStatusColor(status))}
        title={`${currentProvider.name}: ${getStatusText(status)}`}
      />
      {showText && (
        <span className="text-xs text-gray-400">{getStatusText(status)}</span>
      )}
    </div>
  );
}
