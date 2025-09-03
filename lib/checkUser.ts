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
        const updated = await prisma.user.update({
          where: { email },
          data: { clerkUserId: user.id, name },
        });
        return updated;
      }
      return existingByEmail;
    }

    // If a user exists with this phone, link to Clerk user and return
    if (clerkPhone) {
      const existingByPhone = await prisma.user.findUnique({
        where: { phone: clerkPhone },
      });
      if (existingByPhone) {
        if (existingByPhone.clerkUserId !== user.id) {
          const updated = await prisma.user.update({
            where: { phone: clerkPhone },
            data: { clerkUserId: user.id, name },
          });
          return updated;
        }
        return existingByPhone;
      }
    }

    // Create or update by clerkUserId (avoids race conditions)
    const upserted = await prisma.user.upsert({
      where: { clerkUserId: user.id },
      create: { clerkUserId: user.id, name, email, phone },
      update: { name, email, phone },
    });
    return upserted;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
};
