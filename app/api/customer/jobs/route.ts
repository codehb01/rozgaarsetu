import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import { sendSuccess, withErrorHandling } from "@/lib/api-response";
import type { User } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { user, response } = await protectCustomerApi(request);
  if (response) return response;

  const customer = user as User;

  const jobs = await prisma.job.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: {
      worker: { select: { name: true } },
      review: {
        select: { id: true, rating: true, comment: true, createdAt: true },
      },
    },
    take: 100,
  });

  return sendSuccess({ jobs });
});
