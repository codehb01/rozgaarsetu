import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateWorkerProfileSchema } from "@/lib/api-schemas";
import { protectWorkerApi } from "@/lib/api-auth";
import { updateWorkerProfile } from "@/lib/services/worker-service";
import { canUpdateWorkerProfile } from "@/lib/access/worker-access";

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectWorkerApi(req);
  if (response) return response;

  const body = await req.json();
  const validation = updateWorkerProfileSchema.safeParse(body);
  if (!validation.success) {
    return sendError(
      "Invalid request",
      "VALIDATION_ERROR",
      400,
      validation.error.flatten().fieldErrors
    );
  }

  const {
    bio,
    skilledIn,
    qualification,
    yearsExperience,
    hourlyRate,
    minimumFee,
    address,
    city,
    state,
    postalCode,
    country,
  } = validation.data;

  if (!user) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

  const access = canUpdateWorkerProfile(user);
  if (!access.allowed) {
    return sendError(access.error, "FORBIDDEN", access.status);
  }

  const updatedProfile = await updateWorkerProfile(user.workerProfile!.id, validation.data);

  return sendSuccess({ profile: updatedProfile });
});
