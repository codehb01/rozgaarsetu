"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type WorkerFormData = {
  skilledIn: string[];
  qualification?: string;
  certificates?: string[];
  aadharNumber: string;
  yearsExperience?: number;
  profilePic?: string;
  bio?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  availableAreas: string[];
};

type CustomerFormData = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

/**
 * Sets Worker profile
 */
export async function createWorkerProfile(formData: WorkerFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists
  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  // Create WorkerProfile
  const worker = await prisma.workerProfile.create({
    data: {
      userId: user.id,
      skilledIn: formData.skilledIn,
      qualification: formData.qualification,
      certificates: formData.certificates,
      aadharNumber: formData.aadharNumber,
      yearsExperience: formData.yearsExperience,
      profilePic: formData.profilePic,
      bio: formData.bio,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
      availableAreas: formData.availableAreas,
    },
  });

  // Update user role
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "WORKER" },
  });

  revalidatePath("/worker/dashboard");

  return { success: true, redirect: "/worker/dashboard" };
}

/**
 * Sets Customer profile
 */
export async function createCustomerProfile(formData: CustomerFormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const customer = await prisma.customerProfile.create({
    data: {
      userId: user.id,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "CUSTOMER" },
  });

  revalidatePath("/customer/dashboard");

  return { success: true, redirect: "/customer/dashboard" };
}

/**
 * Get current user + profile info
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      workerProfile: true,
      customerProfile: true,
    },
  });

  return user;
}
