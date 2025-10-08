import { PlanType, UserRole } from "@prisma/client";
import prisma from "./prisma";

// Plan limits configuration
export const PLAN_LIMITS = {
  CUSTOMER: {
    FREE: { monthlyBookings: 7 },
    PRO: { monthlyBookings: -1 }, // unlimited
  },
  WORKER: {
    FREE: { monthlyLeads: 25 },
    BOOST: { monthlyLeads: -1 }, // unlimited
    PRO: { monthlyLeads: -1 }, // unlimited
  },
} as const;

// Plan pricing (in rupees)
export const PLAN_PRICING = {
  CUSTOMER: {
    PRO: 499,
  },
  WORKER: {
    BOOST: 199,
    PRO: 199, // Same as boost for workers
  },
} as const;

export class SubscriptionService {
  // Get or create user subscription
  static async getUserSubscription(userId: string) {
    let subscription = await prisma.userSubscription.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!subscription) {
      subscription = await prisma.userSubscription.create({
        data: {
          userId,
          planType: PlanType.FREE,
          isActive: true,
        },
        include: { user: true },
      });
    }

    return subscription;
  }

  // Get current month's usage
  static async getUserUsage(userId: string, month?: number, year?: number) {
    const currentDate = new Date();
    const targetMonth = month ?? currentDate.getMonth() + 1;
    const targetYear = year ?? currentDate.getFullYear();

    let usage = await prisma.usageTracking.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: targetMonth,
          year: targetYear,
        },
      },
    });

    if (!usage) {
      usage = await prisma.usageTracking.create({
        data: {
          userId,
          month: targetMonth,
          year: targetYear,
          monthlyBookings: 0,
          monthlyLeads: 0,
          completedJobs: 0,
        },
      });
    }

    return usage;
  }

  // Check if user can perform action based on limits
  static async canPerformAction(
    userId: string,
    action: "booking" | "lead"
  ): Promise<{
    canPerform: boolean;
    currentUsage: number;
    limit: number;
    needsUpgrade: boolean;
    planType: PlanType;
  }> {
    const [subscription, usage, user] = await Promise.all([
      this.getUserSubscription(userId),
      this.getUserUsage(userId),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    const userRole = user.role;
    const planType = subscription.planType;

    let currentUsage: number;
    let limit: number;

    if (action === "booking" && userRole === UserRole.CUSTOMER) {
      currentUsage = usage.monthlyBookings;
      limit =
        PLAN_LIMITS.CUSTOMER[planType as keyof typeof PLAN_LIMITS.CUSTOMER]
          ?.monthlyBookings ?? 0;
    } else if (action === "lead" && userRole === UserRole.WORKER) {
      currentUsage = usage.monthlyLeads;
      limit =
        PLAN_LIMITS.WORKER[planType as keyof typeof PLAN_LIMITS.WORKER]
          ?.monthlyLeads ?? 0;
    } else {
      throw new Error(`Invalid action ${action} for user role ${userRole}`);
    }

    const canPerform = limit === -1 || currentUsage < limit;
    const needsUpgrade = !canPerform && planType === PlanType.FREE;

    return {
      canPerform,
      currentUsage,
      limit: limit === -1 ? Infinity : limit,
      needsUpgrade,
      planType,
    };
  }

  // Increment usage counters
  static async incrementUsage(
    userId: string,
    action: "booking" | "lead" | "completed_job"
  ) {
    const usage = await this.getUserUsage(userId);

    const updateData: {
      monthlyBookings?: number;
      monthlyLeads?: number;
      completedJobs?: number;
    } = {};

    switch (action) {
      case "booking":
        updateData.monthlyBookings = usage.monthlyBookings + 1;
        break;
      case "lead":
        updateData.monthlyLeads = usage.monthlyLeads + 1;
        break;
      case "completed_job":
        updateData.completedJobs = usage.completedJobs + 1;
        break;
    }

    return await prisma.usageTracking.update({
      where: {
        userId_month_year: {
          userId,
          month: usage.month,
          year: usage.year,
        },
      },
      data: updateData,
    });
  }

  // Upgrade user subscription
  static async upgradeSubscription(
    userId: string,
    planType: PlanType,
    durationMonths: number = 1
  ) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

    return await prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        planType,
        planExpiry: expiryDate,
        isActive: true,
      },
      update: {
        planType,
        planExpiry: expiryDate,
        isActive: true,
      },
    });
  }

  // Check if subscription is expired
  static async checkAndUpdateExpiredSubscriptions() {
    const expiredSubscriptions = await prisma.userSubscription.findMany({
      where: {
        planExpiry: {
          lte: new Date(),
        },
        isActive: true,
        planType: {
          not: PlanType.FREE,
        },
      },
    });

    if (expiredSubscriptions.length > 0) {
      await prisma.userSubscription.updateMany({
        where: {
          id: {
            in: expiredSubscriptions.map((sub: { id: string }) => sub.id),
          },
        },
        data: {
          planType: PlanType.FREE,
          isActive: true,
          planExpiry: null,
        },
      });
    }

    return expiredSubscriptions.length;
  }

  // Get user's dashboard statistics
  static async getDashboardStats(userId: string) {
    const [subscription, usage, user] = await Promise.all([
      this.getUserSubscription(userId),
      this.getUserUsage(userId),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!user) throw new Error("User not found");

    const userRole = user.role;
    const planType = subscription.planType;

    const stats: {
      planType: PlanType;
      planExpiry: Date | null;
      isActive: boolean;
      bookings?: {
        current: number;
        limit: string | number;
        percentage: number;
      };
      leads?: { current: number; limit: string | number; percentage: number };
      completedJobs?: number;
    } = {
      planType,
      planExpiry: subscription.planExpiry,
      isActive: subscription.isActive,
    };

    if (userRole === UserRole.CUSTOMER) {
      const limit =
        PLAN_LIMITS.CUSTOMER[planType as keyof typeof PLAN_LIMITS.CUSTOMER]
          ?.monthlyBookings ?? 0;
      stats.bookings = {
        current: usage.monthlyBookings,
        limit: limit === -1 ? "Unlimited" : limit,
        percentage:
          limit === -1
            ? 0
            : Math.min((usage.monthlyBookings / limit) * 100, 100),
      };
    }

    if (userRole === UserRole.WORKER) {
      const limit =
        PLAN_LIMITS.WORKER[planType as keyof typeof PLAN_LIMITS.WORKER]
          ?.monthlyLeads ?? 0;
      stats.leads = {
        current: usage.monthlyLeads,
        limit: limit === -1 ? "Unlimited" : limit,
        percentage:
          limit === -1 ? 0 : Math.min((usage.monthlyLeads / limit) * 100, 100),
      };
      stats.completedJobs = usage.completedJobs;
    }

    return stats;
  }
}
