import { NextRequest } from "next/server";
import { protectCustomerApi } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { createReviewSchema } from "@/lib/api-schemas";
import { canCreateReview } from "@/lib/access/review-access";
import { getJobForReview, createReview } from "@/lib/services/review-service";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  if (!user) return sendError("Unauthorized", "UNAUTHORIZED", 401);

  const body = await req.json();
  const validation = createReviewSchema.safeParse(body);
  if (!validation.success) {
    return sendError(
      "Invalid request",
      "VALIDATION_ERROR",
      400,
      validation.error.flatten().fieldErrors
    );
  }

  const { jobId, rating, comment } = validation.data;
  
  const job = await getJobForReview(jobId);
  if (!job) {
    return sendError("Job not found", "NOT_FOUND", 404);
  }

  const access = canCreateReview(user, job);
  if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);

  const review = await createReview(job.id, user.id, job.workerId!, rating, comment);

  return sendSuccess(review, 201);
});
