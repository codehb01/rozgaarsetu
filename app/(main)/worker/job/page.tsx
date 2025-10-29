"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScrollList from "@/components/ui/scroll-list";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiDollarSign,
  FiClock,
  FiStar,
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiPlay,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiBriefcase,
  FiCamera,
  FiNavigation,
  FiUpload,
} from "react-icons/fi";
import ClickSpark from "@/components/ClickSpark";
import { toast } from "sonner";

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  customer: { name: string | null };
  review?: { rating: number; comment: string | null } | null;
};

type Tab = "NEW" | "PREVIOUS";

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("NEW");
  const [acting, setActing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "scroll">(
    "scroll"
  );
  const [startWorkJobId, setStartWorkJobId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worker/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "ACCEPT" | "CANCEL") => {
    setActing(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        toast.success(
          action === "ACCEPT" ? "Job accepted successfully!" : "Job cancelled"
        );
        await load();
      } else {
        const data = await res.json();
        toast.error(data.error || "Action failed");
      }
    } finally {
      setActing(null);
    }
  };

  // Handle photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size must be less than 5MB");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Capture GPS location
  const captureGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
        toast.success("Location captured successfully!");
      },
      (error) => {
        setGpsLoading(false);
        toast.error(`Failed to get location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Upload photo to server
  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload photo");
    }

    const data = await res.json();
    return data.url;
  };

  // Start work with proof
  const startWork = async (jobId: string) => {
    if (!photoFile) {
      toast.error("Please upload a photo to start work");
      return;
    }

    if (!gpsCoords) {
      toast.error("Please capture your GPS location");
      return;
    }

    setActing(jobId);
    try {
      // Upload photo first
      toast.info("Uploading photo...");
      const photoUrl = await uploadPhoto(photoFile);

      // Send START action with proof
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "START",
          startProofPhoto: photoUrl,
          startProofGpsLat: gpsCoords.lat,
          startProofGpsLng: gpsCoords.lng,
        }),
      });

      if (res.ok) {
        toast.success("Work started successfully!");
        // Reset modal state
        setStartWorkJobId(null);
        setPhotoFile(null);
        setPhotoPreview(null);
        setGpsCoords(null);
        await load();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to start work");
      }
    } catch (error) {
      console.error("Start work error:", error);
      toast.error("Failed to start work. Please try again.");
    } finally {
      setActing(null);
    }
  };

  // Filter and search logic
  const newJobs = jobs.filter(
    (j) =>
      j.status === "PENDING" ||
      j.status === "ACCEPTED" ||
      j.status === "IN_PROGRESS"
  );
  const previousJobs = jobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "CANCELLED"
  );

  const currentList = tab === "NEW" ? newJobs : previousJobs;
  const filteredList = currentList.filter(
    (job) =>
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status configuration
  const getStatusConfig = (status: Job["status"]) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending",
          color: "bg-orange-500",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          textColor: "text-orange-700 dark:text-orange-300",
          icon: FiAlertCircle,
        };
      case "ACCEPTED":
        return {
          label: "Accepted",
          color: "bg-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          textColor: "text-blue-700 dark:text-blue-300",
          icon: FiCheck,
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          color: "bg-purple-500",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          textColor: "text-purple-700 dark:text-purple-300",
          icon: FiPlay,
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "bg-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          textColor: "text-green-700 dark:text-green-300",
          icon: FiCheck,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          color: "bg-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          textColor: "text-red-700 dark:text-red-300",
          icon: FiX,
        };
    }
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </Card>
  );

  // Empty state component
  const EmptyState = ({ type }: { type: "new" | "previous" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="h-32 w-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <FiBriefcase className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        No {type} jobs
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {type === "new"
          ? "You don't have any active job requests at the moment. New opportunities will appear here."
          : "Your completed and cancelled jobs will appear here."}
      </p>
    </motion.div>
  );

  const list = filteredList;

  // Start Work Modal Component
  const StartWorkModal = ({ jobId }: { jobId: string }) => {
    if (startWorkJobId !== jobId) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Start Work - Proof Required
            </h3>
            <button
              onClick={() => {
                setStartWorkJobId(null);
                setPhotoFile(null);
                setPhotoPreview(null);
                setGpsCoords(null);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Work Start Photo *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      variant="outline"
                      size="sm"
                      className="mx-auto"
                    >
                      <FiX className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <>
                    <FiCamera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Take a photo at the work location
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      <FiUpload className="h-4 w-4 mr-2" />
                      Choose Photo
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max size: 5MB. This proves you are at the work location.
              </p>
            </div>

            {/* GPS Location Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GPS Location *
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {gpsCoords ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <FiCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Location Captured
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Lat: {gpsCoords.lat.toFixed(6)}, Lng:{" "}
                      {gpsCoords.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={captureGPS}
                    disabled={gpsLoading}
                    variant="outline"
                    className="w-full"
                  >
                    <FiNavigation
                      className={`h-4 w-4 mr-2 ${
                        gpsLoading ? "animate-spin" : ""
                      }`}
                    />
                    {gpsLoading
                      ? "Getting Location..."
                      : "Capture GPS Location"}
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your exact location will be recorded for verification.
              </p>
            </div>

            {/* Warning Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex gap-3">
                <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Important Notice
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Once you start work, the job cannot be cancelled. You must
                    complete it for the customer to make payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                onClick={() => {
                  setStartWorkJobId(null);
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setGpsCoords(null);
                }}
                variant="outline"
                className="flex-1"
                disabled={acting === jobId}
              >
                Cancel
              </Button>
              <Button
                onClick={() => startWork(jobId)}
                disabled={!photoFile || !gpsCoords || acting === jobId}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white"
              >
                {acting === jobId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting...
                  </>
                ) : (
                  <>
                    <FiPlay className="h-4 w-4 mr-2" />
                    Start Work
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            My Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your job requests
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Segmented Control Tabs */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex">
            {(["NEW", "PREVIOUS"] as Tab[]).map((tabOption) => (
              <button
                key={tabOption}
                onClick={() => setTab(tabOption)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === tabOption
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tabOption === "NEW" ? "New" : "Previous"}
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {tabOption === "NEW" ? newJobs.length : previousJobs.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Grid View"
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
              title="List View"
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

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {searchQuery ? (
                <div className="text-center py-16">
                  <FiSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <EmptyState type={tab === "NEW" ? "new" : "previous"} />
              )}
            </motion.div>
          ) : viewMode === "scroll" ? (
            <ScrollList
              data={list || []}
              itemHeight={320}
              renderItem={(j, index) => (
                <Card
                  key={j.id}
                  className="p-4 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full max-w-4xl mx-auto flex flex-col overflow-hidden"
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {j.description}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Customer: {j.customer?.name || "Customer"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                        j.status === "ACCEPTED"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : j.status === "PENDING"
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          : j.status === "IN_PROGRESS"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                          : j.status === "COMPLETED"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : j.status === "CANCELLED"
                          ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 space-y-2">
                    {/* Time and Location Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Date & Time
                          </p>
                          <p className="text-xs">
                            {new Date(j.time).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Location
                          </p>
                          <p className="text-xs">{j.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Charge Section */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-7 h-7 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Charge
                        </p>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ₹{j.charge.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Details Description */}
                    {j.details && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                          Additional Details
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-200 line-clamp-2">
                          {j.details}
                        </p>
                      </div>
                    )}

                    {/* Review Section */}
                    {tab === "PREVIOUS" &&
                      j.status === "COMPLETED" &&
                      j.review && (
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                            Customer Review
                          </p>
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar
                                key={i}
                                className={`h-3 w-3 ${
                                  i < j.review!.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {j.review.rating}/5
                            </span>
                          </div>
                          {j.review.comment && (
                            <p className="text-xs text-gray-700 dark:text-gray-200 italic line-clamp-2">
                              &quot;{j.review.comment}&quot;
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Action Buttons Section */}
                  {tab === "NEW" && j.status === "PENDING" && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                      <ClickSpark
                        sparkColor="#22c55e"
                        sparkCount={10}
                        sparkRadius={20}
                      >
                        <Button
                          disabled={acting === j.id}
                          onClick={() => act(j.id, "ACCEPT")}
                          className="bg-green-600 hover:bg-green-500 text-white flex-1"
                        >
                          {acting === j.id ? "Processing..." : "Accept"}
                        </Button>
                      </ClickSpark>
                      <Button
                        disabled={acting === j.id}
                        onClick={() => act(j.id, "CANCEL")}
                        className="bg-red-600 hover:bg-red-500 text-white flex-1"
                      >
                        {acting === j.id ? "Processing..." : "Cancel"}
                      </Button>
                    </div>
                  )}
                  {tab === "NEW" && j.status === "ACCEPTED" && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        onClick={() => setStartWorkJobId(j.id)}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                      >
                        <FiPlay className="h-4 w-4 mr-2" />
                        Start Work (Photo + GPS Required)
                      </Button>
                    </div>
                  )}
                  {tab === "NEW" && j.status === "IN_PROGRESS" && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <FiPlay className="h-5 w-5 animate-pulse" />
                          <span className="text-sm font-medium">
                            Work in Progress
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          Waiting for customer to complete and make payment
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {list.map((j) => (
                <Card
                  key={j.id}
                  className="p-5 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex flex-col h-full min-h-[300px]"
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {j.description}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Customer: {j.customer?.name || "Customer"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                        j.status === "ACCEPTED"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : j.status === "PENDING"
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          : j.status === "IN_PROGRESS"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                          : j.status === "COMPLETED"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : j.status === "CANCELLED"
                          ? "bg-red-50 text-red-700 dark:text-red-300"
                          : "bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 space-y-3">
                    {/* Time and Location Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Date & Time
                          </p>
                          <p className="text-xs">
                            {new Date(j.time).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            Location
                          </p>
                          <p className="text-xs">{j.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Charge Section */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Charge
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{j.charge.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Details Description */}
                    {j.details && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                          Additional Details
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                          {j.details}
                        </p>
                      </div>
                    )}

                    {/* Review Section */}
                    {tab === "PREVIOUS" &&
                      j.status === "COMPLETED" &&
                      j.review && (
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                            Customer Review
                          </p>
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar
                                key={i}
                                className={`h-3 w-3 ${
                                  i < j.review!.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                              {j.review.rating}/5
                            </span>
                          </div>
                          {j.review.comment && (
                            <p className="text-xs text-gray-700 dark:text-gray-200 italic line-clamp-2">
                              &quot;{j.review.comment}&quot;
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Action Buttons Section */}
                  {tab === "NEW" && j.status === "PENDING" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                      <Button
                        disabled={acting === j.id}
                        onClick={() => act(j.id, "ACCEPT")}
                        className="bg-green-600 hover:bg-green-500 text-white flex-1"
                      >
                        {acting === j.id ? "Processing..." : "Accept"}
                      </Button>
                      <Button
                        disabled={acting === j.id}
                        onClick={() => act(j.id, "CANCEL")}
                        className="bg-red-600 hover:bg-red-500 text-white flex-1"
                      >
                        {acting === j.id ? "Processing..." : "Cancel"}
                      </Button>
                    </div>
                  )}
                  {tab === "NEW" && j.status === "ACCEPTED" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        onClick={() => setStartWorkJobId(j.id)}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                      >
                        <FiPlay className="h-4 w-4 mr-2" />
                        Start Work (Photo + GPS Required)
                      </Button>
                    </div>
                  )}
                  {tab === "NEW" && j.status === "IN_PROGRESS" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <FiPlay className="h-5 w-5 animate-pulse" />
                          <span className="text-sm font-medium">
                            Work in Progress
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          Waiting for customer to complete and make payment
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Start Work Modal */}
        {startWorkJobId && <StartWorkModal jobId={startWorkJobId} />}
      </div>
    </main>
  );
}
