import { NextRequest } from "next/server";
import { reverseGeocodeFreeOSM } from "@/lib/geocoding";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return sendError("lat/lng required", "VALIDATION_ERROR", 400);
  }
  const result = await reverseGeocodeFreeOSM(lat, lng);
  return sendSuccess({ result });
});
