import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import type { User } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { user, response } = await protectCustomerApi(req);
    if (response) return response;

    const customer = user as User;

    const body = await req.json();
    const { jobId, rating, comment } = body || {};
    if (!jobId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating (1-5) required" },
        { status: 400 }
      );
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { review: true },
    });
    if (!job || job.customerId !== customer.id)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    if (job.status !== "COMPLETED")
      return NextResponse.json({ error: "Job not completed" }, { status: 400 });
    if (job.review)
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    if (!job.workerId)
      return NextResponse.json(
        { error: "Job missing worker" },
        { status: 400 }
      );

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
    return NextResponse.json({ success: true, review });
  } catch (e) {
    console.error("POST /api/reviews error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
