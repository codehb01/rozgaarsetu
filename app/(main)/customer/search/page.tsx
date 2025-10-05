"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ScrollList from "@/components/ui/scroll-list";
// OpenStreetMapInput removed; we use a compact location dropdown instead
import { useLocation } from "@/hooks/use-location";
import { toast } from "sonner";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";
import MapPreview from "@/components/ui/map-preview";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiMapPin, 
  FiStar, 
  FiClock, 
  FiUser,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiCheck,
  FiLoader
} from "react-icons/fi";

type Worker = {
  id: string;
  name: string | null;
  role: string;
  // distance may be provided by the API (DB-side Haversine) as distanceKm or distance_km
  distanceKm?: number | null;
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
  const [isLocating, setIsLocating] = useState(false);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "scroll">("scroll");
  // filters panel removed in this simplified UI
  const [locMenuOpen, setLocMenuOpen] = useState(false);
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
      // Normalize possible distance fields from the API to `distanceKm`
      const normalize = (w: any) => ({
        ...w,
        distanceKm: w.distanceKm ?? w.distance_km ?? w.distance ?? w.distanceInKm ?? w.distance_in_km ?? null,
      });
      setWorkers((data.workers || []).map(normalize));
    } catch (e) {
      console.error(e);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when category, sort or coords change (coords will be populated after geolocation completes)
  useEffect(() => {
    fetchWorkers({ q, category, location, sortBy, lat: coords?.lat, lng: coords?.lng });
  }, [category, sortBy, coords]);

  // Reflect browser geolocation into input once fetched
  useEffect(() => {
    if (locCoords && !coords) {
      setCoords({ lat: locCoords.lat, lng: locCoords.lng });
    }
    if (locPlace && !location) {
      setLocation(locPlace.displayName);
    }
  }, [locCoords, locPlace]);

  // Automatically prompt for location on page load so nearest results are possible
  useEffect(() => {
    // only ask if we don't already have coords
    if (!coords) {
      // best-effort: ask for current position once
      try { getCurrentPosition(); } catch (e) { /* ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stop locating spinner when location status updates or coords arrive
  useEffect(() => {
    // stop locating spinner when status becomes success or error
    if (status === 'success' || status === 'error') setIsLocating(false);
    if (locCoords) setIsLocating(false);
  }, [status, locCoords]);

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
            <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center">
              {/* Single Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for services, skills, or worker names..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-12 h-12 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                  {/* Location dropdown trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setLocMenuOpen(!locMenuOpen)}
                      className="h-10 px-3 ml-2 mr-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm flex items-center gap-2"
                      aria-expanded={locMenuOpen}
                    >
                      <FiMapPin className="h-4 w-4 text-gray-600" />
                      <span className="truncate max-w-[12rem] text-sm">{location || (locPlace?.displayName ?? 'Select location')}</span>
                    </button>
                    {locMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-3">
                          <button
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setLocMenuOpen(false);
                              if (locCoords) {
                                setCoords({ lat: locCoords.lat, lng: locCoords.lng });
                                setLocation(locPlace?.displayName ?? `Current location`);
                              } else {
                                // request location
                                getCurrentPosition();
                              }
                            }}
                          >
                            Use my current location
                          </button>
                          <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                          <div className="text-sm text-gray-500 mb-2">Popular cities</div>
                          {['Mumbai','Pune','Chennai','Bengaluru','Delhi'].map((city) => (
                            <button
                              key={city}
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => { setLocation(city); setCoords(null); setLocMenuOpen(false); }}
                            >{city}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <FiSearch className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Compact Category Pills (small) */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => onCategoryClick(cat)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                      active
                        ? "bg-blue-600 text-white shadow"
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

  {/* Map preview */}
  <MapPreview workers={workers} center={coords ?? undefined} />

  {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            {/* Sort Dropdown only - no duplicate nearest button */}
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
                  itemHeight={150}
                  renderItem={(w: Worker, i: number) => {
                    const name = w.name ?? "Professional";
                    const initial = name.charAt(0);
                    const skills = w.workerProfile?.skilledIn && w.workerProfile!.skilledIn!.length > 0 ? w.workerProfile!.skilledIn!.slice(0,3).join(", ") : "No skills listed";
                    const distance = typeof w.distanceKm === "number" ? (w.distanceKm < 1 ? `${Math.round(w.distanceKm * 1000)} m` : `${w.distanceKm.toFixed(1)} km`) : "—";
                    return (
                      <div key={w.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">{initial}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="truncate">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{skills}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">{distance}</div>
                                <div className="text-xs text-gray-500 mt-1">{w.workerProfile?.yearsExperience ?? 0} yrs</div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                              <Link href={`/worker/${w.id}`} className="text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">View</Link>
                              <BookWorkerButton workerId={w.id} className="px-3 py-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {workers.map((worker: Worker, index: number) => {
                    const name = worker.name ?? "Professional";
                    const initial = name.charAt(0);
                    const skills = worker.workerProfile?.skilledIn && worker.workerProfile!.skilledIn!.length > 0 ? worker.workerProfile!.skilledIn!.slice(0,3).join(", ") : "No skills listed";
                    const distance = typeof worker.distanceKm === "number" ? (worker.distanceKm < 1 ? `${Math.round(worker.distanceKm * 1000)} m` : `${worker.distanceKm.toFixed(1)} km`) : "—";
                    return (
                      <motion.div
                        key={worker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">{initial}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="truncate">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{skills}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">{distance}</div>
                                  <div className="text-xs text-gray-500 mt-1">{worker.workerProfile?.yearsExperience ?? 0} yrs</div>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-3">
                                <Link href={`/worker/${worker.id}`} className="text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">View</Link>
                                <BookWorkerButton workerId={worker.id} className="px-3 py-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
