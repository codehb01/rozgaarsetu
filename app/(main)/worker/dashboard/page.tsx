import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  Briefcase,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Settings,
  ArrowRight,
  Star,
  MapPin,
  Users,
  Wrench,
  Award,
  Target,
} from "lucide-react";

export default async function WorkerDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Please sign in to access your dashboard.
        </div>
      </main>
    );
  }

  const worker = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { workerProfile: true },
  });

  if (!worker || worker.role !== "WORKER") {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Worker access required.
        </div>
      </main>
    );
  }

  // Fetch job statistics
  const [totalJobs, pendingJobs, completedJobs, recentJobs] = await Promise.all(
    [
      prisma.job.count({ where: { workerId: worker.id } }),
      prisma.job.count({ where: { workerId: worker.id, status: "PENDING" } }),
      prisma.job.count({ where: { workerId: worker.id, status: "COMPLETED" } }),
      prisma.job.findMany({
        where: { workerId: worker.id },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]
  );

  // Calculate total earnings from completed jobs
  const completedJobsWithEarnings = await prisma.job.findMany({
    where: { workerId: worker.id, status: "COMPLETED" },
    select: { charge: true },
  });
  const totalEarnings = completedJobsWithEarnings.reduce(
    (sum, job) => sum + job.charge,
    0
  );

  const acceptedJobs = await prisma.job.count({
    where: { workerId: worker.id, status: "ACCEPTED" },
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage your jobs and track your professional growth
            </p>
          </div>
          <Link href="/worker/job">
            <Button className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-sm">
              View Job Requests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats and Usage Tracker */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Jobs
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {acceptedJobs}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Jobs
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {completedJobs}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Earnings
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₹{totalEarnings.toFixed(0)}
                </p>
              </div>
            </div>
          </Card>

          {/* Usage Tracker removed */}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your professional activities
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link
            href="/worker/job"
            aria-label="View Job Requests"
            className="group block"
          >
            <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Job Requests
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {pendingJobs} pending
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link
            href={`/workers/${worker.id}`}
            aria-label="View Public Profile"
            className="group block"
          >
            <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    View Profile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Public view
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link
            href="/worker/profile"
            aria-label="Profile Settings"
            className="group block"
          >
            <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Settings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update profile
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link
            href="/worker/earnings"
            aria-label="View Earnings"
            className="group block"
          >
            <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Earnings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    View details
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Jobs Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Jobs
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Your latest job activities
            </p>
          </div>
          <Link
            href="/worker/job"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <Card className="p-8 text-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No jobs yet</p>
              <p className="text-sm mt-1">Job requests will appear here</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {recentJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {job.description || "Job Request"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Customer: {job.customer?.name ?? "Unknown"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      job.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                        : job.status === "ACCEPTED"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        : job.status === "COMPLETED"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {new Date(job.time).toLocaleDateString()} at{" "}
                      {new Date(job.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Job Charge
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{job.charge.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
