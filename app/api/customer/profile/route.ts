import { NextRequest } from "next/server";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateCustomerProfileSchema } from "@/lib/api-schemas";
import { protectCustomerApi } from "@/lib/api-auth";
import { updateCustomerProfile } from "@/lib/services/customer-service";
import { canUpdateCustomerProfile } from "@/lib/access/customer-access";

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  if (!user) return sendError("Unauthorized", "UNAUTHORIZED", 401);

  const access = canUpdateCustomerProfile(user);
  if (!access.allowed) return sendError(access.error, "FORBIDDEN", access.status);

  const body = await req.json();
  const validation = updateCustomerProfileSchema.safeParse(body);
  if (!validation.success) {
    return sendError(
      "Invalid request",
      "VALIDATION_ERROR",
      400,
      validation.error.flatten().fieldErrors
    );
  }

  const updatedProfile = await updateCustomerProfile(user.customerProfile!.id, validation.data);

  return sendSuccess({ profile: updatedProfile });
});
