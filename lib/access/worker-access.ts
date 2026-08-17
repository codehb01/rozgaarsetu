import { AuthenticatedUser } from "@/lib/api-auth";
import { AccessResult } from "./job-access";

export function canAccessWorkerProtectedRoutes(user: AuthenticatedUser): AccessResult {
  if (user.role !== "WORKER") {
    return { allowed: false, error: "Only workers can access this resource", status: 403 };
  }
  return { allowed: true };
}

export function canUpdateWorkerProfile(user: AuthenticatedUser): AccessResult {
  if (user.role !== "WORKER") {
    return { allowed: false, error: "Only workers can update a worker profile", status: 403 };
  }
  if (!user.workerProfile) {
    return { allowed: false, error: "Worker profile not found", status: 404 };
  }
  return { allowed: true };
}
