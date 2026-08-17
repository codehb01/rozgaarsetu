import "server-only";
import prisma from "@/lib/prisma";
import { calculateFees, createRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay-service";
import { Job, User } from "@prisma/client";

export async function createJob(customerId: string, workerId: string, description: string, details: string | null | undefined, datetime: string, location: string, charge: number) {
  const dt = new Date(datetime);
  const date = new Date(dt);
  date.setHours(0, 0, 0, 0);
  const time = dt;

  const { platformFee, workerEarnings } = calculateFees(charge);

  const job = await prisma.job.create({
    data: {
      customerId,
      workerId,
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

  await prisma.jobLog.create({
    data: {
      jobId: job.id,
      fromStatus: null,
      toStatus: "PENDING",
      action: "JOB_CREATED",
      performedBy: customerId,
      metadata: { charge, platformFee, workerEarnings, location },
    },
  });

  return job;
}

export async function acceptJob(jobId: string, workerId: string) {
  const updated = await prisma.job.update({
    where: { id: jobId },
    data: { status: "ACCEPTED" },
  });

  await prisma.jobLog.create({
    data: {
      jobId,
      fromStatus: "PENDING",
      toStatus: "ACCEPTED",
      action: "WORKER_ACCEPTED",
      performedBy: workerId,
    },
  });

  return updated;
}

export async function startJob(jobId: string, workerId: string, startProofPhoto: string, startProofGpsLat: number, startProofGpsLng: number) {
  const updated = await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "IN_PROGRESS",
      startProofPhoto,
      startProofGpsLat,
      startProofGpsLng,
      startedAt: new Date(),
    },
  });

  await prisma.jobLog.create({
    data: {
      jobId,
      fromStatus: "ACCEPTED",
      toStatus: "IN_PROGRESS",
      action: "WORK_STARTED",
      performedBy: workerId,
      metadata: {
        startProofPhoto,
        gpsLocation: { lat: startProofGpsLat, lng: startProofGpsLng },
      },
    },
  });

  return updated;
}

// We pass the full job with customer included so we can access customer.email and phone
export async function initiatePaymentForJobCompletion(job: Job & { customer: User }, customerId: string) {
  if (job.razorpayOrderId) {
    return {
      requiresPayment: true,
      razorpayOrder: {
        orderId: job.razorpayOrderId,
        amount: job.charge * 100,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      job,
      message: "Resuming previous payment attempt",
    };
  }

  const razorpayOrder = await createRazorpayOrder(
    job.id,
    job.charge,
    job.customer.email,
    job.customer.phone
  );

  const updated = await prisma.job.update({
    where: { id: job.id },
    data: {
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "PROCESSING",
    },
  });

  await prisma.jobLog.create({
    data: {
      jobId: job.id,
      fromStatus: "IN_PROGRESS",
      toStatus: "IN_PROGRESS",
      action: "PAYMENT_INITIATED",
      performedBy: customerId,
      metadata: {
        razorpayOrderId: razorpayOrder.id,
        amount: job.charge,
      },
    },
  });

  return {
    requiresPayment: true,
    razorpayOrder: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
    job: updated,
  };
}

export async function cancelJob(job: Job, userId: string, role: string, reason?: string) {
  const updated = await prisma.job.update({
    where: { id: job.id },
    data: { status: "CANCELLED" },
  });

  await prisma.jobLog.create({
    data: {
      jobId: job.id,
      fromStatus: job.status,
      toStatus: "CANCELLED",
      action: "JOB_CANCELLED",
      performedBy: userId,
      metadata: {
        cancelledBy: role,
        reason: reason || "No reason provided",
      },
    },
  });

  return updated;
}

export async function verifyAndCompleteJobPayment(job: Job, razorpayPaymentId: string, razorpaySignature: string, customerId: string) {
  if (!job.razorpayOrderId) return { success: false, error: "No payment order found", status: 400 };

  const isValid = verifyPaymentSignature(
    job.razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isValid) {
    return { success: false, error: "Payment verification failed", status: 400 };
  }

  const updated = await prisma.job.update({
    where: { id: job.id },
    data: {
      status: "COMPLETED",
      paymentStatus: "SUCCESS",
      razorpayPaymentId,
      razorpaySignature,
      completedAt: new Date(),
    },
  });

  await prisma.transaction.create({
    data: {
      userId: job.customerId,
      jobId: job.id,
      amount: job.charge,
      type: "PAYMENT",
    },
  });

  await prisma.jobLog.create({
    data: {
      jobId: job.id,
      fromStatus: "IN_PROGRESS",
      toStatus: "COMPLETED",
      action: "PAYMENT_VERIFIED_JOB_COMPLETED",
      performedBy: customerId,
      metadata: {
        razorpayPaymentId,
        amount: job.charge,
        platformFee: job.platformFee,
        workerEarnings: job.workerEarnings,
      },
    },
  });

  return { success: true, job: updated };
}

export async function getJobById(jobId: string, includeCustomerWorker = false) {
  return await prisma.job.findUnique({
    where: { id: jobId },
    include: includeCustomerWorker ? { customer: true, worker: true } : undefined,
  });
}
