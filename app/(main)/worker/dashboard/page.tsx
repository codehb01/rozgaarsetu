export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
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
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-muted-foreground font-normal">
              Manage your jobs and track your professional growth
            </p>
          </div>
          <Link href="/worker/job">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View Job Requests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats and Usage Tracker */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {acceptedJobs}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Jobs
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {completedJobs}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </p>
                <p className="text-2xl font-semibold text-foreground">
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
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground font-normal">
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
            <Card className="p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Job Requests
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
            <Card className="p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    View Profile
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
            <Card className="p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Settings
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
            <Card className="p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Earnings
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Recent Jobs
            </h2>
            <p className="mt-1 text-sm text-muted-foreground font-normal">
              Your latest job activities
            </p>
          </div>
          <Link
            href="/worker/job"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">No jobs yet</p>
              <p className="text-sm mt-1">Job requests will appear here</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {recentJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {job.description || "Job Request"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customer: {job.customer?.name ?? "Unknown"}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      job.status === "PENDING"
                        ? "pending"
                        : job.status === "ACCEPTED"
                        ? "accepted"
                        : job.status === "COMPLETED"
                        ? "completed"
                        : "default"
                    }
                  >
                    {job.status}
                  </StatusBadge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 shrink-0" />
                    <span>
                      {new Date(job.time).toLocaleDateString()} at{" "}
                      {new Date(job.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Job Charge
                    </span>
                    <span className="text-xl font-bold text-foreground">
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
