import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    console.log("🔍 Check-profile API called");
    console.log("Clerk user:", clerkUser?.id);

    if (!clerkUser) {
      console.log("❌ No Clerk user found, redirecting to sign-in");
      return NextResponse.json({ redirectUrl: "/sign-in" });
    }

    // Check if user exists in database
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { role: true },
    });

    console.log("Database user:", user);

    // If user doesn't exist or has no role, redirect to onboarding
    if (!user || !user.role || user.role === "UNASSIGNED") {
      console.log("✅ No user/role found, redirecting to onboarding");
      return NextResponse.json({ redirectUrl: "/onboarding" });
    }

    // Redirect to appropriate dashboard based on role
    const dashboardPath =
      user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
    
    console.log(`✅ User has role: ${user.role}, redirecting to ${dashboardPath}`);
    return NextResponse.json({ redirectUrl: dashboardPath });
  } catch (error) {
    console.error("❌ Error checking user profile:", error);
    return NextResponse.json({ redirectUrl: "/" });
  }
}
