"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
};

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-light text-white mb-6">Job Requests</h1>
        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-400">No jobs right now.</div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((j) => (
              <Card key={j.id} className="border-gray-800 bg-gray-800/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-medium">
                      {j.description}
                    </div>
                    <div className="text-sm text-gray-400">
                      For: {j.customer?.name ?? "Customer"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      At: {new Date(j.time).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Location: {j.location}
                    </div>
                    <div className="text-sm text-gray-400">
                      Charge: ₹{j.charge.toFixed(2)}
                    </div>
                    {j.details && (
                      <div className="text-sm text-gray-300 mt-2">
                        {j.details}
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
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                        {j.status}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
