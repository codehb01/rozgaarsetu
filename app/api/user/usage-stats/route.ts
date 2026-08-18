import { sendError, withErrorHandling } from "@/lib/api-response";

// Usage stats endpoint removed — subscription/usage features disabled.
export const GET = withErrorHandling(async () => {
  return sendError("Usage stats feature has been removed", "FEATURE_DISABLED", 404);
});
