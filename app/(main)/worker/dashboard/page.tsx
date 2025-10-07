import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TranslatedText } from "@/components/translation/auto-translate";
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
  MapPin
} from "lucide-react";

export default async function WorkerDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          <TranslatedText context="worker-dashboard">Please sign in to access your dashboard.</TranslatedText>
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400"><TranslatedText context="worker-dashboard">Worker access required.</TranslatedText></div>
      </main>
    );
  }

  // Fetch job statistics
  const [totalJobs, pendingJobs, completedJobs, recentJobs] = await Promise.all([
    prisma.job.count({ where: { workerId: worker.id } }),
    prisma.job.count({ where: { workerId: worker.id, status: "PENDING" } }),
    prisma.job.count({ where: { workerId: worker.id, status: "COMPLETED" } }),
    prisma.job.findMany({
      where: { workerId: worker.id },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

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
    <main className="min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          <TranslatedText context="worker-dashboard">Welcome back</TranslatedText>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          <TranslatedText context="worker-dashboard">Manage your jobs and track your professional growth</TranslatedText>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400"><TranslatedText context="worker-dashboard">Active Jobs</TranslatedText></p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{acceptedJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Briefcase className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400"><TranslatedText context="worker-dashboard">Completed Jobs</TranslatedText></p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Star className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400"><TranslatedText context="worker-dashboard">Avg Rating Given</TranslatedText></p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">4.8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Earnings Section */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1"><TranslatedText context="worker-dashboard">Total Earnings</TranslatedText></h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <TranslatedText context="worker-dashboard">From</TranslatedText> {completedJobs} <TranslatedText context="worker-dashboard">completed jobs</TranslatedText>
            </p>
          </div>
          <Link href="/worker/earnings">
            <Button 
              variant="ghost" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <TranslatedText context="worker-dashboard">View Details</TranslatedText>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white"><TranslatedText context="worker-dashboard">Quick Actions</TranslatedText></h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/worker/job" className="group">
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <Calendar className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white"><TranslatedText context="worker-dashboard">Job Requests</TranslatedText></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><TranslatedText context="worker-dashboard">View pending requests</TranslatedText></p>
              </div>
            </Card>
          </Link>

          <Link href={`/workers/${worker.id}`} className="group">
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <Eye className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white"><TranslatedText context="worker-dashboard">View Profile</TranslatedText></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><TranslatedText context="worker-dashboard">See your public profile</TranslatedText></p>
              </div>
            </Card>
          </Link>

          <Link href="/worker/profile" className="group">
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className="text-center">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-12 h-12 mx-auto mb-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white"><TranslatedText context="worker-dashboard">Settings</TranslatedText></p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><TranslatedText context="worker-dashboard">Update preferences</TranslatedText></p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white"><TranslatedText context="worker-dashboard">Recent Jobs</TranslatedText></h2>
          <Link href="/worker/job">
            <Button 
              variant="ghost" 
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <TranslatedText context="worker-dashboard">View All</TranslatedText>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <Card className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
            <div className="text-gray-500 dark:text-gray-400"><TranslatedText context="worker-dashboard">No jobs yet</TranslatedText></div>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              <TranslatedText context="worker-dashboard">Job requests will appear here</TranslatedText>
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {job.description}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Customer: {job.customer?.name ?? "Unknown"}</p>
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </p>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.time).toLocaleDateString()} at{" "}
                        {new Date(job.time).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
                      ₹{job.charge.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : job.status === "ACCEPTED"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        : job.status === "COMPLETED"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
