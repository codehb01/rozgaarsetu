import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { customerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can update customer profile" },
        { status: 403 }
      );
    }

    if (!user.customerProfile) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { address, city, state, postalCode, country } = body;

    // Validate required fields
    if (!address || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: "All address fields are required" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (address.length < 3) {
      return NextResponse.json(
        { error: "Address must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (city.length < 2) {
      return NextResponse.json(
        { error: "City must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (state.length < 2) {
      return NextResponse.json(
        { error: "State must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (postalCode.length < 4) {
      return NextResponse.json(
        { error: "Postal code must be at least 4 characters" },
        { status: 400 }
      );
    }

    // Update the customer profile
    const updatedProfile = await prisma.customerProfile.update({
      where: { id: user.customerProfile.id },
      data: {
        address,
        city,
        state,
        postalCode,
        country,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
