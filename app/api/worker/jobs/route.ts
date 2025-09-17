import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

    const jobs = await prisma.job.findMany({
      where: { workerId: worker.id },
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
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
