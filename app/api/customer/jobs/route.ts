import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const customer = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!customer || customer.role !== "CUSTOMER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
