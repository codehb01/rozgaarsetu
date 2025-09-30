"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";

interface Worker {
  id: string;
  name: string;
  role: string;
  workerProfile: {
    skilledIn: string[];
    city: string;
    yearsExperience: number;
    profilePic: string | null;
    bio?: string;
    qualification?: string;
  } | null;
}

interface Job {
  id: string;
  description: string;
  charge: number;
  status: string;
  createdAt: string;
  customer: {
    name: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    name: string;
  };
}

interface Stats {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  inProgressJobs: number;
  totalEarnings: number;
  recentJobs: Job[];
  recentReviews: Review[];
}

export default function WorkerHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    totalEarnings: 0,
    recentJobs: [],
    recentReviews: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/worker/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWorker(data.worker);
        setStats(data.stats);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-gray-600 dark:text-gray-400">
          Please sign in to access your dashboard.
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { title: "Total Jobs", value: stats.totalJobs?.toString() || "0", emoji: "💼", color: "#2563eb" },
    { title: "Pending Requests", value: stats.pendingJobs?.toString() || "0", emoji: "⏳", color: "#f59e0b" },
    { title: "In Progress", value: stats.inProgressJobs?.toString() || "0", emoji: "🔄", color: "#8b5cf6" },
    { title: "Completed Jobs", value: stats.completedJobs?.toString() || "0", emoji: "✅", color: "#22c55e" },
    { title: "Total Earnings", value: `₹${stats.totalEarnings?.toLocaleString() || "0"}`, emoji: "💰", color: "#059669" },
  ];

  const quickActions = [
    { title: "Job Requests", description: "View and manage job requests", emoji: "📅", href: "/worker/jobs" },
    { title: "View Earnings", description: "Check your earnings and payments", emoji: "💰", href: "/worker/earnings" },
    { title: "View Profile", description: "See your public profile", emoji: "👁️", href: "/worker/profile" },
    { title: "Reviews", description: "Check customer reviews", emoji: "⭐", href: "/worker/reviews" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {worker.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back, <span className="text-green-600">{worker.name}</span>
                </h1>
                {worker.workerProfile && (
                  <div className="space-y-2">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      📍 {worker.workerProfile.city} • 
                      💼 {worker.workerProfile.yearsExperience} years experience
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {worker.workerProfile.skilledIn.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    {worker.workerProfile.qualification && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🎓 {worker.workerProfile.qualification}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  Manage your jobs, track earnings, and grow your professional career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
              Your Statistics
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Overview of your work performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {dashboardStats.map(({ title, value, emoji }) => (
              <div key={title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                  </div>
                  <div className="text-3xl">{emoji}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Earnings Card */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total Earnings
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  ₹{stats.totalEarnings?.toFixed(2) || "0.00"}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  From {stats.completedJobs || 0} completed jobs
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your work efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map(({ title, description, emoji, href }) => (
              <Link key={title} href={href} className="block group">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg hover:scale-105">
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Jobs */}
        <section>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
                Recent Jobs
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your latest job requests and completions
              </p>
            </div>
            <Link 
              href="/worker/jobs"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              View All Jobs
            </Link>
          </div>

          {(stats.recentJobs || []).length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
              <div className="text-gray-600 dark:text-gray-400 text-xl mb-2">No jobs yet</div>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Job requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(stats.recentJobs || []).map((job: any) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
                        {job.title || job.description || "Job Title"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        Customer: {job.customer?.name ?? "Unknown"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        📅 {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Date not available"}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ₹{(job.charge || 0).toLocaleString()}
                      </p>
                      {job.details && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 italic">
                          {job.details}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === "PENDING" ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        job.status === "ACCEPTED" ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        job.status === "COMPLETED" ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
