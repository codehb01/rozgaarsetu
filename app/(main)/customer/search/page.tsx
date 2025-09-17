"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";

type Worker = {
  id: string;
  name: string | null;
  role: string;
  workerProfile: {
    skilledIn: string[] | null;
    city: string | null;
    availableAreas: string[] | null;
    yearsExperience: number | null;
    qualification: string | null;
    profilePic: string | null;
    bio: string | null;
  } | null;
};

const CATEGORIES = [
  "All",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Mechanic",
  "Gardener",
  "Driver",
  "AC Technician",
];

export default function CustomerSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = useMemo(() => {
    const raw = searchParams.get("category");
    if (!raw) return "All";
    const norm = raw.replace(/-/g, " ").toLowerCase();
    const found = CATEGORIES.find((c) => c.toLowerCase() === norm);
    return found ?? "All";
  }, [searchParams]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const fetchWorkers = async (opts?: { q?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (opts?.q) qs.set("q", opts.q);
    if (opts?.category && opts.category !== "All")
      qs.set("category", opts.category.toLowerCase());
    qs.set("limit", "30");
    const url = `/api/workers?${qs.toString()}`;
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch workers");
      const data = await res.json();
      setWorkers(data.workers || []);
    } catch (e) {
      console.error(e);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers({ q, category });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers({ q, category });
  };

  const onBadgeClick = (cat: string) => {
    setCategory(cat);
    const qs = new URLSearchParams(window.location.search);
    if (cat === "All") qs.delete("category");
    else qs.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/customer/search?${qs.toString()}`);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-light text-white">
            Search Workers
          </h1>
          <p className="text-gray-400 mt-2">
            Find skilled professionals by keyword or category.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex gap-3 mb-4">
          <Input
            placeholder="Search e.g. plumber, electrician, carpenter"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Search
          </Button>
        </form>

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => onBadgeClick(c)}
                className={
                  "px-3 py-1 rounded-full text-sm border transition-colors " +
                  (active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
                }
              >
                {c}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-gray-400">Loading…</div>
        ) : workers.length === 0 ? (
          <div className="text-gray-400">No matching workers found.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((w) => (
              <Card key={w.id} className="border-gray-800 bg-gray-800/50 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-700 overflow-hidden" />
                  <div>
                    <div className="text-white font-medium">
                      {w.name ?? "Unnamed Worker"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {w.workerProfile?.qualification || "—"} •{" "}
                      {w.workerProfile?.yearsExperience ?? 0} yrs exp
                    </div>
                    <div className="mt-1 text-sm text-gray-400">
                      {w.workerProfile?.city || "City"} •{" "}
                      {(w.workerProfile?.availableAreas || [])
                        .slice(0, 2)
                        .join(", ")}
                    </div>
                    <div className="mt-2 text-xs text-gray-300">
                      {(w.workerProfile?.skilledIn || [])
                        .slice(0, 4)
                        .join(" • ")}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/workers/${w.id}`}>
                        <Button
                          variant="secondary"
                          className="bg-gray-700 text-white hover:bg-gray-600"
                        >
                          View
                        </Button>
                      </Link>
                      <BookWorkerButton workerId={w.id} />
                    </div>
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
