"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { IPTVChannel, getCountryFlagUrl } from "@/lib/iptv";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  popularCategories: string[];
  groupedChannels: Record<string, IPTVChannel[]>;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  channelsLength: number;
  recentFilters: string[];
  countries: string[];
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  categories,
  popularCategories,
  groupedChannels,
  selectedCategory,
  onCategorySelect,
  channelsLength,
  recentFilters,
  countries,
  selectedCountry,
  onCountrySelect,
}: FilterSidebarProps) {
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["News", "Sports", "Entertainment"])
  );

  const filteredCategories = useMemo(() => {
    if (!filterSearchQuery.trim()) return categories;
    const query = filterSearchQuery.toLowerCase();
    return categories.filter((cat) => cat.toLowerCase().includes(query));
  }, [categories, filterSearchQuery]);

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="md:fixed md:left-0 md:top-20 md:h-[calc(100vh-5rem)] md:w-80 md:bg-gray-950/95 md:backdrop-blur-md md:border-r md:border-gray-800 md:overflow-y-auto md:z-40 mb-6 md:mb-0"
        >
          <div className="md:p-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg md:rounded-none md:border-0">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h2>
              <button
                onClick={onClose}
                className="md:hidden text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={filterSearchQuery}
                onChange={(e) => setFilterSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-10 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition text-sm"
              />
              {filterSearchQuery && (
                <button
                  onClick={() => setFilterSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* All Channels Button */}
            <button
              onClick={() => onCategorySelect("all")}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 mb-4 flex items-center justify-between",
                selectedCategory === "all"
                  ? "bg-white text-black"
                  : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
              )}
            >
              <span>All Channels</span>
              <span className="text-xs opacity-70">({channelsLength})</span>
            </button>

            {/* Country Filter */}
            {countries.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Country
                </h3>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => onCountrySelect(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition appearance-none cursor-pointer"
                  >
                    <option value="all">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {selectedCountry !== "all" && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <img
                        src={
                          getCountryFlagUrl(selectedCountry, "flat", 20) || ""
                        }
                        alt={selectedCountry}
                        className="w-5 h-4 object-cover rounded-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {/* Country List with Flags */}
                <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                  <button
                    onClick={() => onCountrySelect("all")}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2",
                      selectedCountry === "all"
                        ? "bg-white text-black"
                        : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                    )}
                  >
                    <span>All Countries</span>
                  </button>
                  {countries.map((country) => {
                    const flagUrl = getCountryFlagUrl(country, "flat", 24);
                    return (
                      <button
                        key={country}
                        onClick={() => onCountrySelect(country)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center gap-2",
                          selectedCountry === country
                            ? "bg-white text-black"
                            : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                        )}
                      >
                        {flagUrl && (
                          <img
                            src={flagUrl}
                            alt={country}
                            className="w-6 h-4 object-cover rounded-sm shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <span className="truncate">{country}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Filters */}
            {recentFilters.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Recently Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentFilters.map((category) => (
                    <button
                      key={category}
                      onClick={() => onCategorySelect(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                        selectedCategory === category
                          ? "bg-white text-black"
                          : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                      )}
                    >
                      {category === "Undefined" ? "Browse" : category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Popular Categories
              </h3>
              <div className="space-y-1">
                {popularCategories.slice(0, 8).map((category) => {
                  const count = groupedChannels[category]?.length || 0;
                  return (
                    <button
                      key={category}
                      onClick={() => onCategorySelect(category)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 flex items-center justify-between",
                        selectedCategory === category
                          ? "bg-white text-black"
                          : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                      )}
                    >
                      <span>
                        {category === "Undefined" ? "Browse" : category}
                      </span>
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Categories (Collapsible) */}
            {filteredCategories.length > 8 && (
              <div className="mb-6">
                <button
                  onClick={() => toggleCategoryExpansion("all")}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white transition mb-3"
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    All Categories ({filteredCategories.length})
                  </h3>
                  {expandedCategories.has("all") ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <AnimatePresence>
                  {expandedCategories.has("all") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {filteredCategories.slice(8).map((category) => {
                        const count = groupedChannels[category]?.length || 0;
                        return (
                          <button
                            key={category}
                            onClick={() => onCategorySelect(category)}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 flex items-center justify-between",
                              selectedCategory === category
                                ? "bg-white text-black"
                                : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                            )}
                          >
                            <span>
                              {category === "Undefined" ? "Browse" : category}
                            </span>
                            <span className="text-xs opacity-70">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
