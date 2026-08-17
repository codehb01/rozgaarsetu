import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectWorkerApi } from "@/lib/api-auth";
import { sendSuccess, withErrorHandling } from "@/lib/api-response";
import type { User } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { user, response } = await protectWorkerApi(request);
  if (response) return response;

  const worker = user as User;

  const completedJobs = await prisma.job.findMany({
    where: { workerId: worker.id, status: "COMPLETED" },
    select: {
      id: true,
      description: true,
      charge: true,
      createdAt: true,
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = completedJobs.reduce((sum, j) => sum + j.charge, 0);
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  const thisMonth = completedJobs
    .filter((j) => j.createdAt >= thisMonthStart)
    .reduce((sum, j) => sum + j.charge, 0);
  const lastMonth = completedJobs
    .filter(
      (j) => j.createdAt >= lastMonthStart && j.createdAt <= lastMonthEnd
    )
    .reduce((sum, j) => sum + j.charge, 0);

  const monthlyChange =
    lastMonth > 0
      ? ((thisMonth - lastMonth) / lastMonth) * 100
      : thisMonth > 0
      ? 100
      : 0;

  return sendSuccess({
    total,
    thisMonth,
    lastMonth,
    monthlyChange,
    jobs: completedJobs.map((j) => ({
      id: j.id,
      description: j.description,
      charge: j.charge,
      date: j.createdAt,
      customer: j.customer?.name || "Customer",
    })),
  });
});
