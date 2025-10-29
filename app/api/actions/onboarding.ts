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
  hourlyRate: number;
  minimumFee: number;
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
    select: {
      id: true,
    },
  });
  if (!user) throw new Error("User not found in database");

  console.log("Processing form data for user:", userId);

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

      if (!address || !city || !state || !country || !postalCode) {
        throw new Error("Missing required fields for customer");
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { clerkUserId: userId },
          data: { role: "CUSTOMER" },
        }),
        prisma.customerProfile.upsert({
          where: { userId: user.id },
          update: { address, city, state, country, postalCode },
          create: {
            userId: user.id,
            address,
            city,
            state,
            country,
            postalCode,
          },
        }),
      ]);

      revalidatePath("/");
      return { success: true, redirect: "/onboarding/finish" };
    }

    if (role === "WORKER") {
      console.log("Processing WORKER role");

      const skilledInRaw = formData.get("skilledIn")?.toString();
      console.log("skilledInRaw:", skilledInRaw);

      let skilledIn: string[] = [];
      try {
        skilledIn = skilledInRaw
          ? JSON.parse(skilledInRaw)
              .map((s: string) => s?.toLowerCase().trim())
              .filter(Boolean)
          : [];
      } catch (e) {
        console.error("Error parsing skilledIn:", e);
        throw new Error("Invalid skilledIn data format");
      }

      const qualification = formData.get("qualification")?.toString() || null;
      const certificatesRaw = formData.get("certificates")?.toString();
      console.log("certificatesRaw:", certificatesRaw);

      let certificates: string[] = [];
      try {
        certificates = certificatesRaw ? JSON.parse(certificatesRaw) : [];
      } catch (e) {
        console.error("Error parsing certificates:", e);
        throw new Error("Invalid certificates data format");
      }
      const aadharNumber = formData.get("aadharNumber")?.toString();
      const yearsExperience = formData.get("yearsExperience")
        ? parseInt(formData.get("yearsExperience")!.toString(), 10)
        : null;
      const hourlyRate = formData.get("hourlyRate")
        ? parseFloat(formData.get("hourlyRate")!.toString())
        : null;
      const minimumFee = formData.get("minimumFee")
        ? parseFloat(formData.get("minimumFee")!.toString())
        : null;
      const profilePic = formData.get("profilePic")?.toString() || null;
      const bio = formData.get("bio")?.toString() || null;
      const address = formData.get("address")?.toString();
      const city = formData.get("city")?.toString();
      const state = formData.get("state")?.toString();
      const country = formData.get("country")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      const availableAreasRaw = formData.get("availableAreas")?.toString();
      console.log("availableAreasRaw:", availableAreasRaw);

      let availableAreas: string[] = [];
      try {
        availableAreas = availableAreasRaw
          ? JSON.parse(availableAreasRaw)
              .map((s: string) => s?.trim())
              .filter(Boolean)
          : [];
      } catch (e) {
        console.error("Error parsing availableAreas:", e);
        throw new Error("Invalid availableAreas data format");
      }

      const previousWorksRaw = formData.get("previousWorks")?.toString();
      console.log("previousWorksRaw:", previousWorksRaw);

      let previousWorks: Array<{
        id: string;
        title: string;
        description: string;
        imageUrl: string;
      }> = [];
      try {
        previousWorks = previousWorksRaw ? JSON.parse(previousWorksRaw) : [];
      } catch (e) {
        console.error("Error parsing previousWorks:", e);
        // previousWorks is optional, so don't throw error
        previousWorks = [];
      }

      if (
        !skilledIn.length ||
        !aadharNumber ||
        !hourlyRate ||
        !minimumFee ||
        !address ||
        !city ||
        !state ||
        !country ||
        !postalCode
      ) {
        throw new Error("Missing required fields for worker");
      }

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

      // Parse optional latitude/longitude from the form (strings -> numbers)
      const latRaw = formData.get("latitude")?.toString();
      const lngRaw = formData.get("longitude")?.toString();
      const latitude = latRaw ? parseFloat(latRaw) : undefined;
      const longitude = lngRaw ? parseFloat(lngRaw) : undefined;

      // Build profile payload and include lat/lng when present
      const profileData = {
        skilledIn,
        qualification,
        certificates,
        aadharNumber,
        yearsExperience,
        hourlyRate,
        minimumFee,
        profilePic,
        bio,
        address,
        city,
        state,
        country,
        postalCode,
        availableAreas,
        ...(typeof latitude === "number" && !Number.isNaN(latitude)
          ? { latitude }
          : {}),
        ...(typeof longitude === "number" && !Number.isNaN(longitude)
          ? { longitude }
          : {}),
      };

      await prisma.$transaction([
        prisma.user.update({
          where: { clerkUserId: userId },
          data: { role: "WORKER" },
        }),
        prisma.workerProfile.upsert({
          where: { userId: user.id },
          update: profileData,
          create: { userId: user.id, ...profileData },
        }),
      ]);

      // Handle previous works if any
      if (previousWorks.length > 0) {
        const workerProfile = await prisma.workerProfile.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        if (workerProfile) {
          // Delete existing previous works and create new ones
          await prisma.previousWork.deleteMany({
            where: { workerId: workerProfile.id },
          });

          await prisma.previousWork.createMany({
            data: previousWorks.map(
              (work: {
                id: string;
                title: string;
                description: string;
                imageUrl: string;
              }) => ({
                workerId: workerProfile.id,
                title: work.title,
                description: work.description || null,
                images: [work.imageUrl].filter(Boolean),
              })
            ),
          });
        }
      }

      revalidatePath("/");
      return { success: true, redirect: "/onboarding/finish" };
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
        workerProfile: {
          include: {
            previousWorks: true,
          },
        },
        customerProfile: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
