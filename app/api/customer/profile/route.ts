import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateCustomerProfileSchema } from "@/lib/api-schemas";
import { protectCustomerApi } from "@/lib/api-auth";

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  if (!user?.customerProfile) {
    return sendError("Customer profile not found", "NOT_FOUND", 404);
  }

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

  const { address, city, state, postalCode, country } = validation.data;

  // Update the customer profile
  const updatedProfile = await prisma.customerProfile.update({
    where: { id: user.customerProfile.id },
    data: { address, city, state, postalCode, country },
  });

  return sendSuccess({ profile: updatedProfile });
});
