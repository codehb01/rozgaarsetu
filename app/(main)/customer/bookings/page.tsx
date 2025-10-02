"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewDialog } from "@/components/review-dialog";
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
} from "react-icons/fi";

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  worker: { name: string | null };
  review?: { id: string; rating: number; comment: string | null } | null;
};

type Tab = "ONGOING" | "PREVIOUS";

export default function CustomerBookingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("ONGOING");
  const [acting, setActing] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openReview = (jobId: string) => {
    setReviewJobId(jobId);
    setReviewOpen(true);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/jobs", { cache: "no-store" });
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

  // Filter and search logic
  const ongoing = jobs.filter(
    (j) =>
      j.status === "PENDING" ||
      j.status === "ACCEPTED" ||
      j.status === "IN_PROGRESS"
  );
  const previous = jobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "CANCELLED"
  );

  const currentList = tab === "ONGOING" ? ongoing : previous;
  const filteredList = currentList.filter(
    (job) =>
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.worker?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completeJob = async (id: string) => {
    setActing(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "COMPLETE" }),
      });
      if (res.ok) await load();
    } finally {
      setActing(null);
    }
  };

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
  const EmptyState = ({ type }: { type: "ongoing" | "previous" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="h-32 w-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <FiCalendar className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        No {type} bookings
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {type === "ongoing"
          ? "You don't have any active bookings at the moment. Find skilled workers to get started."
          : "Your completed and cancelled bookings will appear here."}
      </p>
      {type === "ongoing" && (
        <Button className="bg-blue-600 hover:bg-blue-700">
          Find Workers
        </Button>
      )}
    </motion.div>
  );

  const list = filteredList;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your service bookings
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Segmented Control Tabs */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex">
            {(["ONGOING", "PREVIOUS"] as Tab[]).map((tabOption) => (
              <button
                key={tabOption}
                onClick={() => setTab(tabOption)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === tabOption
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tabOption === "ONGOING" ? "Ongoing" : "Previous"}
                <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {tabOption === "ONGOING" ? ongoing.length : previous.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
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
                <EmptyState type={tab === "ONGOING" ? "ongoing" : "previous"} />
              )}
            </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((j) => (
              <Card
                key={j.id}
                className="p-6 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-gray-900 dark:text-white font-medium">
                      {j.description}
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        j.status === "ACCEPTED"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : j.status === "PENDING"
                          ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
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
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Worker: {j.worker?.name || "Worker"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    At: {new Date(j.time).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Location: {j.location}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    Charge: ₹{j.charge.toFixed(2)}
                  </div>
                  {j.details && (
                    <div className="text-sm text-gray-700 dark:text-gray-200 mt-2 line-clamp-3">
                      {j.details}
                    </div>
                  )}
                </div>
                {tab === "ONGOING" && j.status === "ACCEPTED" && (
                  <div className="mt-4">
                    <Button
                      disabled={acting === j.id}
                      onClick={() => completeJob(j.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                    >
                      {acting === j.id ? "Completing..." : "Done"}
                    </Button>
                  </div>
                )}
                {tab === "PREVIOUS" &&
                  j.status === "COMPLETED" &&
                  !j.review && (
                    <div className="mt-4">
                      <Button
                        onClick={() => openReview(j.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white w-full"
                      >
                        Review
                      </Button>
                    </div>
                  )}
                {tab === "PREVIOUS" && j.status === "COMPLETED" && j.review && (
                  <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                      Rated {j.review.rating}/5
                    </span>
                    {j.review.comment && (
                      <span className="line-clamp-1">“{j.review.comment}”</span>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
        </AnimatePresence>
      </div>

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        jobId={reviewJobId}
        onSubmitted={load}
      />
    </main>
  );
}
