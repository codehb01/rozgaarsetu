import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid database URL"),

  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),

  // Razorpay (Payment)
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1, "Razorpay key ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "Razorpay secret is required").optional(),

  // Image & File Upload
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Geolocation
  NEXT_PUBLIC_NOMINATIM_URL: z.string().url().default("https://nominatim.openstreetmap.org"),

  // Translation APIs
  GOOGLE_TRANSLATE_API_KEY: z.string().optional(),
  AZURE_TRANSLATOR_KEY: z.string().optional(),
  AZURE_TRANSLATOR_ENDPOINT: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env;

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv;

  const env = {
    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

    // Razorpay
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

    // Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // Geolocation
    NEXT_PUBLIC_NOMINATIM_URL: process.env.NEXT_PUBLIC_NOMINATIM_URL,

    // Translation
    GOOGLE_TRANSLATE_API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY,
    AZURE_TRANSLATOR_KEY: process.env.AZURE_TRANSLATOR_KEY,
    AZURE_TRANSLATOR_ENDPOINT: process.env.AZURE_TRANSLATOR_ENDPOINT,

    // Environment
    NODE_ENV: process.env.NODE_ENV,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const missingVars = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${missingVars}\n\nPlease check your .env file.`
    );
  }

  validatedEnv = result.data;
  return validatedEnv;
}
