"use client";

import { useState } from "react";
import { ChevronDown, Check, Globe, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProviderContext } from "@/contexts/provider-context";
import { ProviderConfig } from "@/lib/iptv/provider-config";
import { ProviderHealthStatus } from "@/lib/iptv/provider-health";
import { cn } from "@/lib/utils";

interface ProviderSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export default function ProviderSelector({
  className,
  showLabel = true,
}: ProviderSelectorProps) {
  const {
    currentProvider,
    providers,
    health,
    candidates,
    selectProvider,
    isLoading,
  } = useProviderContext();
  
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status?: ProviderHealthStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
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
        return "Degraded";
      case "offline":
        return "Offline";
      case "checking":
        return "Checking";
      default:
        return "Unknown";
    }
  };

  const groupedProviders = providers.reduce(
    (acc, provider) => {
      if (!acc[provider.type]) {
        acc[provider.type] = [];
      }
      acc[provider.type].push(provider);
      return acc;
    },
    {} as Record<string, ProviderConfig[]>
  );

  const handleSelect = async (providerId: string) => {
    await selectProvider(providerId);
    setIsOpen(false);
  };

  if (isLoading || !currentProvider) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:bg-gray-900 transition text-sm"
      >
        <Radio size={16} />
        {showLabel && (
          <span className="hidden sm:inline">
            {currentProvider.name}
          </span>
        )}
        <ChevronDown
          size={16}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 z-50 w-80 max-h-[500px] overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-xl"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase mb-2">
                  Select Provider
                </div>
                
                {Object.entries(groupedProviders).map(([type, typeProviders]) => (
                  <div key={type} className="mb-4">
                    <div className="px-3 py-1.5 text-xs font-medium text-gray-500 capitalize">
                      {type.replace("-", " ")}
                    </div>
                    {typeProviders.slice(0, 10).map((provider) => {
                      const providerHealth = health[provider.id];
                      const isSelected = currentProvider?.id === provider.id;
                      
                      return (
                        <button
                          key={provider.id}
                          onClick={() => handleSelect(provider.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition text-left",
                            isSelected && "bg-gray-800"
                          )}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                getStatusColor(providerHealth?.status)
                              )}
                              title={getStatusText(providerHealth?.status)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">
                              {provider.name}
                            </div>
                            {providerHealth?.channelCount && (
                              <div className="text-xs text-gray-500">
                                {providerHealth.channelCount} channels
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

