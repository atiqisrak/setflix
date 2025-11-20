"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search channels...",
}: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-12 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
