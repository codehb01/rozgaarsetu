"use client";

import { useState } from "react";
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
};

export default function BookWorkerButton({ workerId }: Props) {
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

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-500 text-white"
      >
        Book
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
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
