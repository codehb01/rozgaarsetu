import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import type { User } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json({ jobs });
  } catch (e) {
    console.error("GET /api/customer/jobs", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
