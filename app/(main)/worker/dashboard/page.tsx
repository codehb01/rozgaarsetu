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
} from "lucide-react";

export default async function WorkerDashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">
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
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Worker access required.</div>
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

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs.toString(),
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pending Requests",
      value: pendingJobs.toString(),
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Active Jobs",
      value: acceptedJobs.toString(),
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Completed Jobs",
      value: completedJobs.toString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-lime-500",
    },
  ];

  const quickActions = [
    {
      title: "Job Requests",
      description: "View and manage job requests",
      icon: Calendar,
      href: "/worker/job",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "View Profile",
      description: "See your public profile",
      icon: Eye,
      href: `/workers/${worker.id}`,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Settings",
      description: "Update your preferences",
      icon: Settings,
      href: "/worker/settings",
      gradient: "from-gray-500 to-slate-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight">
              Welcome Back,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 font-light">
                {worker.name}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
              Manage your jobs, track earnings, and grow your professional
              career.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
            Your Statistics
          </h2>
          <p className="text-gray-400 text-base">
            Overview of your work performance
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map(({ title, value, icon: Icon, gradient }) => (
            <Card
              key={title}
              className="border-0 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {value}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Earnings Card */}
        <Card className="border-0 bg-white/[0.03] backdrop-blur-xl mb-12">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Total Earnings
                </h3>
                <p className="text-3xl font-bold text-emerald-400">
                  ₹{totalEarnings.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  From {completedJobs} completed jobs
                </p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
            Quick Actions
          </h2>
          <p className="text-gray-400 text-base mb-8">
            Manage your work efficiently
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map(
              ({ title, description, icon: Icon, href, gradient }) => (
                <Link key={title} href={href} className="group block">
                  <Card className="border-0 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 h-full">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                          <div
                            className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40`}
                          />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-white group-hover:text-gray-100 transition-colors">
                            {title}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed px-2">
                            {description}
                          </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                          <div className="inline-flex items-center text-sm text-emerald-400 font-medium">
                            Go to {title.toLowerCase()}
                            <svg
                              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">
                Recent Jobs
              </h2>
              <p className="text-gray-400 text-base">
                Your latest job requests and completions
              </p>
            </div>
            <Link href="/worker/job">
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
                View All Jobs
              </Button>
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <Card className="border-0 bg-white/[0.03] backdrop-blur-xl p-8 text-center">
              <div className="text-gray-400 text-lg">No jobs yet</div>
              <p className="text-gray-500 text-sm mt-2">
                Job requests will appear here
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentJobs.map((job) => (
                <Card
                  key={job.id}
                  className="border-0 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {job.description}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          Customer: {job.customer?.name ?? "Unknown"}
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                          Date: {new Date(job.time).toLocaleDateString()} at{" "}
                          {new Date(job.time).toLocaleTimeString()}
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                          Location: {job.location}
                        </p>
                        <p className="text-emerald-400 font-semibold">
                          ₹{job.charge.toFixed(2)}
                        </p>
                        {job.details && (
                          <p className="text-gray-300 text-sm mt-2 italic">
                            {job.details}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : job.status === "ACCEPTED"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : job.status === "COMPLETED"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
