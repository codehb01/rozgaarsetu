import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectWorkerApi } from "@/lib/api-auth";
import { sendSuccess, withErrorHandling } from "@/lib/api-response";
import type { User } from "@prisma/client";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { user, response } = await protectWorkerApi(request);
  if (response) return response;

  const worker = user as User;

  const jobs = await prisma.job.findMany({
    where: { workerId: worker.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true } },
      review: { select: { rating: true, comment: true } },
    },
    take: 50,
  });

  return sendSuccess({ jobs });
});
