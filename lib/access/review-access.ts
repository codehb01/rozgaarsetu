import { AuthenticatedUser } from "@/lib/api-auth";
import { AccessResult } from "./job-access";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function canCreateReview(user: AuthenticatedUser, job: any): AccessResult {
  if (user.role !== "CUSTOMER" || job.customerId !== user.id) {
    return { allowed: false, error: "Only the customer who created the job can leave a review", status: 403 };
  }
  if (job.status !== "COMPLETED") {
    return { allowed: false, error: "Job not completed", status: 400 };
  }
  if (job.review) {
    return { allowed: false, error: "Already reviewed", status: 400 };
  }
  if (!job.workerId) {
    return { allowed: false, error: "Job missing worker", status: 400 };
  }
  return { allowed: true };
}
