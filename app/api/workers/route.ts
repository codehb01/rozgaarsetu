import { NextRequest } from "next/server";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { searchWorkers } from "@/lib/services/worker-service";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const rl = checkRateLimit(req);
  if (!rl.success) return sendError("Too many requests", "RATE_LIMIT_EXCEEDED", 429);

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.toLowerCase().trim() ?? "";
  const category = url.searchParams.get("category")?.toLowerCase().trim() ?? "";
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1),
    200
  );
  const sort = (url.searchParams.get("sort") || "relevance").toLowerCase();
  const latStr = url.searchParams.get("lat");
  const lngStr = url.searchParams.get("lng");
  
  const lat = latStr ? parseFloat(latStr) : undefined;
  const lng = lngStr ? parseFloat(lngStr) : undefined;

  const result = await searchWorkers({ q, category, limit, sort, lat, lng });

  return sendSuccess(result);
});
