import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const checkUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }

    // Try to find existing user first
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { workerProfile: true, customerProfile: true },
    });

    if (existingUser) {
      return existingUser;
    }

    // If user doesn't exist in DB but is authenticated, create a basic user record
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    const first = clerkUser.firstName?.trim() ?? "";
    const last = clerkUser.lastName?.trim() ?? "";
    const name = `${first} ${last}`.trim() || clerkUser.username || "User";

    const clerkEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
    const clerkPhone = clerkUser.phoneNumbers?.[0]?.phoneNumber;
    const email = clerkEmail ?? `no-email-${clerkUser.id}@placeholder.local`;
    const phone = clerkPhone ?? `no-phone-${clerkUser.id}`;

    // Create a basic user record
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        name,
        email,
        phone,
      },
      include: { workerProfile: true, customerProfile: true },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
