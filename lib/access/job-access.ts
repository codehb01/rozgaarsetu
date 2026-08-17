import { Job } from "@prisma/client";
import { AuthenticatedUser } from "@/lib/api-auth";

export type AccessResult = 
  | { allowed: true } 
  | { allowed: false; error: string; status: number; details?: any };

export function canCreateJob(user: AuthenticatedUser): AccessResult {
  if (user.role !== "CUSTOMER") {
    return { allowed: false, error: "Only customers can create jobs", status: 403 };
  }
  return { allowed: true };
}

export function canAcceptJob(user: AuthenticatedUser, job: Job): AccessResult {
  if (user.role !== "WORKER" || job.workerId !== user.id) {
    return { allowed: false, error: "Only the assigned worker can accept this job", status: 403 };
  }
  if (job.status !== "PENDING") {
    return { allowed: false, error: "Only pending jobs can be accepted", status: 400 };
  }
  return { allowed: true };
}

export function canStartJob(
  user: AuthenticatedUser,
  job: Job,
  startProofPhoto?: string,
  startProofGpsLat?: number,
  startProofGpsLng?: number
): AccessResult {
  if (user.role !== "WORKER" || job.workerId !== user.id) {
    return { allowed: false, error: "Only the assigned worker can start this job", status: 403 };
  }
  if (job.status !== "ACCEPTED") {
    return { allowed: false, error: "Only accepted jobs can be started", status: 400 };
  }
  if (!startProofPhoto || startProofGpsLat === undefined || startProofGpsLng === undefined) {
    return {
      allowed: false,
      error: "Proof of work required",
      status: 400,
      details: { message: "Photo and GPS location are mandatory to start work" },
    };
  }
  if (startProofGpsLat < -90 || startProofGpsLat > 90 || startProofGpsLng < -180 || startProofGpsLng > 180) {
    return { allowed: false, error: "Invalid GPS coordinates", status: 400 };
  }
  return { allowed: true };
}

export function canCompleteJob(user: AuthenticatedUser, job: Job): AccessResult {
  if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
    return { allowed: false, error: "Only the customer can complete this job", status: 403 };
  }
  if (job.status !== "IN_PROGRESS") {
    return { allowed: false, error: "Only in-progress jobs can be completed", status: 400 };
  }
  return { allowed: true };
}

export function canCancelJob(user: AuthenticatedUser, job: Job): AccessResult {
  const isAuthorized =
    (user.role === "CUSTOMER" && job.customerId === user.id) ||
    (user.role === "WORKER" && job.workerId === user.id);

  if (!isAuthorized) {
    return { allowed: false, error: "You are not authorized to cancel this job", status: 403 };
  }

  if (job.status === "IN_PROGRESS") {
    return {
      allowed: false,
      error: "Cannot cancel in-progress jobs",
      status: 400,
      details: { message: "Work has already started. Please complete the job and make payment." },
    };
  }

  if (job.status !== "PENDING" && job.status !== "ACCEPTED") {
    return { allowed: false, error: "Job cannot be cancelled at this stage", status: 400 };
  }

  return { allowed: true };
}

export function canVerifyPayment(user: AuthenticatedUser, job: Job): AccessResult {
  if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
    return { allowed: false, error: "Only the customer can verify payment", status: 403 };
  }
  if (job.status !== "IN_PROGRESS") {
    return { allowed: false, error: "Job must be in-progress for payment", status: 400 };
  }
  if (!job.razorpayOrderId) {
    return { allowed: false, error: "No payment order found", status: 400 };
  }
  return { allowed: true };
}
