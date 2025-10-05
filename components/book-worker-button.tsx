"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  workerId: string;
  className?: string;
};

export default function BookWorkerButton({ workerId, className }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const description = String(formData.get("description") || "");
      const details = String(formData.get("details") || "");
      const datetime = String(formData.get("datetime") || "");
      const location = String(formData.get("location") || "");
      const charge = Number(formData.get("charge") || 0);

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          description,
          details,
          datetime,
          location,
          charge,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create job");
      }
      setOpen(false);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Register a global listener so external non-React UI (map popups, etc.) can open
  // this booking dialog by dispatching a CustomEvent('rozgaar:openBook', { detail: { workerId } }).
  // Also maintain a simple global counter of mounted listeners so callers can decide whether
  // to dispatch or navigate to the worker page as a fallback.
  useState(() => {
    if (typeof window === 'undefined') return;
    // initialize counter if missing
    (window as any).__rozgaar_book_listeners_count = (window as any).__rozgaar_book_listeners_count || 0;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).__rozgaar_book_listeners_count = ((window as any).__rozgaar_book_listeners_count || 0) + 1;
    console.debug('[BookWorkerButton] mounted for', workerId, 'listeners_count=', (window as any).__rozgaar_book_listeners_count);
    const handler = (ev: Event) => {
      try {
        const custom = ev as CustomEvent;
        const detail = custom?.detail as any;
        if (detail && detail.workerId === workerId) {
          console.debug('[BookWorkerButton] received openBook for', workerId);
          setOpen(true);
        }
      } catch (err) {}
    };
    window.addEventListener('rozgaar:openBook', handler as EventListener);
    return () => {
      try { window.removeEventListener('rozgaar:openBook', handler as EventListener); } catch (e) {}
      (window as any).__rozgaar_book_listeners_count = Math.max(0, ((window as any).__rozgaar_book_listeners_count || 1) - 1);
    };
  }, [workerId]);

  // notify others that this dialog opened for this workerId so callers can avoid fallback navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (open) {
      try {
        console.debug('[BookWorkerButton] dialog opened for', workerId);
        const ev = new CustomEvent('rozgaar:bookOpened', { detail: { workerId } });
        window.dispatchEvent(ev);
      } catch (err) {}
    }
  }, [open, workerId]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={`${className ?? ''} bg-blue-600 hover:bg-blue-500 text-white`}
      >
        Book
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white z-50">
          <DialogHeader>
            <DialogTitle>Book this worker</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              name="description"
              placeholder="Short description"
              className="bg-gray-800 border-gray-700"
              required
            />
            <Textarea
              name="details"
              placeholder="Details (optional)"
              className="bg-gray-800 border-gray-700"
            />
            <Input
              name="datetime"
              type="datetime-local"
              className="bg-gray-800 border-gray-700"
              required
            />
            <Input
              name="location"
              placeholder="Location"
              className="bg-gray-800 border-gray-700"
              required
            />
            <Input
              name="charge"
              type="number"
              step="0.01"
              placeholder="Proposed price"
              className="bg-gray-800 border-gray-700"
              required
            />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="secondary"
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {loading ? "Booking…" : "Book"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
