import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      bio,
      skilledIn,
      qualification,
      yearsExperience,
      hourlyRate,
      minimumFee,
      address,
      city,
      state,
      postalCode,
      country,
    } = body;

    // Validate required fields
    if (!skilledIn || skilledIn.length === 0) {
      return NextResponse.json(
        { error: "At least one skill is required" },
        { status: 400 }
      );
    }

    if (hourlyRate !== undefined && hourlyRate < 0) {
      return NextResponse.json(
        { error: "Hourly rate cannot be negative" },
        { status: 400 }
      );
    }

    if (minimumFee !== undefined && minimumFee < 0) {
      return NextResponse.json(
        { error: "Minimum fee cannot be negative" },
        { status: 400 }
      );
    }

    // Find the user's worker profile
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { workerProfile: true },
    });

    if (!user || !user.workerProfile) {
      return NextResponse.json(
        { error: "Worker profile not found" },
        { status: 404 }
      );
    }

    // Update the worker profile
    const updatedProfile = await prisma.workerProfile.update({
      where: { id: user.workerProfile.id },
      data: {
        bio,
        skilledIn,
        qualification,
        yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        minimumFee: minimumFee ? parseFloat(minimumFee) : undefined,
        address,
        city,
        state,
        postalCode,
        country,
      },
      include: {
        previousWorks: {
          orderBy: { createdAt: "desc" },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating worker profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
