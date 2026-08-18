import { NextRequest } from "next/server";
import { reverseGeocodeFreeOSM } from "@/lib/geocoding";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const rl = checkRateLimit(req);
  if (!rl.success) return sendError("Too many requests", "RATE_LIMIT_EXCEEDED", 429);

  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return sendError("lat/lng required", "VALIDATION_ERROR", 400);
  }
  const result = await reverseGeocodeFreeOSM(lat, lng);
  return sendSuccess({ result });
});
