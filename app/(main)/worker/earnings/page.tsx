"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TranslatedText } from "@/components/translation/auto-translate";

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
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worker/earnings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load earnings");
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-gray-400"><TranslatedText context="worker-earnings">Loading earnings...</TranslatedText></div>
        </section>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="text-gray-400"><TranslatedText context="worker-earnings">Failed to load earnings data.</TranslatedText></div>
        </section>
      </main>
    );
  }

  const changeColor =
    data.monthlyChange >= 0 ? "text-emerald-400" : "text-red-400";
  const changeIcon = data.monthlyChange >= 0 ? "↗" : "↘";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-light text-white mb-8">
          <TranslatedText context="worker-earnings">Earnings Analytics</TranslatedText>
        </h1>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="text-gray-400 text-sm mb-1"><TranslatedText context="worker-earnings">Total Earnings</TranslatedText></div>
            <div className="text-3xl font-bold text-white">
              ₹{data.total.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1"><TranslatedText context="worker-earnings">All completed jobs</TranslatedText></div>
          </Card>

          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="text-gray-400 text-sm mb-1"><TranslatedText context="worker-earnings">This Month</TranslatedText></div>
            <div className="text-3xl font-bold text-white">
              ₹{data.thisMonth.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <TranslatedText context="worker-earnings">Current month earnings</TranslatedText>
            </div>
          </Card>

          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="text-gray-400 text-sm mb-1"><TranslatedText context="worker-earnings">Monthly Change</TranslatedText></div>
            <div
              className={`text-3xl font-bold ${changeColor} flex items-center gap-1`}
            >
              <span>{changeIcon}</span>
              <span>{Math.abs(data.monthlyChange).toFixed(1)}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <TranslatedText context="worker-earnings">vs last month</TranslatedText> (₹{data.lastMonth.toFixed(2)})
            </div>
          </Card>
        </div>

        {/* Job Breakdown */}
        <Card className="border-gray-800 bg-gray-800/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <TranslatedText context="worker-earnings">Job-by-Job Breakdown</TranslatedText>
          </h2>
          {data.jobs.length === 0 ? (
            <div className="text-gray-400"><TranslatedText context="worker-earnings">No completed jobs yet.</TranslatedText></div>
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
                      <TranslatedText context="worker-earnings">Customer</TranslatedText>: {job.customer} •{" "}
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
