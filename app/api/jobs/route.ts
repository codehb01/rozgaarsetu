import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import { calculateFees } from "@/lib/razorpay-service";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { createJobSchema } from "@/lib/api-schemas";
import type { User } from "@prisma/client";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  const customer = user as User;

  const body = await req.json();
  const validation = createJobSchema.safeParse(body);
  if (!validation.success) {
    return sendError(
      "Invalid request",
      "VALIDATION_ERROR",
      400,
      validation.error.flatten().fieldErrors
    );
  }

  const { workerId, description, details, datetime, location, charge } =
    validation.data;

  const dt = new Date(datetime);
  if (isNaN(dt.getTime())) {
    return sendError("Invalid datetime", "VALIDATION_ERROR", 400);
  }

  // Split into date and time DateTime values
  const date = new Date(dt);
  date.setHours(0, 0, 0, 0);
  const time = dt; // store the exact requested time as DateTime

  // Validate worker exists and is role WORKER
  const worker = await prisma.user.findUnique({ where: { id: workerId } });

  if (!worker) {
    return sendError("Worker not found", "NOT_FOUND", 404);
  }

  if (worker.role !== "WORKER") {
    return sendError(
      "Invalid worker",
      "INVALID_WORKER",
      400,
      `User exists but has role '${worker.role}' instead of 'WORKER'`
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

  return sendSuccess({ job }, 201);
});
