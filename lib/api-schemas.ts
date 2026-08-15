import { z } from "zod";

// Reviews
export const createReviewSchema = z.object({
  jobId: z.string().min(1, "Job ID required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

// Add more API schemas here as you migrate routes
