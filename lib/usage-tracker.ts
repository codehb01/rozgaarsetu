import { SubscriptionService } from "@/lib/subscription-service";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Usage tracking helpers
export class UsageTracker {
  // Track when a customer creates a booking
  static async trackBooking(clerkUserId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) return false;

      // Check if user can make more bookings
      const { canPerform } = await SubscriptionService.canPerformAction(
        user.id,
        "booking"
      );

      if (!canPerform) {
        return false; // Booking blocked
      }

      // Increment usage
      await SubscriptionService.incrementUsage(user.id, "booking");
      return true;
    } catch (error) {
      console.error("Error tracking booking:", error);
      return false;
    }
  }

  // Track when a worker receives a lead (job application)
  static async trackLead(clerkUserId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) return false;

      // Check if worker can receive more leads
      const { canPerform } = await SubscriptionService.canPerformAction(
        user.id,
        "lead"
      );

      if (!canPerform) {
        // Workers are never completely blocked, just notified
        console.log("Worker has exceeded free lead limit");
      }

      // Always increment lead count (important for business logic)
      await SubscriptionService.incrementUsage(user.id, "lead");
      return true;
    } catch (error) {
      console.error("Error tracking lead:", error);
      return false;
    }
  }

  // Track when a job is completed
  static async trackJobCompletion(clerkUserId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) return false;

      await SubscriptionService.incrementUsage(user.id, "completed_job");
      return true;
    } catch (error) {
      console.error("Error tracking job completion:", error);
      return false;
    }
  }

  // Check if user can perform action (for UI blocking)
  static async canUserPerformAction(
    clerkUserId: string,
    action: "booking" | "lead"
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) return { canPerform: false, needsUpgrade: false };

      const result = await SubscriptionService.canPerformAction(
        user.id,
        action
      );
      return {
        canPerform: result.canPerform,
        needsUpgrade: result.needsUpgrade,
        currentUsage: result.currentUsage,
        limit: result.limit,
        planType: result.planType,
      };
    } catch (error) {
      console.error("Error checking user action:", error);
      return { canPerform: false, needsUpgrade: false };
    }
  }
}

// Helper function to get current user ID from request
export async function getCurrentUserId() {
  try {
    const { userId: clerkUserId } = await auth();
    return clerkUserId;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}
