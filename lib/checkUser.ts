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

    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name,
        email: user.emailAddresses?.[0]?.emailAddress || "", // Provide a fallback if email is missing
        phone: user.phoneNumbers?.[0]?.phoneNumber || "", // Provide a fallback if phone is missing
      },
    });
    return newUser;
  } catch (error) {}
};
