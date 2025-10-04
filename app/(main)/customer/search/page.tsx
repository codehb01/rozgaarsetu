"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ScrollList from "@/components/ui/scroll-list";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import type { GeocodeResult } from "@/lib/location";
import { useLocation } from "@/hooks/use-location";
import { toast } from "sonner";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiMapPin, 
  FiFilter, 
  FiStar, 
  FiClock, 
  FiUser,
  FiMap,
  FiGrid,
  FiList,
  FiTrendingUp
} from "react-icons/fi";

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
};

const CATEGORIES = [
  "All",
  "Electrician", 
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Mechanic",
  "Gardener",
  "Driver",
  "AC Technician",
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "nearest", label: "Nearest" },
];

export default function CustomerSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = useMemo(() => {
    const raw = searchParams.get("category");
    if (!raw) return "All";
    const norm = raw.replace(/-/g, " ").toLowerCase();
    const found = CATEGORIES.find((c) => c.toLowerCase() === norm);
    return found ?? "All";
  }, [searchParams]);

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const { getCurrentPosition, status, error: locError, place: locPlace, coords: locCoords } = useLocation();
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "scroll">("scroll");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const fetchWorkers = async (opts?: { q?: string; category?: string; location?: string; sortBy?: string; lat?: number; lng?: number }) => {
    const qs = new URLSearchParams();
    if (opts?.q) qs.set("q", opts.q);
    if (opts?.location) qs.set("location", opts.location);
    if (opts?.lat) qs.set("lat", String(opts.lat));
    if (opts?.lng) qs.set("lng", String(opts.lng));
    if (opts?.category && opts.category !== "All") qs.set("category", opts.category.toLowerCase());
    if (opts?.sortBy && opts.sortBy !== "relevance") qs.set("sort", opts.sortBy);
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
    fetchWorkers({ q, category, location, sortBy, lat: coords?.lat, lng: coords?.lng });
  }, [category, sortBy]);

  // Reflect browser geolocation into input once fetched
  useEffect(() => {
    if (locCoords && !coords) {
      setCoords({ lat: locCoords.lat, lng: locCoords.lng });
    }
    if (locPlace && !location) {
      setLocation(locPlace.displayName);
    }
  }, [locCoords, locPlace]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sortBy === "nearest" && !coords) {
      toast.info("Tip: Set a location or use 'Use my location' to get nearest results.")
    }
    fetchWorkers({ q, category, location, sortBy, lat: coords?.lat, lng: coords?.lng });
  };

  const onCategoryClick = (cat: string) => {
    setCategory(cat);
    const qs = new URLSearchParams(window.location.search);
    if (cat === "All") qs.delete("category");
    else qs.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/customer/search?${qs.toString()}`);
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Find Skilled Workers
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Connect with verified professionals in your area
            </p>
          </div>

          {/* Enhanced Search Form */}
          <form onSubmit={onSubmit} className="max-w-4xl">
            <div className="flex flex-col lg:flex-row gap-3 mb-4">
              {/* Main Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for services, skills, or worker names..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-12 h-12 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Search Input - Ready for OpenStreetMap */}
              <div className="relative lg:w-72">
                <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <OpenStreetMapInput
                  value={location}
                  onChange={(v) => { setLocation(v); if (!v) setCoords(null); }}
                  onSelect={(place: GeocodeResult) => {
                    setLocation(place.displayName);
                    setCoords(place.coords);
                  }}
                  placeholder="Enter location or area..."
                  inputClassName="pl-12 pr-10 h-12 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {location && (
                  <button
                    type="button"
                    aria-label="Clear location"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => { setLocation(""); setCoords(null); }}
                  >
                    ×
                  </button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-12 px-4 whitespace-nowrap"
                onClick={() => getCurrentPosition()}
                title="Use my current location"
              >
                <FiMap className="h-5 w-5 mr-2" />
                Use my location
              </Button>

              {/* Search Button */}
              <Button
                type="submit"
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <FiSearch className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Compact Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => onCategoryClick(cat)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>
          </form>
        </section>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-9"
            >
              <FiFilter className="h-4 w-4" />
              Filters
            </Button>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("scroll")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "scroll"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Scroll View"
            >
              <FiTrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : workers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="h-32 w-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <FiUser className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No workers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search criteria or explore different categories
              </p>
              <Button onClick={() => { setQ(""); setLocation(""); setCategory("All"); }}>
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {viewMode === "scroll" ? (
                <ScrollList
                  data={workers}
                  itemHeight={220}
                  renderItem={(worker: Worker, index: number) => (
                    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all duration-200 group">
                      <div className="flex items-start gap-4">
                        {/* Profile Picture */}
                        <div className="relative">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                            {worker.workerProfile?.profilePic ? (
                              <img
                                src={worker.workerProfile.profilePic}
                                alt={worker.name || "Worker"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FiUser className="h-8 w-8 text-white" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                        </div>

                        {/* Worker Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {worker.name ?? "Professional Worker"}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {worker.workerProfile?.qualification || "Skilled Professional"}
                            </span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <FiClock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {worker.workerProfile?.yearsExperience ?? 0} years
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            <FiMapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {worker.workerProfile?.city || "Location"} 
                              {worker.workerProfile?.availableAreas?.length && (
                                <span className="ml-1">
                                  +{worker.workerProfile.availableAreas.length} areas
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Skills */}
                          {worker.workerProfile?.skilledIn && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {worker.workerProfile.skilledIn.slice(0, 3).map((skill: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                                >
                                  {skill}
                                </span>
                              ))}
                              {worker.workerProfile.skilledIn.length > 3 && (
                                <span className="px-2 py-1 text-xs text-gray-500">
                                  +{worker.workerProfile.skilledIn.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Link href={`/workers/${worker.id}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                View Profile
                              </Button>
                            </Link>
                            <BookWorkerButton workerId={worker.id} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                />
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "sm:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {workers.map((worker: Worker, index: number) => (
                    <motion.div
                      key={worker.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all duration-200 group">
                        <div className="flex items-start gap-4">
                          {/* Profile Picture */}
                          <div className="relative">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                              {worker.workerProfile?.profilePic ? (
                                <img
                                  src={worker.workerProfile.profilePic}
                                  alt={worker.name || "Worker"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FiUser className="h-8 w-8 text-white" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                          </div>

                          {/* Worker Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {worker.name ?? "Professional Worker"}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {worker.workerProfile?.qualification || "Skilled Professional"}
                              </span>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-1">
                                <FiClock className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {worker.workerProfile?.yearsExperience ?? 0} years
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                              <FiMapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {worker.workerProfile?.city || "Location"} 
                                {worker.workerProfile?.availableAreas?.length && (
                                  <span className="ml-1">
                                    +{worker.workerProfile.availableAreas.length} areas
                                  </span>
                                )}
                              </span>
                            </div>

                            {/* Skills */}
                            {worker.workerProfile?.skilledIn && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {worker.workerProfile.skilledIn.slice(0, 3).map((skill: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {worker.workerProfile.skilledIn.length > 3 && (
                                  <span className="px-2 py-1 text-xs text-gray-500">
                                    +{worker.workerProfile.skilledIn.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Link href={`/workers/${worker.id}`} className="flex-1">
                                <Button
                                  variant="outline"
                                  className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  View Profile
                                </Button>
                              </Link>
                              <BookWorkerButton workerId={worker.id} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
