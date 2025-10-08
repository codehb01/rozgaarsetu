"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
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
import SkillBadge from "@/components/ui/skill-badge";

const MapPreview = dynamic(() => import("@/components/ui/map-preview"), {
  ssr: false,
});
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
  FiLoader,
} from "react-icons/fi";
import StaggeredDropDown from "@/components/ui/staggered-dropdown";

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
    category?: string | null;
    jobCategory?: string | null;
  } | null;
};

const CATEGORIES = [
  "All",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "AC Repair",
  "Appliance Repair",
  "Masonry",
  "Welding",
  "Roofing",
  "Flooring",
  "Pest Control",
  "Moving",
  "Handyman",
];

type ViewMode = "grid" | "list" | "scroll" | "map";

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "nearest", label: "Nearest" },
];

function SearchPageContent() {
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
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const {
    getCurrentPosition,
    status,
    error: locError,
    place: locPlace,
    coords: locCoords,
  } = useLocation();
  const [isLocating, setIsLocating] = useState(false);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("scroll");
  // filters panel removed in this simplified UI
  const [locMenuOpen, setLocMenuOpen] = useState(false);
  const locButtonRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  // Close location menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locMenuOpen &&
        locButtonRef.current &&
        !locButtonRef.current.contains(event.target as Node)
      ) {
        setLocMenuOpen(false);
      }
    };

    if (locMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locMenuOpen]);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);

  // Compute counts per category from the currently fetched workers (client-side)
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of CATEGORIES) map[c] = 0;
    for (const w of workers) {
      // infer normalized category strings from common worker fields
      const wCatRaw =
        w.workerProfile?.category ?? w.workerProfile?.jobCategory ?? null;
      const skills: string[] = w.workerProfile?.skilledIn ?? [];

      // count 'All'
      map["All"] = (map["All"] || 0) + 1;

      if (wCatRaw && typeof wCatRaw === "string") {
        const norm = wCatRaw.trim().toLowerCase();
        for (const c of CATEGORIES) {
          if (c.toLowerCase() === norm) map[c] = (map[c] || 0) + 1;
        }
      }

      // also try matching against skilledIn entries (some workers list skills instead of category)
      if (Array.isArray(skills) && skills.length > 0) {
        for (const s of skills) {
          const normS = String(s).trim().toLowerCase();
          for (const c of CATEGORIES) {
            if (c.toLowerCase() === normS) map[c] = (map[c] || 0) + 1;
          }
        }
      }
    }
    return map;
  }, [workers]);

  const fetchWorkers = async (opts?: {
    q?: string;
    category?: string;
    location?: string;
    sortBy?: string;
    lat?: number;
    lng?: number;
  }) => {
    const qs = new URLSearchParams();
    if (opts?.q) qs.set("q", opts.q);
    if (opts?.location) qs.set("location", opts.location);
    if (opts?.lat) qs.set("lat", String(opts.lat));
    if (opts?.lng) qs.set("lng", String(opts.lng));
    if (opts?.category && opts.category !== "All")
      qs.set("category", opts.category.toLowerCase());
    if (opts?.sortBy && opts.sortBy !== "relevance")
      qs.set("sort", opts.sortBy);
    qs.set("limit", "30");

    const url = `/api/workers?${qs.toString()}`;
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch workers");
      const data = await res.json();
      // Normalize possible distance fields from the API to `distanceKm`
      const normalize = (
        w: Worker & {
          distance_km?: number;
          distance?: number;
          distanceInKm?: number;
          distance_in_km?: number;
        }
      ): Worker => ({
        ...w,
        distanceKm:
          w.distanceKm ??
          w.distance_km ??
          w.distance ??
          w.distanceInKm ??
          w.distance_in_km ??
          null,
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
    fetchWorkers({
      q,
      category,
      location,
      sortBy,
      lat: coords?.lat,
      lng: coords?.lng,
    });
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
      try {
        getCurrentPosition();
      } catch (e) {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stop locating spinner when location status updates or coords arrive
  useEffect(() => {
    // stop locating spinner when status becomes success or error
    if (status === "success" || status === "error") setIsLocating(false);
    if (locCoords) setIsLocating(false);
  }, [status, locCoords]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sortBy === "nearest" && !coords) {
      toast.info(
        "Tip: Set a location or use 'Use my location' to get nearest results."
      );
    }
    fetchWorkers({
      q,
      category,
      location,
      sortBy,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  };

  const onCategoryClick = (cat: string) => {
    setCategory(cat);
    if (typeof window !== "undefined") {
      const qs = new URLSearchParams(window.location.search);
      if (cat === "All") qs.delete("category");
      else qs.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
      router.push(`/customer/search?${qs.toString()}`);
    }
  };

  // Mobile-Responsive Skeleton Loader Component
  const SkeletonCard = () => (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1 w-full sm:w-auto">
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 sm:mb-3" />
          <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3 sm:mb-4" />
          <div className="flex gap-1 sm:gap-2">
            <div className="h-6 sm:h-8 lg:h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-12 sm:w-16" />
            <div className="h-6 sm:h-8 lg:h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 sm:w-20" />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Header Section */}
      <div className="bg-transparent border-b border-gray-200 dark:border-gray-800">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Find Skilled Workers
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Connect with verified professionals in your area
            </p>
          </div>

          {/* Enhanced Search + Controls Container */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 shadow-sm">
            {/* Enhanced Search Form */}
            <form onSubmit={onSubmit} className="w-full">
              <div className="flex flex-col gap-3 mb-4">
                {/* Single Search Input */}
                <div className="relative w-full">
                  <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    placeholder="Search for services, skills..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-10 sm:pl-12 pr-3 sm:pr-4 h-10 sm:h-12 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>

                {/* Location and Search Button Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Location dropdown trigger */}
                  <div className="relative flex-1">
                    <button
                      type="button"
                      ref={locButtonRef}
                      onClick={() => {
                        if (!locMenuOpen) {
                          const rect =
                            locButtonRef.current?.getBoundingClientRect();
                          if (rect && typeof window !== "undefined")
                            setMenuPos({
                              left: rect.left + window.scrollX,
                              top: rect.bottom + window.scrollY,
                              width: rect.width,
                            });
                        }
                        setLocMenuOpen(!locMenuOpen);
                      }}
                      className="w-full sm:w-auto h-10 sm:h-10 px-3 sm:px-4 rounded-full bg-amber-500/15 hover:bg-amber-500/20 text-amber-500 text-xs sm:text-sm inline-flex items-center justify-center sm:justify-start gap-2"
                      aria-expanded={locMenuOpen}
                    >
                      <FiMapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                      <span className="truncate max-w-[8rem] sm:max-w-[12rem] text-xs sm:text-sm">
                        {location ||
                          (locPlace?.displayName ?? "Select location")}
                      </span>
                    </button>
                    {locMenuOpen &&
                      menuPos &&
                      typeof document !== "undefined" &&
                      createPortal(
                        <div
                          style={{
                            position: "fixed",
                            left: menuPos.left,
                            top: menuPos.top,
                            width: Math.max(240, menuPos.width),
                          }}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-[99999]"
                        >
                          <div className="p-3">
                            <button
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                setLocMenuOpen(false);
                                if (locCoords) {
                                  setCoords({
                                    lat: locCoords.lat,
                                    lng: locCoords.lng,
                                  });
                                  setLocation(
                                    locPlace?.displayName ?? `Current location`
                                  );
                                } else {
                                  // request location
                                  getCurrentPosition();
                                }
                              }}
                            >
                              Use my current location
                            </button>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                            <div className="text-sm text-gray-500 mb-2">
                              Popular cities
                            </div>
                            {[
                              "Mumbai",
                              "Pune",
                              "Chennai",
                              "Bengaluru",
                              "Delhi",
                            ].map((city) => (
                              <button
                                key={city}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                  setLocation(city);
                                  setCoords(null);
                                  setLocMenuOpen(false);
                                }}
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        </div>,
                        document.body
                      )}
                  </div>

                  {/* Search Button */}
                  <Button
                    type="submit"
                    className="w-full sm:w-auto h-10 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-all duration-200 hover:shadow-md text-sm sm:text-base"
                  >
                    <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Mobile-Responsive Category Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 overflow-x-auto pb-2">
                {CATEGORIES.map((cat) => {
                  const active = cat === category;
                  // use client-side computed counts from fetched workers
                  const count = categoryCounts[cat] ?? 0;
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => onCategoryClick(cat)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                        active
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="truncate max-w-[6rem] sm:max-w-[8rem]">
                        {cat}
                      </span>
                      <span
                        className={`flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 text-[10px] sm:text-[11px] font-semibold rounded-full ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border"
                        }`}
                      >
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </form>

            {/* Mobile-Responsive Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <StaggeredDropDown
                  items={SORT_OPTIONS}
                  selected={sortBy}
                  onSelect={(v) => setSortBy(v)}
                />
                <span className="text-xs text-gray-500 ml-auto sm:ml-0">
                  {workers.length} workers found
                </span>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto justify-center sm:justify-start">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 sm:p-2 rounded-md flex items-center gap-1 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:hidden">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 sm:p-2 rounded-md flex items-center gap-1 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="List View"
                >
                  <FiList className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:hidden">List</span>
                </button>
                <button
                  onClick={() => setViewMode("scroll")}
                  className={`p-1.5 sm:p-2 rounded-md flex items-center gap-1 ${
                    viewMode === "scroll"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="Scroll View"
                >
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:hidden">Scroll</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-1.5 sm:p-2 rounded-md flex items-center gap-1 ${
                    viewMode === "map"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="Map View"
                >
                  <FiMapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:hidden">Map</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* If user chose Map view, show a full-width map */}
          {viewMode === "map" ? (
            <div className="w-full">
              <MapPreview
                workers={workers}
                center={coords ?? undefined}
                height={720}
              />
            </div>
          ) : (
            <>
              {/* Left: results */}
              <div>
                {/* Results */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </motion.div>
                  ) : workers.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8 sm:py-12 lg:py-16 px-4"
                    >
                      <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <FiUser className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
                        No workers found
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
                        Try adjusting your search criteria or explore different
                        categories
                      </p>
                      <Button
                        onClick={() => {
                          setQ("");
                          setLocation("");
                          setCategory("All");
                        }}
                        className="w-full sm:w-auto"
                      >
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
                          renderItem={(w: Worker) => {
                            const name = w.name ?? "Professional";
                            const initial = name.charAt(0);
                            const skills =
                              w.workerProfile?.skilledIn &&
                              w.workerProfile!.skilledIn!.length > 0
                                ? w.workerProfile!.skilledIn!.slice(0, 3)
                                : [];
                            const distance =
                              typeof w.distanceKm === "number"
                                ? w.distanceKm < 1
                                  ? `${Math.round(w.distanceKm * 1000)} m`
                                  : `${w.distanceKm.toFixed(1)} km`
                                : "—";
                            return (
                              <div
                                key={w.id}
                                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-3 sm:p-4"
                              >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                  {/* Avatar and Name */}
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">
                                      {initial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {name}
                                      </h3>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {w.workerProfile?.yearsExperience ?? 0}{" "}
                                        years experience
                                      </div>
                                    </div>
                                  </div>

                                  {/* Skills */}
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap flex-1 min-w-0">
                                    {skills.length > 0 ? (
                                      skills.map((s: string) => (
                                        <SkillBadge key={s} skill={s} />
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        No skills listed
                                      </span>
                                    )}
                                  </div>

                                  {/* Distance and Actions */}
                                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                      <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                        {distance}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Link
                                        href={`/workers/${w.id}`}
                                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        View
                                      </Link>
                                      {w.role === "WORKER" ? (
                                        <BookWorkerButton
                                          workerId={w.id}
                                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                        />
                                      ) : (
                                        <span className="text-xs text-red-500 px-2 py-1">
                                          Invalid role: {w.role}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        />
                      ) : (
                        <div
                          className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                            viewMode === "grid"
                              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                              : "grid-cols-1 max-w-4xl mx-auto"
                          }`}
                        >
                          {workers.map((worker: Worker, index: number) => {
                            const name = worker.name ?? "Professional";
                            const initial = name.charAt(0);
                            const skills =
                              worker.workerProfile?.skilledIn &&
                              worker.workerProfile!.skilledIn!.length > 0
                                ? worker.workerProfile!.skilledIn!.slice(0, 3)
                                : [];
                            const distance =
                              typeof worker.distanceKm === "number"
                                ? worker.distanceKm < 1
                                  ? `${Math.round(worker.distanceKm * 1000)} m`
                                  : `${worker.distanceKm.toFixed(1)} km`
                                : "—";
                            return (
                              <motion.div
                                key={worker.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06 }}
                              >
                                <div
                                  className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden p-3 sm:p-4 ${
                                    viewMode === "list"
                                      ? "hover:shadow-lg transition-shadow"
                                      : ""
                                  }`}
                                >
                                  <div
                                    className={`${
                                      viewMode === "grid"
                                        ? "flex flex-col gap-3"
                                        : "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                                    }`}
                                  >
                                    {/* Avatar and basic info */}
                                    <div
                                      className={`${
                                        viewMode === "grid"
                                          ? "flex items-center gap-3"
                                          : "flex items-center gap-3 flex-1 min-w-0"
                                      }`}
                                    >
                                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">
                                        {initial}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                          {name}
                                        </h3>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {worker.workerProfile
                                            ?.yearsExperience ?? 0}{" "}
                                          years experience
                                        </div>
                                      </div>
                                      {viewMode === "grid" && (
                                        <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                          {distance}
                                        </div>
                                      )}
                                    </div>

                                    {/* Skills */}
                                    <div
                                      className={`${
                                        viewMode === "grid"
                                          ? "w-full"
                                          : "flex-1 min-w-0"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                        {skills.length > 0 ? (
                                          skills.map((s: string) => (
                                            <SkillBadge key={s} skill={s} />
                                          ))
                                        ) : (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            No skills listed
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Distance and Actions */}
                                    <div
                                      className={`${
                                        viewMode === "grid"
                                          ? "flex items-center justify-between w-full"
                                          : "flex items-center gap-2 sm:gap-3 flex-shrink-0"
                                      }`}
                                    >
                                      {viewMode !== "grid" && (
                                        <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                          {distance}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Link
                                          href={`/workers/${worker.id}`}
                                          className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                          View
                                        </Link>
                                        {worker.role === "WORKER" ? (
                                          <BookWorkerButton
                                            workerId={worker.id}
                                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
                                          />
                                        ) : (
                                          <span className="text-xs text-red-500 px-2 py-1">
                                            Invalid role: {worker.role}
                                          </span>
                                        )}
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
              </div>

              {/* Map preview (stacked below results) */}
              <div className="w-full mt-4 sm:mt-6">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Workers on Map
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See all workers in your area
                  </p>
                </div>
                <MapPreview
                  workers={workers}
                  center={coords ?? undefined}
                  height={560}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function CustomerSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
