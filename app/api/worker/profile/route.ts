import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateWorkerProfileSchema } from "@/lib/api-schemas";
import { protectWorkerApi } from "@/lib/api-auth";

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

  if (!user?.workerProfile) {
    return sendError("Worker profile not found", "NOT_FOUND", 404);
  }

  // Update the worker profile
  const updatedProfile = await prisma.workerProfile.update({
    where: { id: user.workerProfile.id },
    data: {
      bio: bio ?? undefined,
      skilledIn,
      qualification: qualification ?? undefined,
      yearsExperience: yearsExperience ? parseInt(String(yearsExperience)) : undefined,
      hourlyRate: hourlyRate ? parseFloat(String(hourlyRate)) : undefined,
      minimumFee: minimumFee ? parseFloat(String(minimumFee)) : undefined,
      address: address ?? undefined,
      city: city ?? undefined,
      state: state ?? undefined,
      postalCode: postalCode ?? undefined,
      country: country ?? undefined,
    },
    include: {
      previousWorks: {
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return sendSuccess({ profile: updatedProfile });
});
