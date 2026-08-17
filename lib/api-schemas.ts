import { z } from "zod";

// ─── Reviews ───────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  jobId: z.string().min(1, "Job ID required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

// ─── Geocode ────────────────────────────────────────────────────────────────

export const geocodeQuerySchema = z.object({
  q: z.string().min(1, "Query string required"),
});

export const reverseGeocodeQuerySchema = z.object({
  lat: z.number({ message: "lat must be a number" }).min(-90).max(90),
  lng: z.number({ message: "lng must be a number" }).min(-180).max(180),
});

export type GeocodeQuery = z.infer<typeof geocodeQuerySchema>;
export type ReverseGeocodeQuery = z.infer<typeof reverseGeocodeQuerySchema>;

// ─── Customer Profile ───────────────────────────────────────────────────────

export const updateCustomerProfileSchema = z.object({
  address: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(1, "Country required"),
});

export type UpdateCustomerProfileRequest = z.infer<typeof updateCustomerProfileSchema>;

// ─── Worker Profile ─────────────────────────────────────────────────────────

export const updateWorkerProfileSchema = z.object({
  bio: z.string().optional().nullable(),
  skilledIn: z.array(z.string()).min(1, "At least one skill is required"),
  qualification: z.string().optional().nullable(),
  yearsExperience: z.union([z.string(), z.number()]).optional().nullable(),
  hourlyRate: z
    .number()
    .min(0, "Hourly rate cannot be negative")
    .optional()
    .nullable(),
  minimumFee: z
    .number()
    .min(0, "Minimum fee cannot be negative")
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export type UpdateWorkerProfileRequest = z.infer<typeof updateWorkerProfileSchema>;

// ─── Jobs ────────────────────────────────────────────────────────────────────

export const createJobSchema = z.object({
  workerId: z.string().min(1, "Worker ID required"),
  description: z.string().min(1, "Description required"),
  details: z.string().optional().nullable(),
  datetime: z.string().min(1, "Datetime required"),
  location: z.string().min(1, "Location required"),
  charge: z.number({ message: "Charge must be a number" }).positive("Charge must be greater than 0"),
});

export type CreateJobRequest = z.infer<typeof createJobSchema>;

// ─── Job Actions ─────────────────────────────────────────────────────────────

export const jobActionSchema = z
  .object({
    action: z.enum(["ACCEPT", "START", "COMPLETE", "CANCEL"]),
    // START proof fields
    startProofPhoto: z.string().optional(),
    startProofGpsLat: z.number().optional(),
    startProofGpsLng: z.number().optional(),
    // CANCEL reason
    reason: z.string().optional(),
  });

export type JobActionRequest = z.infer<typeof jobActionSchema>;

// ─── Payment Verification ─────────────────────────────────────────────────────

export const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string().min(1, "Payment ID required"),
  razorpaySignature: z.string().min(1, "Signature required"),
});

export type VerifyPaymentRequest = z.infer<typeof verifyPaymentSchema>;
