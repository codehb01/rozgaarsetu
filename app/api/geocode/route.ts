import { NextRequest } from "next/server";
import { geocodeFreeOSM } from "@/lib/geocoding";
import { sendSuccess, withErrorHandling } from "@/lib/api-response";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q.trim()) {
    return sendSuccess({ results: [] });
  }
  const results = await geocodeFreeOSM(q);
  return sendSuccess({ results });
});
