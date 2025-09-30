import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // 'profile', 'work-sample', or 'document'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type based on upload type
    let allowedTypes: string[] = [];
    let maxSize = 5 * 1024 * 1024; // Default 5MB

    if (type === "profile") {
      allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      maxSize = 5 * 1024 * 1024; // 5MB for profile pics
    } else if (type === "work-sample") {
      allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      maxSize = 10 * 1024 * 1024; // 10MB for work samples
    } else if (type === "document") {
      allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      maxSize = 10 * 1024 * 1024; // 10MB for documents
    } else {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.` },
        { status: 400 }
      );
    }

    // Convert File -> Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder and transformation based on type
    let folder: string;
    let transformation: any[] = [];

    switch (type) {
      case "profile":
        folder = "rozgaarsetu/profiles";
        transformation = [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ];
        break;
      case "work-sample":
        folder = "rozgaarsetu/work-samples";
        transformation = [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ];
        break;
      case "document":
        folder = "rozgaarsetu/documents";
        transformation = [
          { quality: "auto", fetch_format: "auto" },
        ];
        break;
      default:
        folder = "rozgaarsetu/misc";
        transformation = [
          { quality: "auto", fetch_format: "auto" },
        ];
    }

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadOptions: any = {
          folder: folder,
          public_id: `${userId}_${Date.now()}`, // Unique identifier with user ID
          resource_type: file.type.startsWith("image/") ? "image" : "raw",
        };

        // Only add transformation for images
        if (file.type.startsWith("image/")) {
          uploadOptions.transformation = transformation;
        }

        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error: unknown, result: unknown) => {
            if (error) return reject(error);
            resolve(result as CloudinaryUploadResult);
          }
        );

        stream.end(buffer);
      }
    );

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 });
    }

    // Security check: ensure the file belongs to the current user
    if (!publicId.includes(userId)) {
      return NextResponse.json({ error: "Unauthorized to delete this file" }, { status: 403 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return NextResponse.json({ success: true, message: "File deleted successfully" });
    } else {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}