import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user || user.role !== "CUSTOMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
    if (!job || job.customerId !== user.id)
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
        customerId: user.id,
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
