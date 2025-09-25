"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewDialog } from "@/components/review-dialog";

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  worker: { name: string | null };
  review?: { id: string; rating: number; comment: string | null } | null;
};

export default function CustomerBookingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ONGOING" | "PREVIOUS">("ONGOING");
  const [acting, setActing] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);

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

  const ongoing = jobs.filter(
    (j) =>
      j.status === "PENDING" ||
      j.status === "ACCEPTED" ||
      j.status === "IN_PROGRESS"
  );
  const previous = jobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "CANCELLED"
  );

  const completeJob = async (id: string) => {
    setActing(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "COMPLETE" }),
      });
      if (res.ok) await load();
    } finally {
      setActing(null);
    }
  };

  const list = tab === "ONGOING" ? ongoing : previous;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-light text-white">My Bookings</h1>
          <div className="flex gap-2" role="tablist" aria-label="Bookings Tabs">
            <Badge
              role="tab"
              aria-selected={tab === "ONGOING"}
              tabIndex={0}
              onClick={() => setTab("ONGOING")}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTab("ONGOING");
                }
              }}
              className={`cursor-pointer select-none px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                tab === "ONGOING"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Ongoing ({ongoing.length})
            </Badge>
            <Badge
              role="tab"
              aria-selected={tab === "PREVIOUS"}
              tabIndex={0}
              onClick={() => setTab("PREVIOUS")}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTab("PREVIOUS");
                }
              }}
              className={`cursor-pointer select-none px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                tab === "PREVIOUS"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Previous ({previous.length})
            </Badge>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : list.length === 0 ? (
          <div className="text-gray-400">
            No {tab === "ONGOING" ? "ongoing" : "previous"} bookings.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((j) => (
              <Card
                key={j.id}
                className="border-gray-800 bg-gray-800/50 p-5 flex flex-col"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
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
                    Worker: {j.worker?.name || "Worker"}
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
                </div>
                {tab === "ONGOING" && j.status === "ACCEPTED" && (
                  <div className="mt-4">
                    <Button
                      disabled={acting === j.id}
                      onClick={() => completeJob(j.id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                    >
                      {acting === j.id ? "Completing..." : "Done"}
                    </Button>
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
                {tab === "PREVIOUS" && j.status === "COMPLETED" && j.review && (
                  <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-gray-700 text-gray-300">
                      Rated {j.review.rating}/5
                    </span>
                    {j.review.comment && (
                      <span className="line-clamp-1">“{j.review.comment}”</span>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        jobId={reviewJobId}
        onSubmitted={load}
      />
    </main>
  );
}
