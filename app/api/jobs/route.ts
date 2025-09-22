import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (dbUser.role !== "CUSTOMER")
      return NextResponse.json(
        { error: "Only customers can create jobs" },
        { status: 403 }
      );

    const body = await req.json();
    const { workerId, description, details, datetime, location, charge } =
      body || {};

    if (
      !workerId ||
      !description ||
      !datetime ||
      !location ||
      typeof charge !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const dt = new Date(datetime);
    if (isNaN(dt.getTime())) {
      return NextResponse.json({ error: "Invalid datetime" }, { status: 400 });
    }

    // Split into date and time DateTime values
    const date = new Date(dt);
    date.setHours(0, 0, 0, 0);
    const time = dt; // store the exact requested time as DateTime

    // Validate worker exists and is role WORKER
    const worker = await prisma.user.findUnique({ where: { id: workerId } });
    if (!worker || worker.role !== "WORKER") {
      return NextResponse.json({ error: "Invalid worker" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        customerId: dbUser.id,
        workerId: worker.id,
        description,
        details: details || null,
        date,
        time,
        location,
        charge,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error("POST /api/jobs error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
