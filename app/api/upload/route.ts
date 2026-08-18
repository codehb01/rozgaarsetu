import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sendSuccess, sendError, withErrorHandling } from "@/lib/api-response";

// Configuration
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return sendError(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      "UPLOAD_CONFIG_MISSING",
      500
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return sendError("Unauthorized", "UNAUTHORIZED", 401);
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null; // 'profile' or 'work'

  if (!file) {
    return sendError("No file uploaded", "VALIDATION_ERROR", 400);
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return sendError(
      "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      "INVALID_FILE_TYPE",
      400
    );
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return sendError(
      "File too large. Maximum size is 5MB.",
      "FILE_TOO_LARGE",
      400
    );
  }

  // Convert File -> Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Determine folder based on type
  const folder =
    type === "profile" ? "rozgaarsetu/profiles" : "rozgaarsetu/previous-work";

  // Upload to Cloudinary
  const result = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error: unknown, result: unknown) => {
          if (error) return reject(error);
          resolve(result as CloudinaryUploadResult);
        }
      );

      stream.end(buffer);
    }
  );

  return sendSuccess({ publicId: result.public_id, url: result.secure_url });
});
