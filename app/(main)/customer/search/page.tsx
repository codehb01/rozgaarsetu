"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
    <main style={{ minHeight: 'calc(100vh - 4rem)', backgroundColor: '#f9fafb', padding: '2.5rem 0' }}>
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '300', color: '#111827', marginBottom: '0.5rem' }}>
            Search Workers
          </h1>
          <p style={{ color: '#6b7280' }}>
            Find skilled professionals by keyword or category.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search e.g. plumber, electrician, carpenter"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Search
          </button>
        </form>

        <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => onBadgeClick(c)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: '1px solid',
                  cursor: 'pointer',
                  backgroundColor: active ? '#2563eb' : 'white',
                  color: active ? 'white' : '#374151',
                  borderColor: active ? '#2563eb' : '#d1d5db'
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>Loading…</div>
        ) : workers.length === 0 ? (
          <div style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>No matching workers found.</div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
          }}>
            {workers.map((w) => (
              <div 
                key={w.id} 
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}>
                    {(w.name ?? "U").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#111827', fontWeight: '500', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                      {w.name ?? "Unnamed Worker"}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {w.workerProfile?.qualification || "—"} •{" "}
                      {w.workerProfile?.yearsExperience ?? 0} years experience
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      📍 {w.workerProfile?.city || "City"} 
                      {(w.workerProfile?.availableAreas || []).length > 0 && (
                        <span> • {(w.workerProfile?.availableAreas || []).slice(0, 2).join(", ")}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '1rem' }}>
                      Skills: {(w.workerProfile?.skilledIn || []).slice(0, 4).join(" • ") || "No skills listed"}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        href={`/workers/${w.id}`}
                        style={{
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        View Profile
                      </Link>
                      <Link 
                        href={`/customer/booking?worker=${w.id}`}
                        style={{
                          backgroundColor: '#2563eb',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Book Worker
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
