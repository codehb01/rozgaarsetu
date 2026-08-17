import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { updateWorkerProfileSchema } from "@/lib/api-schemas";

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

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

  // Find the user's worker profile
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { workerProfile: true },
  });

  if (!user || !user.workerProfile) {
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
