import { NextRequest } from "next/server";
import { protectCustomerApi } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { getCustomerJobs } from "@/lib/services/customer-service";
import { canAccessCustomerProtectedRoutes } from "@/lib/access/customer-access";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { user, response } = await protectCustomerApi(request);
  if (response) return response;

  if (!user) return sendError("Unauthorized", "UNAUTHORIZED", 401);

  const access = canAccessCustomerProtectedRoutes(user);
  if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);

  const jobs = await getCustomerJobs(user.id);

  return sendSuccess({ jobs });
});
