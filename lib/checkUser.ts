import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
export const checkUser = async () => {
  const user = await currentUser();
  //   console.log(user);
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: { workerProfile: true, customerProfile: true },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const first = user.firstName?.trim() ?? "";
    const last = user.lastName?.trim() ?? "";
    const name = `${first} ${last}`.trim() || user.username || "User";

    // Build safe, unique fallbacks to satisfy unique constraints in schema
    const clerkEmail = user.emailAddresses?.[0]?.emailAddress;
    const clerkPhone = user.phoneNumbers?.[0]?.phoneNumber;
    const email = clerkEmail ?? `no-email-${user.id}@placeholder.local`;
    const phone = clerkPhone ?? `no-phone-${user.id}`;

    // If a user already exists with this email, link it to Clerk user and return
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      if (existingByEmail.clerkUserId !== user.id) {
        await prisma.user.update({
          where: { email },
          data: { clerkUserId: user.id, name },
        });
        // refetch with includes
        const refetched = await prisma.user.findUnique({
          where: { clerkUserId: user.id },
          include: { workerProfile: true, customerProfile: true },
        });
        return refetched;
      }
      // ensure include shape
      const refetched = await prisma.user.findUnique({
        where: { clerkUserId: existingByEmail.clerkUserId },
        include: { workerProfile: true, customerProfile: true },
      });
      return refetched;
    }

    // If a user exists with this phone, link to Clerk user and return
    if (clerkPhone) {
      const existingByPhone = await prisma.user.findUnique({
        where: { phone: clerkPhone },
      });
      if (existingByPhone) {
        if (existingByPhone.clerkUserId !== user.id) {
          await prisma.user.update({
            where: { phone: clerkPhone },
            data: { clerkUserId: user.id, name },
          });
          const refetched = await prisma.user.findUnique({
            where: { clerkUserId: user.id },
            include: { workerProfile: true, customerProfile: true },
          });
          return refetched;
        }
        const refetched = await prisma.user.findUnique({
          where: { clerkUserId: existingByPhone.clerkUserId },
          include: { workerProfile: true, customerProfile: true },
        });
        return refetched;
      }
    }

    // Create or update by clerkUserId (avoids race conditions)
    await prisma.user.upsert({
      where: { clerkUserId: user.id },
      create: { clerkUserId: user.id, name, email, phone },
      update: { name, email, phone },
    });
    const finalUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
      include: { workerProfile: true, customerProfile: true },
    });
    return finalUser;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
};
