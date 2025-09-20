"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  jobId: string | null;
  onSubmitted: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  jobId,
  onSubmitted,
}: ReviewDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  const submit = async () => {
    if (!jobId || rating < 1) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      if (res.ok) {
        onOpenChange(false);
        setRating(0);
        setComment("");
        onSubmitted();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!submitting) onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Review Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <div className="text-sm text-gray-300 mb-2">
              Rating <span className="text-red-400">*</span>
            </div>
            <div className="flex gap-2">
              {stars.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className={`h-9 w-9 rounded-md flex items-center justify-center border transition-colors ${
                    s <= rating
                      ? "bg-yellow-400 text-black border-yellow-300"
                      : "bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {rating < 1 && (
              <div className="text-xs text-red-400 mt-1">
                Select at least 1 star.
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-300 mb-1">Comment (optional)</div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-200 resize-none"
              rows={4}
              placeholder="Share your experience (optional)"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={submitting || rating < 1}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
