"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { EarningsSkeleton } from "@/components/ui/dashboard-skeleton";

type EarningsData = {
  total: number;
  thisMonth: number;
  lastMonth: number;
  jobs: {
    id: string;
    description: string;
    charge: number;
    date: string;
    customer: string;
  }[];
};

export default function WorkerEarningsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EarningsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/worker/earnings", {
          cache: "no-store"
        });
        
        if (!response.ok) {
          throw new Error("Failed to load earnings data");
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error loading earnings:", err);
        setError(err instanceof Error ? err.message : "Failed to load earnings");
      } finally {
        setIsLoading(false);
      }
    };

    loadEarnings();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-5xl px-6 py-10">
          <EarningsSkeleton />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-light text-white mb-6">Earnings</h1>
          <div className="text-red-400">Error: {error}</div>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-3xl font-light text-white mb-6">Earnings</h1>
          <div className="text-gray-400">No earnings data available</div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-light text-white mb-8">Earnings Overview</h1>
        
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          {/* Total Earnings */}
          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ₹{data.total.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </Card>

          {/* This Month */}
          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">This Month</p>
                <p className="text-2xl font-bold text-blue-400">
                  ₹{data.thisMonth.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Current month</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </Card>

          {/* Last Month */}
          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Month</p>
                <p className="text-2xl font-bold text-gray-400">
                  ₹{data.lastMonth.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Previous month</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </Card>
        </div>

        {/* Recent Earnings */}
        <Card className="border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Completed Jobs</h2>
          {data.jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">No completed jobs yet</div>
            </div>
          ) : (
            <div className="space-y-3">
              {data.jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600/50"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {job.description}
                    </div>
                    <div className="text-sm text-gray-400">
                      Customer: {job.customer} •{" "}
                      {new Date(job.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-400">
                      ₹{job.charge.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
