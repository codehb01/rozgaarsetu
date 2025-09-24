"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MapPin, Sliders, Star, Clock, MapIcon } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { Button } from "@/components/ui/button";
import { getCurrentLocation, geocodeAddress } from "@/lib/location";

type Worker = {
  id: string;
  name: string | null;
  role: string;
  workerProfile: {
    skilledIn: string[] | null;
    city: string | null;
    availableAreas: string[] | null;
    yearsExperience: number | null;
    qualification: string | null;
    profilePic: string | null;
    bio: string | null;
  } | null;
  distance?: number;
  distanceText?: string;
  relevanceScore?: number;
};

const CATEGORIES = [
  { key: "All", label: "All", emoji: "🎯" },
  { key: "Electrician", label: "Electrician", emoji: "⚡" },
  { key: "Plumber", label: "Plumber", emoji: "🔧" },
  { key: "Carpenter", label: "Carpenter", emoji: "🔨" },
  { key: "Painter", label: "Painter", emoji: "🎨" },
  { key: "Cleaner", label: "Cleaner", emoji: "✨" },
  { key: "Mechanic", label: "Mechanic", emoji: "🔧" },
  { key: "Gardener", label: "Gardener", emoji: "🌱" },
  { key: "Driver", label: "Driver", emoji: "🚗" },
  { key: "AC Technician", label: "AC Technician", emoji: "❄️" },
];

export default function CustomerSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = useMemo(() => {
    const raw = searchParams.get("category");
    if (!raw) return "All";
    const norm = raw.replace(/-/g, " ").toLowerCase();
    const found = CATEGORIES.find((c) => c.key.toLowerCase() === norm);
    return found?.key ?? "All";
  }, [searchParams]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Location-based search state
  const [searchLocation, setSearchLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState("25");
  const [sortBy, setSortBy] = useState("relevance");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchWorkers = async (opts?: { 
    q?: string; 
    category?: string; 
    location?: { lat: number; lng: number }; 
    radius?: string;
    sortBy?: string;
  }) => {
    const qs = new URLSearchParams();
    if (opts?.q) qs.set("q", opts.q);
    if (opts?.category && opts.category !== "All")
      qs.set("category", opts.category.toLowerCase());
    if (opts?.location) {
      qs.set("lat", opts.location.lat.toString());
      qs.set("lng", opts.location.lng.toString());
    }
    if (opts?.radius) qs.set("radius", opts.radius);
    if (opts?.sortBy) qs.set("sortBy", opts.sortBy);
    qs.set("limit", "30");
    
    const url = `/api/workers?${qs.toString()}`;
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch workers");
      const data = await res.json();
      setWorkers(data.workers || []);
    } catch (e) {
      console.error(e);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers({ q, category, location: currentLocation || undefined, radius: searchRadius, sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, currentLocation, searchRadius, sortBy]);

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    try {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation({ lat: location.latitude, lng: location.longitude });
        setSearchLocation("Current Location");
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError("Unable to get your location. Please enter manually.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!searchLocation.trim() || searchLocation === "Current Location") return;
    
    setIsGettingLocation(true);
    setLocationError(null);
    
    try {
      const location = await geocodeAddress(searchLocation);
      if (location) {
        setCurrentLocation({ lat: location.latitude, lng: location.longitude });
      } else {
        setLocationError("Location not found. Please try a different address.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationError("Error finding location. Please try again.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers({ 
      q, 
      category, 
      location: currentLocation || undefined, 
      radius: searchRadius, 
      sortBy 
    });
  };

  const onBadgeClick = (cat: string) => {
    setCategory(cat);
    const qs = new URLSearchParams(window.location.search);
    if (cat === "All") qs.delete("category");
    else qs.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/customer/search?${qs.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Premium Apple-style background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 py-12">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              <ShimmerText 
                text="Search Workers"
                className="text-4xl sm:text-5xl font-bold tracking-tight"
              />
            </h1>
            <div className="max-w-2xl mx-auto">
              <TextGenerateEffect 
                words="Find skilled professionals by keyword or category. Connect with the best talent in your area."
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                duration={0.6}
              />
            </div>
          </motion.div>

          {/* Enhanced Search Form with Location */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            onSubmit={onSubmit} 
            className="mb-8"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 shadow-xl">
                
                {/* Main Search Row */}
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search e.g. plumber, electrician, carpenter..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center justify-center px-4 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200"
                  >
                    <Sliders className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <span className="relative z-10">Search</span>
                  </button>
                </div>

                {/* Location Search Row */}
                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter location or use current location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationSearch}
                    disabled={isGettingLocation || !searchLocation.trim()}
                    className="px-4 py-3"
                  >
                    Find
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="px-4 py-3"
                  >
                    {isGettingLocation ? "Getting..." : "📍 Current"}
                  </Button>
                </div>

                {/* Location Status */}
                {currentLocation && (
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg mb-4">
                    ✅ Searching near: {searchLocation || "Current Location"} (±{searchRadius}km)
                  </div>
                )}

                {locationError && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg mb-4">
                    ❌ {locationError}
                  </div>
                )}

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Radius
                          </label>
                          <select
                            value={searchRadius}
                            onChange={(e) => setSearchRadius(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="25">25 km</option>
                            <option value="50">50 km</option>
                            <option value="100">100 km</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sort By
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="relevance">Best Match</option>
                            <option value="distance">Nearest First</option>
                            <option value="experience">Most Experienced</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.form>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.form>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((c, index) => {
                const active = c.key === category;
                return (
                  <motion.button
                    key={c.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    onClick={() => onBadgeClick(c.key)}
                    className={`group relative inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 border ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25"
                        : "bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02] backdrop-blur-xl"
                    }`}
                  >
                    <span className={`text-lg ${active ? "" : "group-hover:scale-110 transition-transform duration-200"}`}>
                      {c.emoji}
                    </span>
                    <span>{c.label}</span>
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Searching for workers...</p>
                </motion.div>
              ) : workers.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No workers found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or category filters.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Found {workers.length} worker{workers.length !== 1 ? 's' : ''}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {workers.map((w, index) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                        className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 hover:scale-[1.01]"
                      >
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {(w.name ?? "U").charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {w.name ?? "Unnamed Worker"}
                            </h4>
                            
                            <div className="flex items-center gap-4 mb-3 text-gray-600 dark:text-gray-400">
                              <span className="font-medium">
                                {w.workerProfile?.qualification || "Professional"}
                              </span>
                              <span className="text-gray-400 dark:text-gray-600">•</span>
                              <span>
                                {w.workerProfile?.yearsExperience ?? 0}+ years experience
                              </span>
                              <span className="text-gray-400 dark:text-gray-600">•</span>
                              <span className="flex items-center gap-1">
                                <span>📍</span>
                                {w.workerProfile?.city || "Location"}
                              </span>
                            </div>
                            
                            {w.workerProfile?.availableAreas && w.workerProfile.availableAreas.length > 0 && (
                              <div className="mb-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Available in: {w.workerProfile.availableAreas.slice(0, 3).join(", ")}
                                  {w.workerProfile.availableAreas.length > 3 && ` +${w.workerProfile.availableAreas.length - 3} more`}
                                </span>
                              </div>
                            )}
                            
                            {w.workerProfile?.skilledIn && w.workerProfile.skilledIn.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {w.workerProfile.skilledIn.slice(0, 4).map((skill: string, skillIndex: number) => (
                                  <span
                                    key={skillIndex}
                                    className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {w.workerProfile.skilledIn.length > 4 && (
                                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                                    +{w.workerProfile.skilledIn.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <Link 
                              href={`/workers/${w.id}`}
                              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] no-underline text-center"
                            >
                              View Profile
                            </Link>
                            <Link 
                              href={`/customer/booking?worker=${w.id}`}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 no-underline text-center"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
