"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TranslatedText } from "@/components/translation/auto-translate";

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
  const [tab, setTab] = useState<"NEW" | "PREVIOUS">("NEW");

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

  const newJobs = jobs.filter(
    (j) =>
      j.status === "PENDING" ||
      j.status === "ACCEPTED" ||
      j.status === "IN_PROGRESS"
  );
  const previousJobs = jobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "CANCELLED"
  );
  const list = tab === "NEW" ? newJobs : previousJobs;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-light text-white"><TranslatedText context="worker-jobs">Jobs</TranslatedText></h1>
          <div
            className="flex gap-2"
            role="tablist"
            aria-label="Worker Job Tabs"
          >
            <Badge
              role="tab"
              aria-selected={tab === "NEW"}
              tabIndex={0}
              onClick={() => setTab("NEW")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTab("NEW");
                }
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${
                tab === "NEW"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              <TranslatedText context="worker-jobs">New</TranslatedText> ({newJobs.length})
            </Badge>
            <Badge
              role="tab"
              aria-selected={tab === "PREVIOUS"}
              tabIndex={0}
              onClick={() => setTab("PREVIOUS")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTab("PREVIOUS");
                }
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${
                tab === "PREVIOUS"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              <TranslatedText context="worker-jobs">Previous</TranslatedText> ({previousJobs.length})
            </Badge>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-400"><TranslatedText context="worker-jobs">Loading…</TranslatedText></div>
        ) : list.length === 0 ? (
          <div className="text-gray-400">
            <TranslatedText context="worker-jobs">No</TranslatedText> {tab === "NEW" ? <TranslatedText context="worker-jobs">new</TranslatedText> : <TranslatedText context="worker-jobs">previous</TranslatedText>} <TranslatedText context="worker-jobs">jobs.</TranslatedText>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((j) => (
              <Card
                key={j.id}
                className="border-gray-800 bg-gray-800/50 p-5 flex flex-col"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
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
                    <TranslatedText context="worker-jobs">Customer</TranslatedText>: {j.customer?.name || "Customer"}
                  </div>
                  <div className="text-sm text-gray-400">
                    <TranslatedText context="worker-jobs">At</TranslatedText>: {new Date(j.time).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    <TranslatedText context="worker-jobs">Location</TranslatedText>: {j.location}
                  </div>
                  <div className="text-sm text-gray-400">
                    <TranslatedText context="worker-jobs">Charge</TranslatedText>: ₹{j.charge.toFixed(2)}
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
                          <TranslatedText context="worker-jobs">Rating</TranslatedText>: {"★".repeat(j.review.rating)}
                          {"☆".repeat(5 - j.review.rating)}
                        </span>
                        {j.review.comment && (
                          <span className="line-clamp-2 italic text-gray-400">
                            “{j.review.comment}”
                          </span>
                        )}
                      </div>
                    )}
                </div>
                {tab === "NEW" && j.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => act(j.id, "ACCEPT")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white flex-1"
                    >
                      <TranslatedText context="worker-jobs">Accept</TranslatedText>
                    </Button>
                    <Button
                      onClick={() => act(j.id, "REJECT")}
                      className="bg-red-600 hover:bg-red-500 text-white flex-1"
                    >
                      <TranslatedText context="worker-jobs">Reject</TranslatedText>
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
