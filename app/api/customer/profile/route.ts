import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateCustomerProfileSchema } from "@/lib/api-schemas";

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

  // Get the user from our database
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { customerProfile: true },
  });

  if (!user) {
    return sendError("User not found", "NOT_FOUND", 404);
  }

  if (user.role !== "CUSTOMER") {
    return sendError(
      "Only customers can update customer profile",
      "FORBIDDEN",
      403
    );
  }

  if (!user.customerProfile) {
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
