import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";

export type UserRole = "CUSTOMER" | "WORKER" | "UNASSIGNED";

/**
 * Get current user with role information
 */
export async function getAuthenticatedUser() {
  try {
    const user = await checkUser();
    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export async function checkUserRole(
  requiredRole: Exclude<UserRole, "UNASSIGNED">
) {
  const user = await getAuthenticatedUser();

  // User not found or not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // User doesn't have a role yet (needs onboarding)
  if (!user.role || user.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  // User has wrong role
  if (user.role !== requiredRole) {
    const redirectPath =
      user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
    redirect(redirectPath);
  }

  return user;
}

/**
 * Redirect user to appropriate dashboard based on role
 */
export async function redirectToDashboard() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.role || user.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  const redirectPath =
    user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
  redirect(redirectPath);
}

/**
 * Check if user can access onboarding (only if they don't have a role)
 */
export async function checkOnboardingAccess(allowWithRole = false) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If allowWithRole is true, don't redirect users who already have a role
  // This is used for pages like /onboarding/finish
  if (!allowWithRole && user.role && user.role !== "UNASSIGNED") {
    const redirectPath =
      user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
    redirect(redirectPath);
  }

  return user;
}
