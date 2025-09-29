import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectWorkerApi } from "@/lib/api-auth";
import type { User } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("GET /api/worker/jobs error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
