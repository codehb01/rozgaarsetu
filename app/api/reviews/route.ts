import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { createReviewSchema } from "@/lib/api-schemas";
import type { User } from "@prisma/client";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  const customer = user as User;
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
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { review: true },
  });

  if (!job || job.customerId !== customer.id) {
    return sendError("Job not found", "NOT_FOUND", 404);
  }
  if (job.status !== "COMPLETED") {
    return sendError("Job not completed", "INVALID_STATE", 400);
  }
  if (job.review) {
    return sendError("Already reviewed", "DUPLICATE", 400);
  }
  if (!job.workerId) {
    return sendError("Job missing worker", "INVALID_JOB", 400);
  }

  const review = await prisma.review.create({
    data: {
      jobId: job.id,
      customerId: customer.id,
      workerId: job.workerId,
      rating,
      comment: comment || null,
    },
    select: { id: true, rating: true, comment: true, createdAt: true },
  });

  return sendSuccess(review, 201);
});
