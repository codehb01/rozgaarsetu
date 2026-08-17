import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";
import { auth } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";

export const GET = withErrorHandling(async () => {
  const { userId } = await auth();

  if (!userId) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

  const user = await checkUser();

  if (!user) {
    return sendError("User not found", "NOT_FOUND", 404);
  }

  return sendSuccess({
    id: user.id,
    name: user.name,
    role: user.role,
    clerkUserId: user.clerkUserId,
  });
});