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
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

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

  const handleClose = () => {
    if (!submitting) {
      onOpenChange(false);
      setRating(0);
      setComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Share Your Experience
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Help us improve by rating this job
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Section */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1 mb-3">
              Rating
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {stars.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-11 w-11 rounded-lg flex items-center justify-center transition-all duration-200 border-2 font-semibold ${
                    s <= rating
                      ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-300 shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  title={`Rate ${s} stars`}
                >
                  <FiStar
                    className={`h-5 w-5 ${s <= rating ? "fill-current" : ""}`}
                  />
                </motion.button>
              ))}
            </div>
            {rating < 1 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 dark:text-red-400 mt-2"
              >
                Please select at least 1 star
              </motion.div>
            )}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 dark:text-gray-400 mt-2"
              >
                You rated this job <strong>{rating}</strong> star
                {rating !== 1 ? "s" : ""}
              </motion.div>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">
              Comment{" "}
              <span className="text-gray-500 dark:text-gray-400">
                (optional)
              </span>
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback about the work quality, professionalism, and overall experience..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {comment.length}/500 characters
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={submitting}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || rating < 1}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
