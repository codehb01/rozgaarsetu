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
  // OpenStreetMap address fields
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  locality?: string;
  sublocality?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  placeId: string;
  availableAreas: string[];
};

export type CustomerFormData = {
  // OpenStreetMap address fields
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  locality?: string;
  sublocality?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  placeId: string;
};

export async function setUserRole(
  formData: FormData
): Promise<{ success: boolean; redirect?: string; error?: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  console.log("setUserRole called for userId:", userId);

  // Get or create user record
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  
  // If user doesn't exist, create them using checkUser logic
  if (!user) {
    const { checkUser } = await import("@/lib/checkUser");
    user = await checkUser();
    if (!user) throw new Error("Failed to create user in database");
  }

  console.log("User found/created:", user.id, user.role);

  const roleRaw = formData.get("role");
  const role = typeof roleRaw === "string" ? roleRaw.toUpperCase() : "";
  console.log("Selected role:", role);
  
  if (!role || !["WORKER", "CUSTOMER"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    if (role === "CUSTOMER") {
      // Get Google Maps address data
      const formattedAddress = formData.get("formattedAddress")?.toString();
      const placeId = formData.get("placeId")?.toString();
      const streetNumber = formData.get("streetNumber")?.toString();
      const streetName = formData.get("streetName")?.toString();
      const locality = formData.get("locality")?.toString();
      const sublocality = formData.get("sublocality")?.toString();
      const city = formData.get("city")?.toString();
      const state = formData.get("state")?.toString();
      const country = formData.get("country")?.toString();
      const postalCode = formData.get("postalCode")?.toString();

      console.log("Customer data:", { 
        formattedAddress, placeId, streetNumber, streetName, 
        locality, sublocality, city, state, country, postalCode 
      });

      if (!formattedAddress || !city || !state || !country || !postalCode) {
        throw new Error("Missing required address fields for customer");
      }

      console.log("Creating customer profile for user:", user.id);

      const result = await prisma.$transaction([
        prisma.user.update({
          where: { clerkUserId: userId },
          data: { role: "CUSTOMER" },
        }),
        prisma.customerProfile.upsert({
          where: { userId: user.id },
          update: { 
            formattedAddress,
            placeId,
            streetNumber,
            streetName,
            locality,
            sublocality,
            city, 
            state, 
            country, 
            postalCode,
          },
          create: {
            userId: user.id,
            formattedAddress,
            placeId,
            streetNumber,
            streetName,
            locality,
            sublocality,
            city,
            state,
            country,
            postalCode,
          },
        }),
      ]);

      console.log("Customer profile created successfully:", result[1]);
      revalidatePath("/");
      return { success: true, redirect: "/customer" };
    }

    if (role === "WORKER") {
      // Handle arrays that might be JSON strings or actual arrays
      const skilledInRaw = formData.get("skilledIn")?.toString();
      let skilledIn: string[] = [];
      try {
        skilledIn = skilledInRaw ? JSON.parse(skilledInRaw) : [];
      } catch {
        // Fallback to treating as comma-separated string
        skilledIn = skilledInRaw ? skilledInRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      skilledIn = skilledIn.map(s => s.toLowerCase().trim()).filter(Boolean);

      const qualification = formData.get("qualification")?.toString() || null;
      
      const certificatesRaw = formData.get("certificates")?.toString();
      let certificates: string[] = [];
      try {
        certificates = certificatesRaw ? JSON.parse(certificatesRaw) : [];
      } catch {
        certificates = certificatesRaw ? certificatesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      }

      const aadharNumber = formData.get("aadharNumber")?.toString();
      const yearsExperience = formData.get("yearsExperience")
        ? parseInt(formData.get("yearsExperience")!.toString(), 10)
        : null;
      const profilePic = formData.get("profilePic")?.toString() || null;
      const bio = formData.get("bio")?.toString() || null;
      
      // Get Google Maps address data
      const formattedAddress = formData.get("formattedAddress")?.toString();
      const placeId = formData.get("placeId")?.toString();
      const streetNumber = formData.get("streetNumber")?.toString();
      const streetName = formData.get("streetName")?.toString();
      const locality = formData.get("locality")?.toString();
      const sublocality = formData.get("sublocality")?.toString();
      const city = formData.get("city")?.toString();
      const state = formData.get("state")?.toString();
      const country = formData.get("country")?.toString();
      const postalCode = formData.get("postalCode")?.toString();
      
      const availableAreasRaw = formData.get("availableAreas")?.toString();
      let availableAreas: string[] = [];
      try {
        availableAreas = availableAreasRaw ? JSON.parse(availableAreasRaw) : [];
      } catch {
        availableAreas = availableAreasRaw ? availableAreasRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
      }

      console.log("Worker data:", { 
        skilledIn, certificates, availableAreas, aadharNumber, 
        formattedAddress, placeId, streetNumber, streetName,
        locality, sublocality, city, state, country, postalCode,
        qualification, yearsExperience, bio 
      });

      if (
        !skilledIn.length ||
        !aadharNumber ||
        !formattedAddress ||
        !city ||
        !state ||
        !country ||
        !postalCode
      ) {
        const missing = [];
        if (!skilledIn.length) missing.push("skills");
        if (!aadharNumber) missing.push("aadharNumber");
        if (!formattedAddress) missing.push("address");
        if (!city) missing.push("city");
        if (!state) missing.push("state");
        if (!country) missing.push("country");
        if (!postalCode) missing.push("postalCode");
        
        console.log("Missing required fields:", missing);
        throw new Error(`Missing required fields for worker: ${missing.join(", ")}`);
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

      console.log("Creating worker profile for user:", user.id);

      const result = await prisma.$transaction([
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
            formattedAddress,
            placeId,
            streetNumber,
            streetName,
            locality,
            sublocality,
            city,
            state,
            country,
            postalCode,
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
            formattedAddress,
            placeId,
            streetNumber,
            streetName,
            locality,
            sublocality,
            city,
            state,
            country,
            postalCode,
            availableAreas,
          },
        }),
      ]);

      console.log("Worker profile created successfully:", result[1]);

      revalidatePath("/");
      return { success: true, redirect: "/worker" };
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
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        workerProfile: true,
        customerProfile: true,
      },
    });
    
    // If user doesn't exist, create them using checkUser logic
    if (!user) {
      const { checkUser } = await import("@/lib/checkUser");
      user = await checkUser();
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
