// Usage tracking removed — no-op stubs kept for compatibility.
// Remove imports and calls to usage tracking if you want the codebase cleaned fully.

export class UsageTracker {
  static async trackBooking(_clerkUserId: string) {
    return true;
  }

  static async trackLead(_clerkUserId: string) {
    return true;
  }

  static async trackJobCompletion(_clerkUserId: string) {
    return true;
  }

  static async canUserPerformAction(
    _clerkUserId: string,
    _action: "booking" | "lead"
  ) {
    return { canPerform: true, needsUpgrade: false } as any;
  }
}

// Helper kept for compatibility
export async function getCurrentUserId() {
  return null;
}
