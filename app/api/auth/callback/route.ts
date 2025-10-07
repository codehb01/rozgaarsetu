import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Check if user exists in database
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true },
    });

    // If user doesn't exist or has no role, redirect to onboarding
    if (!user || !user.role || user.role === "UNASSIGNED") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Redirect to appropriate dashboard based on role
    const dashboardPath =
      user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
    
    return NextResponse.redirect(new URL(dashboardPath, req.url));
  } catch (error) {
    console.error("Error in auth callback:", error);
    // Fallback to home page on error
    return NextResponse.redirect(new URL("/", req.url));
  }
}
