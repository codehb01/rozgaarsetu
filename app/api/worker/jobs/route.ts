import { NextRequest } from "next/server";
import { protectWorkerApi } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { getWorkerJobs } from "@/lib/services/worker-service";
import { canAccessWorkerProtectedRoutes } from "@/lib/access/worker-access";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { user, response } = await protectWorkerApi(request);
  if (response) return response;

  if (!user) return sendError("Unauthorized", "UNAUTHORIZED", 401);

  const access = canAccessWorkerProtectedRoutes(user);
  if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);

  const jobs = await getWorkerJobs(user.id);

  return sendSuccess({ jobs });
});
