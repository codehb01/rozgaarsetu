import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/app/api/actions/onboarding";

export type UserRole = "CUSTOMER" | "WORKER";

export async function protectApiRoute(
  request: NextRequest,
  requiredRole?: UserRole
): Promise<{ user: unknown; response?: NextResponse }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        user: null,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const user = await getCurrentUser();

    if (!user) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        ),
      };
    }

    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) {
      return {
        user: null,
        response: NextResponse.json(
          {
            error: `Access denied. ${requiredRole} role required.`,
            userRole: user.role,
          },
          { status: 403 }
        ),
      };
    }

    return { user };
  } catch (error) {
    console.error("API route protection error:", error);
    return {
      user: null,
      response: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      ),
    };
  }
}

export async function protectWorkerApi(request: NextRequest) {
  return protectApiRoute(request, "WORKER");
}

export async function protectCustomerApi(request: NextRequest) {
  return protectApiRoute(request, "CUSTOMER");
}
