import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const worker = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!worker || worker.role !== "WORKER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

    return NextResponse.json({
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
  } catch (e) {
    console.error("GET /api/worker/earnings error", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
