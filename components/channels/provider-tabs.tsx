"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Radio, Check, ChevronDown, Globe } from "lucide-react";
import { useProviderContext } from "@/contexts/provider-context";
import { ProviderConfig } from "@/lib/iptv/provider-config";
import { ProviderHealthStatus } from "@/lib/iptv/provider-health";
import { cn } from "@/lib/utils";

interface ProviderTabsProps {
  selectedProviderId: string | null;
  onProviderSelect: (providerId: string) => void;
  className?: string;
}

export default function ProviderTabs({
  selectedProviderId,
  onProviderSelect,
  className,
}: ProviderTabsProps) {
  const {
    providers,
    health,
    isLoading: providersLoading,
  } = useProviderContext();
  const [selectedType, setSelectedType] = useState<
    "main" | "regional" | "specialty" | "third-party" | "all"
  >("main");
  const [showAll, setShowAll] = useState(false);

  // Group providers by type
  const groupedProviders = useMemo(() => {
    const grouped: Record<string, ProviderConfig[]> = {
      main: [],
      regional: [],
      specialty: [],
      "third-party": [],
    };

    providers.forEach((provider) => {
      if (grouped[provider.type]) {
        grouped[provider.type].push(provider);
      }
    });

    return grouped;
  }, [providers]);

  // Get providers to display based on selected type
  const displayProviders = useMemo(() => {
    if (selectedType === "all") {
      return providers.slice(0, showAll ? providers.length : 12);
    }
    const typeProviders = groupedProviders[selectedType] || [];
    return showAll ? typeProviders : typeProviders.slice(0, 12);
  }, [selectedType, groupedProviders, providers, showAll]);

  // Main providers (top 9)
  const mainProviders = useMemo(() => {
    return providers.filter((p) => p.type === "main").slice(0, 9);
  }, [providers]);

  const getStatusColor = (status?: ProviderHealthStatus) => {
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

  const getStatusText = (status?: ProviderHealthStatus) => {
    switch (status) {
      case "online":
        return "Online";
      case "degraded":
        return "Slow";
      case "offline":
        return "Offline";
      case "checking":
        return "Checking";
      default:
        return "Unknown";
    }
  };

  const handleProviderClick = (providerId: string) => {
    onProviderSelect(providerId);
  };

  const types = [
    { id: "main", label: "Main", count: groupedProviders.main.length },
    {
      id: "regional",
      label: "Regional",
      count: groupedProviders.regional.length,
    },
    {
      id: "specialty",
      label: "Specialty",
      count: groupedProviders.specialty.length,
    },
    {
      id: "third-party",
      label: "Third-party",
      count: groupedProviders["third-party"].length,
    },
    { id: "all", label: "All", count: providers.length },
  ];

  if (providersLoading || !providers.length) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Provider Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id as any);
              setShowAll(false);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap",
              selectedType === type.id
                ? "bg-accent text-accent-foreground"
                : "bg-gray-900/50 text-gray-300 hover:bg-gray-900 border border-gray-800"
            )}
          >
            <span>{type.label}</span>
            {type.count > 0 && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  selectedType === type.id
                    ? "bg-accent-foreground/20"
                    : "bg-gray-800"
                )}
              >
                {type.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Provider Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {displayProviders.map((provider) => {
          const providerHealth = health[provider.id];
          const isSelected = selectedProviderId === provider.id;
          const status = providerHealth?.status;
          const channelCount = providerHealth?.channelCount;

          return (
            <motion.button
              key={provider.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleProviderClick(provider.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition whitespace-nowrap border-2",
                isSelected
                  ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-900 border-gray-800 hover:border-gray-700"
              )}
              title={`${provider.name} - ${
                channelCount || "?"
              } channels - ${getStatusText(status)}`}
            >
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    getStatusColor(status)
                  )}
                />
                <Radio
                  size={16}
                  className={cn(
                    "flex-shrink-0",
                    isSelected && "text-accent-foreground"
                  )}
                />
              </div>

              {/* Provider Name */}
              <span className="truncate max-w-[150px]">{provider.name}</span>

              {/* Channel Count */}
              {channelCount !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    isSelected ? "bg-accent-foreground/20" : "bg-gray-800"
                  )}
                >
                  {channelCount}
                </span>
              )}

              {/* Selected Check */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                >
                  <Check size={12} className="text-white" />
                </motion.div>
              )}

              {/* Region Badge */}
              {provider.region && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] uppercase font-bold",
                    isSelected
                      ? "bg-accent-foreground/20"
                      : "bg-gray-800 text-gray-400"
                  )}
                >
                  {provider.region}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Show More/Less Toggle */}
        {((selectedType === "all" && providers.length > 12) ||
          (selectedType !== "all" &&
            (groupedProviders[selectedType]?.length || 0) > 12)) && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 px-4 py-2.5 rounded-lg font-medium text-sm bg-gray-900/50 text-gray-300 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 transition whitespace-nowrap"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <ChevronDown size={16} className="rotate-180" />
              </>
            ) : (
              <>
                <span>Show More</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Selected Provider Info */}
      {selectedProviderId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-lg"
        >
          {(() => {
            const selectedProvider = providers.find(
              (p) => p.id === selectedProviderId
            );
            const selectedHealth = health[selectedProviderId];
            if (!selectedProvider) return null;

            return (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    getStatusColor(selectedHealth?.status)
                  )}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {selectedProvider.name}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                    {selectedHealth?.channelCount && (
                      <span>{selectedHealth.channelCount} channels</span>
                    )}
                    {selectedProvider.region && (
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {selectedProvider.region}
                      </span>
                    )}
                    {selectedHealth?.responseTime && (
                      <span>{selectedHealth.responseTime}ms</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {getStatusText(selectedHealth?.status)}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
