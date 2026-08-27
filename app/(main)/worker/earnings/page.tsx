"use client";
export const dynamic = "force-dynamic";

import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkerEarningsQuery } from "@/hooks/api/use-worker";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiActivity,
  FiClock,
} from "react-icons/fi";
import { IndianRupee } from "lucide-react";

type EarningsData = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  monthlyChange: number;
  jobs: {
    id: string;
    description: string;
    charge: number;
    date: string;
    customer: string;
  }[];
};

export default function WorkerEarningsPage() {
  const { data, isLoading: loading, refetch } = useWorkerEarningsQuery();

  // Skeleton loader component
  const SkeletonCard = () => (
    <Card className="p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-muted dark:bg-muted rounded w-24"></div>
        <div className="h-8 bg-muted dark:bg-muted rounded w-32"></div>
        <div className="h-3 bg-muted dark:bg-muted rounded w-28"></div>
      </div>
    </Card>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="h-32 w-32 mx-auto bg-muted dark:bg-muted rounded-full flex items-center justify-center mb-6">
        <FiBarChart2 className="h-16 w-16 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground dark:text-foreground mb-2">
        No earnings yet
      </h3>
      <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-md mx-auto">
        Complete jobs to start earning. Your earnings will be tracked here.
      </p>
    </motion.div>
  );

  const changeColor =
    data?.monthlyChange && data.monthlyChange >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  const changeBgColor =
    data?.monthlyChange && data.monthlyChange >= 0
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-red-50 dark:bg-red-900/20";

  return (
    <main className="min-h-screen bg-background dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground dark:text-foreground mb-2">
            Earnings Analytics
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Track your income and completed jobs
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Overview Cards Skeleton */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>

              {/* Job Breakdown Skeleton */}
              <Card className="p-6">
                <div className="h-6 bg-muted dark:bg-muted rounded w-48 mb-6"></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center justify-between p-4 rounded-lg bg-muted dark:bg-muted"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted dark:bg-muted rounded w-48"></div>
                        <div className="h-4 bg-muted dark:bg-muted rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-muted dark:bg-muted rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : !data ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="h-32 w-32 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <FiActivity className="h-16 w-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-medium text-foreground dark:text-foreground mb-2">
                Failed to load earnings data
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground mb-6">
                There was an error loading your earnings. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Overview Cards */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {/* Total Earnings Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-card dark:bg-card border-border dark:border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                          Total Earnings
                        </p>
                        <h3 className="text-3xl font-bold text-foreground dark:text-foreground">
                          ₹{data.total.toFixed(2)}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      All completed jobs
                    </p>
                  </Card>
                </motion.div>

                {/* This Month Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-card dark:bg-card border-border dark:border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                          This Month
                        </p>
                        <h3 className="text-3xl font-bold text-foreground dark:text-foreground">
                          ₹{data.thisMonth.toFixed(2)}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <FiCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      Current month earnings
                    </p>
                  </Card>
                </motion.div>

                {/* Monthly Change Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-card dark:bg-card border-border dark:border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                          Monthly Change
                        </p>
                        <div className="flex items-center gap-2">
                          {data.monthlyChange >= 0 ? (
                            <FiTrendingUp
                              className={`h-6 w-6 ${changeColor}`}
                            />
                          ) : (
                            <FiTrendingDown
                              className={`h-6 w-6 ${changeColor}`}
                            />
                          )}
                          <h3 className={`text-3xl font-bold ${changeColor}`}>
                            {Math.abs(data.monthlyChange).toFixed(1)}%
                          </h3>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl ${changeBgColor} flex items-center justify-center`}
                      >
                        {data.monthlyChange >= 0 ? (
                          <FiTrendingUp className={`h-6 w-6 ${changeColor}`} />
                        ) : (
                          <FiTrendingDown
                            className={`h-6 w-6 ${changeColor}`}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                      vs last month (₹{data.lastMonth.toFixed(2)})
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Job Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground dark:text-foreground">
                        Job-by-Job Breakdown
                      </h2>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">
                        {data.jobs.length} completed{" "}
                        {data.jobs.length === 1 ? "job" : "jobs"}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-muted dark:bg-muted flex items-center justify-center">
                      <FiBarChart2 className="h-5 w-5 text-muted-foreground dark:text-muted-foreground" />
                    </div>
                  </div>

                  {data.jobs.length === 0 ? (
                    <div className="py-12">
                      <EmptyState />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.jobs.map((job: { id: string; description: string; charge: number; date: string; customer: string }, index: number) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between p-4 rounded-lg bg-muted dark:bg-muted border border-border dark:border-border hover:shadow-md hover:border-border dark:hover:border-border transition-all duration-200">
                            <div className="flex-1 flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                                <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-foreground dark:text-foreground mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {job.description}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <FiUser className="h-3 w-3" />
                                    <span>{job.customer}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <FiClock className="h-3 w-3" />
                                    <span>
                                      {new Date(job.date).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                ₹{job.charge.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Summary Card */}
              {data.jobs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                          <FiBarChart2 className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            Average Earning per Job
                          </p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ₹{(data.total / data.jobs.length).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">
                          Total Jobs Completed
                        </p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {data.jobs.length}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
