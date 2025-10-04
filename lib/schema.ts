import { z } from "zod";

// ----------------- Customer Schema -----------------
export const customerFormSchema = z.object({
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// ----------------- Worker Schema -----------------
export const workerFormSchema = z.object({
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be a 12 digit number"),
  qualification: z.string().min(2, "Qualification is required"),
  certificates: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      Array.isArray(val)
        ? val.map((v) => v.trim()).filter(Boolean)
        : val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
    )
    .optional(),
  skilledIn: z.union([z.string(), z.array(z.string())]).transform((val) =>
    Array.isArray(val)
      ? val.map((v) => v.trim()).filter(Boolean)
      : val
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
  ),
  availableAreas: z
    .union([z.string(), z.array(z.string())])
    .transform((val) =>
      Array.isArray(val)
        ? val.map((v) => v.trim()).filter(Boolean)
        : val
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
    )
    .optional(),
  yearsExperience: z
    .number({ error: "Years of experience must be a number" })
    .min(0, "Must be 0 or more years"),
  hourlyRate: z
    .number({ error: "Hourly rate must be a number" })
    .min(1, "Hourly rate must be at least ₹1"),
  minimumFee: z
    .number({ error: "Minimum fee must be a number" })
    .min(1, "Minimum fee must be at least ₹1"),
  profilePic: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type WorkerFormData = z.infer<typeof workerFormSchema>;

// Input schema for forms (accepts strings that will be transformed)
export const workerFormInputSchema = z.object({
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be a 12 digit number"),
  qualification: z.string().min(2, "Qualification is required"),
  certificates: z.string().optional(),
  skilledIn: z.string().min(1, "At least one skill is required"),
  availableAreas: z.string().optional(),
  yearsExperience: z
    .number({ error: "Years of experience must be a number" })
    .min(0, "Must be 0 or more years"),
  hourlyRate: z
    .number({ error: "Hourly rate must be a number" })
    .min(1, "Hourly rate must be at least ₹1"),
  minimumFee: z
    .number({ error: "Minimum fee must be a number" })
    .min(1, "Minimum fee must be at least ₹1"),
  profilePic: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

export type WorkerFormInput = z.infer<typeof workerFormInputSchema>;
