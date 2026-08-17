import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectApiRoute } from "@/lib/api-auth";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
} from "@/lib/razorpay-service";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { jobActionSchema, verifyPaymentSchema } from "@/lib/api-schemas";

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(
  async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { user, response } = await protectApiRoute(_req);
    if (response) return response;

    const body = await _req.json();
    const validation = jobActionSchema.safeParse(body);
    
    if (!validation.success) {
      return sendError(
        "Invalid request",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten().fieldErrors
      );
    }
    
    const { action, startProofPhoto, startProofGpsLat, startProofGpsLng, reason } = validation.data;

    if (!user) return sendError("User not found", "NOT_FOUND", 404);

    const resolvedParams = await params;
    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customer: true,
        worker: true,
      },
    });
    if (!job) return sendError("Job not found", "NOT_FOUND", 404);

    // ===========================
    // ACTION: ACCEPT (Worker only)
    // ===========================
    if (action === "ACCEPT") {
      if (user.role !== "WORKER" || job.workerId !== user.id) {
        return sendError("Only the assigned worker can accept this job", "FORBIDDEN", 403);
      }

      if (job.status !== "PENDING") {
        return sendError("Only pending jobs can be accepted", "INVALID_STATE", 400);
      }

      const updated = await prisma.job.update({
        where: { id: job.id },
        data: { status: "ACCEPTED" },
      });

      await prisma.jobLog.create({
        data: {
          jobId: job.id,
          fromStatus: "PENDING",
          toStatus: "ACCEPTED",
          action: "WORKER_ACCEPTED",
          performedBy: user.id,
        },
      });

      return sendSuccess({ job: updated });
    }

    // ===========================
    // ACTION: START (Worker only)
    // ===========================
    if (action === "START") {
      if (user.role !== "WORKER" || job.workerId !== user.id) {
        return sendError("Only the assigned worker can start this job", "FORBIDDEN", 403);
      }

      if (job.status !== "ACCEPTED") {
        return sendError("Only accepted jobs can be started", "INVALID_STATE", 400);
      }

      if (!startProofPhoto || startProofGpsLat === undefined || startProofGpsLng === undefined) {
        return sendError(
          "Proof of work required",
          "VALIDATION_ERROR",
          400,
          { message: "Photo and GPS location are mandatory to start work" }
        );
      }

      if (
        startProofGpsLat < -90 ||
        startProofGpsLat > 90 ||
        startProofGpsLng < -180 ||
        startProofGpsLng > 180
      ) {
        return sendError("Invalid GPS coordinates", "VALIDATION_ERROR", 400);
      }

      const updated = await prisma.job.update({
        where: { id: job.id },
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
          jobId: job.id,
          fromStatus: "ACCEPTED",
          toStatus: "IN_PROGRESS",
          action: "WORK_STARTED",
          performedBy: user.id,
          metadata: {
            startProofPhoto,
            gpsLocation: { lat: startProofGpsLat, lng: startProofGpsLng },
          },
        },
      });

      return sendSuccess({ job: updated });
    }

    // ===========================
    // ACTION: COMPLETE (Customer only)
    // ===========================
    if (action === "COMPLETE") {
      if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
        return sendError("Only the customer can complete this job", "FORBIDDEN", 403);
      }

      if (job.status !== "IN_PROGRESS") {
        return sendError("Only in-progress jobs can be completed", "INVALID_STATE", 400);
      }

      if (job.razorpayOrderId) {
        return sendSuccess({
          requiresPayment: true,
          razorpayOrder: {
            orderId: job.razorpayOrderId,
            amount: job.charge * 100,
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
          },
          job: job,
          message: "Resuming previous payment attempt",
        });
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
          performedBy: user.id,
          metadata: {
            razorpayOrderId: razorpayOrder.id,
            amount: job.charge,
          },
        },
      });

      return sendSuccess({
        requiresPayment: true,
        razorpayOrder: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        job: updated,
      });
    }

    // ===========================
    // ACTION: CANCEL (Customer or Worker)
    // ===========================
    if (action === "CANCEL") {
      const isAuthorized =
        (user.role === "CUSTOMER" && job.customerId === user.id) ||
        (user.role === "WORKER" && job.workerId === user.id);

      if (!isAuthorized) {
        return sendError("You are not authorized to cancel this job", "FORBIDDEN", 403);
      }

      if (job.status === "IN_PROGRESS") {
        return sendError(
          "Cannot cancel in-progress jobs",
          "INVALID_STATE",
          400,
          { message: "Work has already started. Please complete the job and make payment." }
        );
      }

      if (job.status !== "PENDING" && job.status !== "ACCEPTED") {
        return sendError("Job cannot be cancelled at this stage", "INVALID_STATE", 400);
      }

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
          performedBy: user.id,
          metadata: {
            cancelledBy: user.role,
            reason: reason || "No reason provided",
          },
        },
      });

      return sendSuccess({ job: updated });
    }

    return sendError("Unhandled action", "INVALID_ACTION", 400);
  }
);

// ===========================
// POST: Payment Verification
// ===========================
export const POST = withErrorHandling(
  async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { user, response } = await protectApiRoute(_req);
    if (response) return response;

    const body = await _req.json();
    const validation = verifyPaymentSchema.safeParse(body);
    
    if (!validation.success) {
      return sendError(
        "Invalid request",
        "VALIDATION_ERROR",
        400,
        validation.error.flatten().fieldErrors
      );
    }
    
    const { razorpayPaymentId, razorpaySignature } = validation.data;

    if (!user) return sendError("User not found", "NOT_FOUND", 404);

    const resolvedParams = await params;
    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
    });
    if (!job) return sendError("Job not found", "NOT_FOUND", 404);

    if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
      return sendError("Only the customer can verify payment", "FORBIDDEN", 403);
    }

    if (job.status !== "IN_PROGRESS") {
      return sendError("Job must be in-progress for payment", "INVALID_STATE", 400);
    }

    if (!job.razorpayOrderId) {
      return sendError("No payment order found", "INVALID_STATE", 400);
    }

    const isValid = verifyPaymentSignature(
      job.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return sendError("Payment verification failed", "PAYMENT_FAILED", 400);
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
        performedBy: user.id,
        metadata: {
          razorpayPaymentId,
          amount: job.charge,
          platformFee: job.platformFee,
          workerEarnings: job.workerEarnings,
        },
      },
    });

    return sendSuccess({
      job: updated,
      message: "Payment verified and job completed successfully",
    });
  }
);
