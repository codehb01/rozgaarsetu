"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobCardSkeleton } from "@/components/ui/dashboard-skeleton";

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  customer: { name: string | null };
  review?: { rating: number; comment: string | null } | null;
};

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"CURRENT" | "PREVIOUS">("CURRENT");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/worker/jobs", { cache: "no-store" });
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

  const act = async (id: string, action: "ACCEPT" | "REJECT") => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) load();
  };

  const currentJobs = jobs.filter(j => 
    j.status === "PENDING" || j.status === "ACCEPTED" || j.status === "IN_PROGRESS"
  );
  const previousJobs = jobs.filter(j => 
    j.status === "COMPLETED" || j.status === "CANCELLED"
  );

  const displayJobs = tab === "CURRENT" ? currentJobs : previousJobs;

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="min-h-screen">
        <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">Job Requests</h1>
          <div className="flex gap-2">
            <Button
              variant={tab === "CURRENT" ? "default" : "outline"}
              onClick={() => setTab("CURRENT")}
              className={tab === "CURRENT" ? "bg-blue-600 text-white" : "text-gray-300 border-gray-600"}
            >
              Current ({currentJobs.length})
            </Button>
            <Button
              variant={tab === "PREVIOUS" ? "default" : "outline"}
              onClick={() => setTab("PREVIOUS")}
              className={tab === "PREVIOUS" ? "bg-blue-600 text-white" : "text-gray-300 border-gray-600"}
            >
              Previous ({previousJobs.length})
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : displayJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {tab === "CURRENT" ? "No current jobs." : "No previous jobs."}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayJobs.map((j) => (
              <Card key={j.id} className="border-gray-800 bg-gray-800/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-white font-medium">
                        {j.description}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          j.status === "ACCEPTED"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : j.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
                            : j.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            : j.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-300 border-red-500/30"
                            : "bg-gray-600/20 text-gray-300 border-gray-600/40"
                        }`}
                      >
                        {j.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Customer: {j.customer?.name || "Customer"}
                    </div>
                    <div className="text-sm text-gray-400">
                      At: {new Date(j.time).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Location: {j.location}
                    </div>
                    <div className="text-sm text-gray-400">
                      Charge: ₹{j.charge.toFixed(2)}
                    </div>
                    {j.details && (
                      <div className="text-sm text-gray-300 mt-2 line-clamp-3">
                        {j.details}
                      </div>
                    )}
                    {tab === "PREVIOUS" &&
                      j.status === "COMPLETED" &&
                      j.review && (
                        <div className="mt-3 text-xs text-gray-300 flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1">
                            Rating: {"★".repeat(j.review.rating)}
                            {"☆".repeat(5 - j.review.rating)}
                          </span>
                          {j.review.comment && (
                            <span className="line-clamp-2 italic text-gray-400">
                              "{j.review.comment}"
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-2">
                    {j.status === "PENDING" ? (
                      <>
                        <Button
                          onClick={() => act(j.id, "ACCEPT")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => act(j.id, "REJECT")}
                          className="bg-red-600 hover:bg-red-500 text-white"
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        </section>
      </main>
    </div>
  );
}
