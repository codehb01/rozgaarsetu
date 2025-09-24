"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type WorkerFormData = {
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

export type CustomerFormData = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export async function setUserRole(
  formData: FormData
): Promise<{ success: boolean; redirect?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get user record
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found in database");

  const roleRaw = formData.get("role");
  const role = typeof roleRaw === "string" ? roleRaw.toUpperCase() : "";
  if (!role || !["WORKER", "CUSTOMER"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    if (role === "CUSTOMER") {
      const address = formData.get("address")?.toString();
      const city = formData.get("city")?.toString();
      const state = formData.get("state")?.toString();
      const country = formData.get("country")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const latitude = formData.get("latitude")?.toString();
      const longitude = formData.get("longitude")?.toString();

      if (!address || !city || !state || !country || !postalCode) {
        throw new Error("Missing required fields for customer");
      }

      // Parse coordinates if available
      const coords = {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      };

      await prisma.$transaction([
        prisma.user.update({
          where: { clerkUserId: userId },
          data: { role: "CUSTOMER" },
        }),
        prisma.customerProfile.upsert({
          where: { userId: user.id },
          update: { 
            address, 
            city, 
            state, 
            country, 
            postalCode,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          create: {
            userId: user.id,
            address,
            city,
            state,
            country,
            postalCode,
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        }),
      ]);

      revalidatePath("/");
      return { success: true, redirect: "/customer/dashboard" };
    }

    if (role === "WORKER") {
      const skilledInRaw = formData.getAll("skilledIn") as string[];
      const skilledIn = skilledInRaw
        .map((s) => s?.toString().toLowerCase().trim())
        .filter(Boolean);
      const qualification = formData.get("qualification")?.toString() || null;
      const certificates = formData.getAll("certificates") as string[];
      const aadharNumber = formData.get("aadharNumber")?.toString();
      const yearsExperience = formData.get("yearsExperience")
        ? parseInt(formData.get("yearsExperience")!.toString(), 10)
        : null;
      const profilePic = formData.get("profilePic")?.toString() || null;
      const bio = formData.get("bio")?.toString() || null;
      const address = formData.get("address")?.toString();
      const city = formData.get("city")?.toString();
      const state = formData.get("state")?.toString();
      const country = formData.get("country")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const latitude = formData.get("latitude")?.toString();
      const longitude = formData.get("longitude")?.toString();
      const availableAreasRaw = formData.getAll("availableAreas") as string[];
      const availableAreas = availableAreasRaw
        .map((s) => s?.toString().trim())
        .filter(Boolean);

      if (
        !skilledIn.length ||
        !aadharNumber ||
        !address ||
        !city ||
        !state ||
        !country ||
        !postalCode
      ) {
        throw new Error("Missing required fields for worker");
      }

      // Parse coordinates if available
      const coords = {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      };

      // Check if aadharNumber is already used by another user
      const existingAadhar = await prisma.workerProfile.findFirst({
        where: {
          aadharNumber,
          NOT: { userId: user.id },
        },
        select: { id: true },
      });
      if (existingAadhar) {
        return {
          success: false,
          error: "Aadhar number already exists for another worker.",
        };
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { clerkUserId: userId },
          data: { role: "WORKER" },
        }),
        prisma.workerProfile.upsert({
          where: { userId: user.id },
          update: {
            skilledIn,
            qualification,
            certificates,
            aadharNumber,
            yearsExperience,
            profilePic,
            bio,
            address,
            city,
            state,
            country,
            postalCode,
            latitude: coords.latitude,
            longitude: coords.longitude,
            availableAreas,
          },
          create: {
            userId: user.id,
            skilledIn,
            qualification,
            certificates,
            aadharNumber,
            yearsExperience,
            profilePic,
            bio,
            address,
            city,
            state,
            country,
            postalCode,
            latitude: coords.latitude,
            longitude: coords.longitude,
            availableAreas,
          },
        }),
      ]);

      revalidatePath("/");
      return { success: true, redirect: "/worker/dashboard" };
    }

    return { success: false, error: "Unhandled role" };
  } catch (error: unknown) {
    console.error("Failed to set user role:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update user profile";
    return { success: false, error: message };
  }
}

/**
 * Get current user + profile info
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        workerProfile: true,
        customerProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
