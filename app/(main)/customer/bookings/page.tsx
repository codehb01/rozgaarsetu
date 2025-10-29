"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewDialog } from "@/components/review-dialog";
import ScrollList from "@/components/ui/scroll-list";
import Link from "next/link";
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
  FiCreditCard,
  FiLock,
} from "react-icons/fi";
import ClickSpark from "@/components/ClickSpark";
import { toast } from "sonner";
import Script from "next/script";

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  platformFee?: number | null;
  workerEarnings?: number | null;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  worker: { name: string | null };
  review?: { id: string; rating: number; comment: string | null } | null;
};

type Tab = "ONGOING" | "PREVIOUS";

type RazorpayOrder = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export default function CustomerBookingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("ONGOING");
  const [acting, setActing] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "scroll">(
    "scroll"
  );
  const [paymentJobId, setPaymentJobId] = useState<string | null>(null);
  const [razorpayOrder, setRazorpayOrder] = useState<RazorpayOrder | null>(
    null
  );
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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
    setPaymentJobId(id);
    try {
      // Step 1: Create Razorpay order
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "COMPLETE" }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to initiate payment");
        return;
      }

      const data = await res.json();

      if (data.requiresPayment && data.razorpayOrder) {
        setRazorpayOrder(data.razorpayOrder);
        toast.info("Opening payment gateway...");
      } else {
        toast.success("Job completed successfully!");
        await load();
      }
    } catch (error) {
      console.error("Complete job error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setActing(null);
    }
  };

  // Process payment with Razorpay
  const processPayment = (job: Job) => {
    if (!razorpayOrder || !razorpayLoaded) {
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    setPaymentProcessing(true);

    const options = {
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "RozgaarSetu",
      description: `Payment for ${job.description}`,
      order_id: razorpayOrder.orderId,
      handler: async function (response: any) {
        // Payment successful - verify on backend
        try {
          const verifyRes = await fetch(`/api/jobs/${job.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            toast.success("Payment successful! Job completed.");
            setPaymentJobId(null);
            setRazorpayOrder(null);
            await load();
          } else {
            const data = await verifyRes.json();
            toast.error(data.error || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Failed to verify payment. Please contact support.");
        } finally {
          setPaymentProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          toast.info(
            "Payment cancelled. You can retry by clicking the button again."
          );
          setPaymentProcessing(false);
          // Don't clear razorpayOrder or paymentJobId - allow retry
        },
      },
      prefill: {
        name: job.worker?.name || "Customer",
      },
      theme: {
        color: "#7c3aed",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Auto-open payment modal when order is ready
  useEffect(() => {
    if (razorpayOrder && razorpayLoaded && paymentJobId) {
      const job = jobs.find((j) => j.id === paymentJobId);
      if (job) {
        processPayment(job);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [razorpayOrder, razorpayLoaded, paymentJobId]);

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
        <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={25}>
          <Link href="/customer/search">
            {" "}
            <Button className="bg-blue-600 hover:bg-blue-700">
              Find Workers
            </Button>
          </Link>
        </ClickSpark>
      )}
    </motion.div>
  );

  const list = filteredList;

  return (
    <>
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error("Failed to load payment system")}
      />

      <main className="min-h-screen bg-white dark:bg-black">
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
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-1 flex border border-gray-200 dark:border-gray-800">
              {(["ONGOING", "PREVIOUS"] as Tab[]).map((tabOption) => (
                <button
                  key={tabOption}
                  onClick={() => setTab(tabOption)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tab === tabOption
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tabOption === "ONGOING" ? "Ongoing" : "Previous"}
                  <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
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
                className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800"
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
                  <EmptyState
                    type={tab === "ONGOING" ? "ongoing" : "previous"}
                  />
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
                          Worker: {j.worker?.name || "Worker"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
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
                            Total Charge
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
                    </div>

                    {/* Action Buttons Section */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      {tab === "ONGOING" && j.status === "IN_PROGRESS" && (
                        <div className="space-y-2">
                          <Button
                            disabled={acting === j.id || paymentProcessing}
                            onClick={() => completeJob(j.id)}
                            className="bg-purple-600 hover:bg-purple-500 text-white w-full"
                          >
                            {acting === j.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                Initiating Payment...
                              </>
                            ) : (
                              <>
                                <FiCreditCard className="h-4 w-4 mr-2 inline" />
                                Complete & Pay ₹{j.charge.toFixed(2)}
                              </>
                            )}
                          </Button>
                          {j.platformFee && j.workerEarnings && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex justify-between">
                                <span>Worker Earnings:</span>
                                <span className="font-medium">
                                  ₹{j.workerEarnings.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee (10%):</span>
                                <span className="font-medium">
                                  ₹{j.platformFee.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {tab === "ONGOING" &&
                        (j.status === "PENDING" || j.status === "ACCEPTED") && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <FiClock className="h-5 w-5" />
                              <span className="text-sm font-medium">
                                {j.status === "PENDING"
                                  ? "Waiting for worker to accept"
                                  : "Worker accepted - waiting to start work"}
                              </span>
                            </div>
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
                      {tab === "PREVIOUS" &&
                        j.status === "COMPLETED" &&
                        j.review && (
                          <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                              Rated {j.review.rating}/5
                            </span>
                            {j.review.comment && (
                              <span className="line-clamp-1">
                                &ldquo;{j.review.comment}&rdquo;
                              </span>
                            )}
                          </div>
                        )}
                    </div>
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
                          Worker: {j.worker?.name || "Worker"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
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
                            Total Charge
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
                    </div>

                    {/* Action Buttons Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      {tab === "ONGOING" && j.status === "IN_PROGRESS" && (
                        <div className="space-y-2">
                          <Button
                            disabled={acting === j.id || paymentProcessing}
                            onClick={() => completeJob(j.id)}
                            className="bg-purple-600 hover:bg-purple-500 text-white w-full"
                          >
                            {acting === j.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                                Initiating Payment...
                              </>
                            ) : (
                              <>
                                <FiCreditCard className="h-4 w-4 mr-2 inline" />
                                Complete & Pay ₹{j.charge.toFixed(2)}
                              </>
                            )}
                          </Button>
                          {j.platformFee && j.workerEarnings && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex justify-between">
                                <span>Worker Earnings:</span>
                                <span className="font-medium">
                                  ₹{j.workerEarnings.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee (10%):</span>
                                <span className="font-medium">
                                  ₹{j.platformFee.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {tab === "ONGOING" &&
                        (j.status === "PENDING" || j.status === "ACCEPTED") && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <FiClock className="h-5 w-5" />
                              <span className="text-sm font-medium">
                                {j.status === "PENDING"
                                  ? "Waiting for worker to accept"
                                  : "Worker accepted - waiting to start work"}
                              </span>
                            </div>
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
                      {tab === "PREVIOUS" &&
                        j.status === "COMPLETED" &&
                        j.review && (
                          <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                              Rated {j.review.rating}/5
                            </span>
                            {j.review.comment && (
                              <span className="line-clamp-1">
                                “{j.review.comment}”
                              </span>
                            )}
                          </div>
                        )}
                    </div>
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
    </>
  );
}
