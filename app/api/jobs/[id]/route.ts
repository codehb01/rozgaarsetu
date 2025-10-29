import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
} from "@/lib/razorpay-service";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await _req.json();
    const { action } = body || {};

    // Valid actions: ACCEPT, START, COMPLETE, CANCEL
    if (!["ACCEPT", "START", "COMPLETE", "CANCEL"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resolvedParams = await params;
    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customer: true,
        worker: true,
      },
    });
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // ===========================
    // ACTION: ACCEPT (Worker only)
    // Transition: PENDING → ACCEPTED
    // ===========================
    if (action === "ACCEPT") {
      // Authorization: Only assigned worker can accept
      if (user.role !== "WORKER" || job.workerId !== user.id) {
        return NextResponse.json(
          { error: "Only the assigned worker can accept this job" },
          { status: 403 }
        );
      }

      // State validation: Must be PENDING
      if (job.status !== "PENDING") {
        return NextResponse.json(
          { error: "Only pending jobs can be accepted" },
          { status: 400 }
        );
      }

      // Update job status
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: { status: "ACCEPTED" },
      });

      // Log state transition
      await prisma.jobLog.create({
        data: {
          jobId: job.id,
          fromStatus: "PENDING",
          toStatus: "ACCEPTED",
          action: "WORKER_ACCEPTED",
          performedBy: user.id,
        },
      });

      return NextResponse.json({ success: true, job: updated });
    }

    // ===========================
    // ACTION: START (Worker only)
    // Transition: ACCEPTED → IN_PROGRESS
    // Requires: Photo proof + GPS coordinates
    // ===========================
    if (action === "START") {
      // Authorization: Only assigned worker can start
      if (user.role !== "WORKER" || job.workerId !== user.id) {
        return NextResponse.json(
          { error: "Only the assigned worker can start this job" },
          { status: 403 }
        );
      }

      // State validation: Must be ACCEPTED
      if (job.status !== "ACCEPTED") {
        return NextResponse.json(
          { error: "Only accepted jobs can be started" },
          { status: 400 }
        );
      }

      // Proof validation: Photo + GPS required
      const { startProofPhoto, startProofGpsLat, startProofGpsLng } = body;

      if (!startProofPhoto || !startProofGpsLat || !startProofGpsLng) {
        return NextResponse.json(
          {
            error: "Proof of work required",
            message: "Photo and GPS location are mandatory to start work",
          },
          { status: 400 }
        );
      }

      // Validate GPS coordinates
      if (
        typeof startProofGpsLat !== "number" ||
        typeof startProofGpsLng !== "number" ||
        startProofGpsLat < -90 ||
        startProofGpsLat > 90 ||
        startProofGpsLng < -180 ||
        startProofGpsLng > 180
      ) {
        return NextResponse.json(
          { error: "Invalid GPS coordinates" },
          { status: 400 }
        );
      }

      // Update job with proof and transition to IN_PROGRESS
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

      // Log state transition
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

      return NextResponse.json({ success: true, job: updated });
    }

    // ===========================
    // ACTION: COMPLETE (Customer only)
    // Transition: IN_PROGRESS → Create Razorpay order
    // Returns: Razorpay order details for payment modal
    // ===========================
    if (action === "COMPLETE") {
      // Authorization: Only customer can mark complete
      if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
        return NextResponse.json(
          { error: "Only the customer can complete this job" },
          { status: 403 }
        );
      }

      // State validation: Must be IN_PROGRESS
      if (job.status !== "IN_PROGRESS") {
        return NextResponse.json(
          { error: "Only in-progress jobs can be completed" },
          { status: 400 }
        );
      }

      // Check if Razorpay order already exists
      if (job.razorpayOrderId) {
        // Allow retry with existing order - don't block
        return NextResponse.json({
          success: true,
          requiresPayment: true,
          razorpayOrder: {
            orderId: job.razorpayOrderId,
            amount: job.charge * 100, // Convert to paise
            currency: "INR",
            keyId: process.env.RAZORPAY_KEY_ID,
          },
          job: job,
          message: "Resuming previous payment attempt",
        });
      }

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(
        job.id,
        job.charge,
        job.customer.email,
        job.customer.phone
      );

      // Update job with Razorpay order details
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
          paymentStatus: "PROCESSING",
        },
      });

      // Log payment initiation
      await prisma.jobLog.create({
        data: {
          jobId: job.id,
          fromStatus: "IN_PROGRESS",
          toStatus: "IN_PROGRESS", // Status doesn't change yet
          action: "PAYMENT_INITIATED",
          performedBy: user.id,
          metadata: {
            razorpayOrderId: razorpayOrder.id,
            amount: job.charge,
          },
        },
      });

      // Return Razorpay order for frontend payment modal
      return NextResponse.json({
        success: true,
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
    // Transition: PENDING/ACCEPTED → CANCELLED
    // Blocked: Cannot cancel if IN_PROGRESS
    // ===========================
    if (action === "CANCEL") {
      // Authorization: Customer or worker can cancel
      const isAuthorized =
        (user.role === "CUSTOMER" && job.customerId === user.id) ||
        (user.role === "WORKER" && job.workerId === user.id);

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "You are not authorized to cancel this job" },
          { status: 403 }
        );
      }

      // State validation: Cannot cancel IN_PROGRESS jobs (anti-fraud)
      if (job.status === "IN_PROGRESS") {
        return NextResponse.json(
          {
            error: "Cannot cancel in-progress jobs",
            message:
              "Work has already started. Please complete the job and make payment.",
          },
          { status: 400 }
        );
      }

      // State validation: Can only cancel PENDING or ACCEPTED
      if (job.status !== "PENDING" && job.status !== "ACCEPTED") {
        return NextResponse.json(
          { error: "Job cannot be cancelled at this stage" },
          { status: 400 }
        );
      }

      const { reason } = body;

      // Update job status
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: { status: "CANCELLED" },
      });

      // Log cancellation
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

// ===========================
// POST: Payment Verification
// Called after customer completes Razorpay payment
// ===========================
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await _req.json();
    const { razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const resolvedParams = await params;
    const job = await prisma.job.findUnique({
      where: { id: resolvedParams.id },
    });
    if (!job)
      return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Authorization: Only customer can verify payment
    if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
      return NextResponse.json(
        { error: "Only the customer can verify payment" },
        { status: 403 }
      );
    }

    // Validate job state
    if (job.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Job must be in-progress for payment" },
        { status: 400 }
      );
    }

    if (!job.razorpayOrderId) {
      return NextResponse.json(
        { error: "No payment order found" },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const isValid = verifyPaymentSignature(
      job.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update job: Mark as COMPLETED with payment details
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

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: job.customerId,
        jobId: job.id,
        amount: job.charge,
        type: "PAYMENT",
      },
    });

    // Log job completion
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

    return NextResponse.json({
      success: true,
      job: updated,
      message: "Payment verified and job completed successfully",
    });
  } catch (err) {
    console.error("POST /api/jobs/[id] payment verification error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
