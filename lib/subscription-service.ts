// SubscriptionService removed — minimal noop stub retained for compatibility.
// If you are fully removing subscription functionality, remove imports and calls
// to this file. This stub keeps runtime safe but disables subscription enforcement.

export class SubscriptionService {
  static async getUserSubscription(_userId: string) {
    return null;
  }

  static async getUserUsage(_userId: string) {
    return { monthlyBookings: 0, monthlyLeads: 0, completedJobs: 0, month: 0, year: 0 };
  }

  static async canPerformAction(_userId: string, _action: "booking" | "lead") {
    return { canPerform: true, currentUsage: 0, limit: Infinity, needsUpgrade: false, planType: "FREE" } as any;
  }

  static async incrementUsage(_userId: string, _action: string) {
    return true;
  }

  static async upgradeSubscription() {
    throw new Error("Subscription upgrades are disabled in this build");
  }

  static async checkAndUpdateExpiredSubscriptions() {
    return 0;
  }

  static async getDashboardStats() {
    return { planType: null } as any;
  }
}
