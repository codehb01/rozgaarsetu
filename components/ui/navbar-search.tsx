"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TRENDING_SEARCHES = [
  "Salon",
  "Professional bathroom cleaning", 
  "Professional kitchen cleaning",
  "Full home cleaning",
  "Washing machine repair",
  "Massage for men",
  "Spa luxe",
  "Carpenters",
  "Electricians", 
  "Tv repair"
];

const QUICK_CATEGORIES = [
  { name: "Women's Salon & Spa", emoji: "💅", category: "salon" },
  { name: "Men's Salon & Massage", emoji: "💆‍♂️", category: "salon" },
  { name: "AC & Appliance Repair", emoji: "❄️", category: "ac-technician" },
  { name: "Cleaning & Pest Control", emoji: "🧹", category: "cleaner" },
  { name: "Electrician, Plumber & Carpenter", emoji: "🔧", category: "electrician" },
  { name: "Painting & Water proofing", emoji: "🎨", category: "painter" }
];

interface NavbarSearchProps {
  placeholder?: string;
  showLocation?: boolean;
}

export default function NavbarSearch({ placeholder = "Search for services", showLocation = true }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Dadar, Mumbai");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (searchQuery: string, category?: string) => {
    if (!searchQuery.trim()) return;
    
    const params = new URLSearchParams();
    params.set("q", searchQuery.trim());
    if (category) params.set("category", category);
    
    router.push(`/customer/search?${params.toString()}`);
    setIsSearchFocused(false);
    setQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleTrendingClick = (trend: string) => {
    setQuery(trend);
    handleSearch(trend);
  };

  const handleCategoryClick = (categoryName: string, category: string) => {
    handleSearch(categoryName, category);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setIsLocationFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Location Section */}
        {showLocation && (
          <>
            <div className="relative">
              <button
                onClick={() => setIsLocationFocused(!isLocationFocused)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-lg transition-colors duration-200 border-r border-gray-200 dark:border-gray-700"
              >
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium truncate max-w-32">{location}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isLocationFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                  >
                    <div className="p-4">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your location"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Search Section */}
        <div className="flex-1 relative">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full px-3 py-3 text-gray-700 dark:text-gray-300 placeholder-gray-400 bg-transparent focus:outline-none"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
              >
                {/* Trending Searches */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trending searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((trend, index) => (
                      <button
                        key={index}
                        onClick={() => handleTrendingClick(trend)}
                        className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                      >
                        {trend}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Categories */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">What are you looking for?</h4>
                  <div className="space-y-2">
                    {QUICK_CATEGORIES.map((cat, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(cat.name, cat.category)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}