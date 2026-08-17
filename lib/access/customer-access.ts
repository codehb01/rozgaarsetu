import { AuthenticatedUser } from "@/lib/api-auth";
import { AccessResult } from "./job-access";

export function canUpdateCustomerProfile(user: AuthenticatedUser): AccessResult {
  if (user.role !== "CUSTOMER") {
    return { allowed: false, error: "Only customers can update a customer profile", status: 403 };
  }
  if (!user.customerProfile) {
    return { allowed: false, error: "Customer profile not found", status: 404 };
  }
  return { allowed: true };
}

export function canAccessCustomerProtectedRoutes(user: AuthenticatedUser): AccessResult {
  if (user.role !== "CUSTOMER") {
    return { allowed: false, error: "Only customers can access this resource", status: 403 };
  }
  return { allowed: true };
}
