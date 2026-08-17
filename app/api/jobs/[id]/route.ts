import { NextRequest } from "next/server";
import { protectApiRoute } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { jobActionSchema, verifyPaymentSchema } from "@/lib/api-schemas";
import {
  canAcceptJob,
  canStartJob,
  canCompleteJob,
  canCancelJob,
  canVerifyPayment,
} from "@/lib/access/job-access";
import {
  getJobById,
  acceptJob,
  startJob,
  initiatePaymentForJobCompletion,
  cancelJob,
  verifyAndCompleteJobPayment,
} from "@/lib/services/job-service";

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(
  async (_req: NextRequest, { params }: RouteContext) => {
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
    
    // We need the customer included for the payment flow if we complete it
    const job = await getJobById(resolvedParams.id, true);
    
    if (!job) return sendError("Job not found", "NOT_FOUND", 404);

    // ===========================
    // ACTION: ACCEPT (Worker only)
    // ===========================
    if (action === "ACCEPT") {
      const access = canAcceptJob(user, job);
      if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);
      
      const updated = await acceptJob(job.id, user.id);
      return sendSuccess({ job: updated });
    }

    // ===========================
    // ACTION: START (Worker only)
    // ===========================
    if (action === "START") {
      const access = canStartJob(user, job, startProofPhoto, startProofGpsLat, startProofGpsLng);
      if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status, access.details);

      const updated = await startJob(
        job.id,
        user.id,
        startProofPhoto as string,
        startProofGpsLat as number,
        startProofGpsLng as number
      );
      return sendSuccess({ job: updated });
    }

    // ===========================
    // ACTION: COMPLETE (Customer only)
    // ===========================
    if (action === "COMPLETE") {
      const access = canCompleteJob(user, job);
      if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);
      
      // cast job as required by the service layer, since we requested includeCustomerWorker = true
      const result = await initiatePaymentForJobCompletion(job as any, user.id);
      return sendSuccess(result);
    }

    // ===========================
    // ACTION: CANCEL (Customer or Worker)
    // ===========================
    if (action === "CANCEL") {
      const access = canCancelJob(user, job);
      if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status, access.details);

      const updated = await cancelJob(job, user.id, user.role, reason);
      return sendSuccess({ job: updated });
    }

    return sendError("Unhandled action", "INVALID_ACTION", 400);
  }
);

// ===========================
// POST: Payment Verification
// ===========================
export const POST = withErrorHandling(
  async (_req: NextRequest, { params }: RouteContext) => {
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
    const job = await getJobById(resolvedParams.id);
    
    if (!job) return sendError("Job not found", "NOT_FOUND", 404);

    const access = canVerifyPayment(user, job);
    if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);

    const result = await verifyAndCompleteJobPayment(
      job,
      razorpayPaymentId,
      razorpaySignature,
      user.id
    );

    if (!result.success) {
      return sendError(result.error as string, "PAYMENT_FAILED", result.status || 400);
    }

    return sendSuccess({
      job: result.job,
      message: "Payment verified and job completed successfully",
    });
  }
);
