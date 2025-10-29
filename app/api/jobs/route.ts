import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import { calculateFees } from "@/lib/razorpay-service";
import type { User } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { user, response } = await protectCustomerApi(req);
    if (response) return response;

    const customer = user as User;

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

    if (charge <= 0) {
      return NextResponse.json(
        { error: "Charge must be greater than 0" },
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

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    if (worker.role !== "WORKER") {
      return NextResponse.json(
        {
          error: "Invalid worker",
          details: `User exists but has role '${worker.role}' instead of 'WORKER'`,
        },
        { status: 400 }
      );
    }

    // Calculate platform fees and worker earnings
    const { platformFee, workerEarnings } = calculateFees(charge);

    // Create job with payment tracking fields
    const job = await prisma.job.create({
      data: {
        customerId: customer.id,
        workerId: worker.id,
        description,
        details: details || null,
        date,
        time,
        location,
        charge,
        status: "PENDING",
        platformFee,
        workerEarnings,
        paymentStatus: "PENDING",
      },
    });

    // Create audit log for job creation
    await prisma.jobLog.create({
      data: {
        jobId: job.id,
        fromStatus: null,
        toStatus: "PENDING",
        action: "JOB_CREATED",
        performedBy: customer.id,
        metadata: {
          charge,
          platformFee,
          workerEarnings,
          location,
        },
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
