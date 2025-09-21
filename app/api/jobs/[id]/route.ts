import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const worker = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!worker || worker.role !== "WORKER")
      return NextResponse.json(
        { error: "Only workers can update jobs" },
        { status: 403 }
      );

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.workerId !== worker.id)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const body = await _req.json();
    const { action } = body || {};
    if (!["ACCEPT", "REJECT"].includes(action))
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    const status = action === "ACCEPT" ? "ACCEPTED" : "CANCELLED";
    if (job.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending jobs can be updated" },
        { status: 400 }
      );
    }
    const updated = await prisma.job.update({
      where: { id: job.id },
      data: { status },
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (err) {
    console.error("PATCH /api/jobs/[id] error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
