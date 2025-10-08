import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SubscriptionService } from "@/lib/subscription-service";
import { PlanType } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planType, durationMonths = 1 } = body;

    // Validate plan type
    if (!Object.values(PlanType).includes(planType)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upgrade subscription
    const subscription = await SubscriptionService.upgradeSubscription(
      user.id,
      planType,
      durationMonths
    );

    return NextResponse.json({
      success: true,
      subscription: {
        planType: subscription.planType,
        planExpiry: subscription.planExpiry,
        isActive: subscription.isActive,
      },
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get subscription
    const subscription = await SubscriptionService.getUserSubscription(user.id);

    return NextResponse.json({
      planType: subscription.planType,
      planExpiry: subscription.planExpiry,
      isActive: subscription.isActive,
      userRole: user.role,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
