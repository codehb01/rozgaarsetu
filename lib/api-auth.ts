import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/app/api/actions/onboarding";
import { sendError } from "./api-response";
import { User } from "@prisma/client";

export type UserRole = "CUSTOMER" | "WORKER";

// Using Awaited<ReturnType<typeof getCurrentUser>> handles the full include structure properly
export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function protectApiRoute(
  request: NextRequest,
  requiredRole?: UserRole
): Promise<{ user: AuthenticatedUser | null; response?: NextResponse }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        user: null,
        response: sendError("Unauthorized", "UNAUTHORIZED", 401),
      };
    }

    const user = await getCurrentUser();

    if (!user) {
      return {
        user: null,
        response: sendError("User not found", "USER_NOT_FOUND", 404),
      };
    }

    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      return {
        user: null,
        response: sendError(
          `Access denied. ${requiredRole} role required.`,
          "FORBIDDEN",
          403,
          { userRole: user.role }
        ),
      };
    }

    return { user };
  } catch (error) {
    console.error("API route protection error:", error);
    return {
      user: null,
      response: sendError("Internal server error", "INTERNAL_ERROR", 500),
    };
  }
}

export async function protectWorkerApi(request: NextRequest) {
  return protectApiRoute(request, "WORKER");
}

export async function protectCustomerApi(request: NextRequest) {
  return protectApiRoute(request, "CUSTOMER");
}
