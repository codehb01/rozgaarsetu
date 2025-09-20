import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await _req.json();
    const { action } = body || {};
    if (!["ACCEPT", "REJECT", "COMPLETE"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Worker actions: ACCEPT / REJECT (maps to ACCEPTED / CANCELLED) only from PENDING
    if (action === "ACCEPT" || action === "REJECT") {
      if (user.role !== "WORKER" || job.workerId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (job.status !== "PENDING") {
        return NextResponse.json(
          { error: "Only pending jobs can be updated" },
          { status: 400 }
        );
      }
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: { status: action === "ACCEPT" ? "ACCEPTED" : "CANCELLED" },
      });
      return NextResponse.json({ success: true, job: updated });
    }

    // Customer action: COMPLETE when status ACCEPTED
    if (action === "COMPLETE") {
      if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (job.status !== "ACCEPTED") {
        return NextResponse.json(
          { error: "Only accepted jobs can be completed" },
          { status: 400 }
        );
      }
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: { status: "COMPLETED" },
      });
      return NextResponse.json({ success: true, job: updated });
    }

    return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
  } catch (err) {
    console.error("PATCH /api/jobs/[id] error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
