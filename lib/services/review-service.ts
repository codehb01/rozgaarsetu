import "server-only";
import prisma from "@/lib/prisma";

export async function createReview(jobId: string, customerId: string, workerId: string, rating: number, comment?: string | null) {
  return await prisma.review.create({
    data: {
      jobId,
      customerId,
      workerId,
      rating,
      comment: comment || null,
    },
    select: { id: true, rating: true, comment: true, createdAt: true },
  });
}

export async function getJobForReview(jobId: string) {
  return await prisma.job.findUnique({
    where: { id: jobId },
    include: { review: true },
  });
}
