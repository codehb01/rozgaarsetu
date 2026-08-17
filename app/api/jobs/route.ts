import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { protectCustomerApi } from "@/lib/api-auth";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { createJobSchema } from "@/lib/api-schemas";
import { canCreateJob } from "@/lib/access/job-access";
import { createJob } from "@/lib/services/job-service";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  if (!user) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

  const access = canCreateJob(user);
  if (!access.allowed) {
    return sendError(access.error, "FORBIDDEN", access.status);
  }

  const body = await req.json();
  const validation = createJobSchema.safeParse(body);
  if (!validation.success) {
    return sendError(
      "Invalid request",
      "VALIDATION_ERROR",
      400,
      validation.error.flatten().fieldErrors
    );
  }

  const { workerId, description, details, datetime, location, charge } =
    validation.data;

  const dt = new Date(datetime);
  if (isNaN(dt.getTime())) {
    return sendError("Invalid datetime", "VALIDATION_ERROR", 400);
  }

  // Validate worker exists and is role WORKER
  const worker = await prisma.user.findUnique({ where: { id: workerId } });

  if (!worker) {
    return sendError("Worker not found", "NOT_FOUND", 404);
  }

  if (worker.role !== "WORKER") {
    return sendError(
      "Invalid worker",
      "INVALID_WORKER",
      400,
      `User exists but has role '${worker.role}' instead of 'WORKER'`
    );
  }

  const job = await createJob(
    user.id,
    worker.id,
    description,
    details,
    datetime,
    location,
    charge
  );

  return sendSuccess({ job }, 201);
});
