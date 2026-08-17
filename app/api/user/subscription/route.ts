import { sendError, withErrorHandling } from "@/lib/api-response";

// Subscription endpoint removed — subscription/usage features disabled.
export const POST = withErrorHandling(async () => {
  return sendError("Subscription feature has been removed", "FEATURE_DISABLED", 404);
});

export const GET = withErrorHandling(async () => {
  return sendError("Subscription feature has been removed", "FEATURE_DISABLED", 404);
});
