import { NextRequest } from "next/server";
import { geocodeFreeOSM } from "@/lib/geocoding";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const rl = checkRateLimit(req);
  if (!rl.success) return sendError("Too many requests", "RATE_LIMIT_EXCEEDED", 429);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q.trim()) {
    return sendSuccess({ results: [] });
  }
  const results = await geocodeFreeOSM(q);
  return sendSuccess({ results });
});
