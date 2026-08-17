import { z } from "zod";

// ----------------- Customer Schema -----------------
export const customerFormSchema = z.object({
  address: z.string().min(3, "Address is required").max(200, "Address too long"),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "State is required").max(100, "State too long"),
  country: z.string().min(2, "Country is required").max(100, "Country too long"),
  postalCode: z.string().min(4, "Postal code is required").max(20, "Postal code too long"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// ----------------- Worker Schema -----------------
export const workerFormSchema = z.object({
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be a 12 digit number"),
  qualification: z.string().min(2, "Qualification is required").max(100, "Qualification too long"),
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
    .min(0, "Must be 0 or more years")
    .max(70, "Experience cannot exceed 70 years"),
  hourlyRate: z
    .number({ error: "Hourly rate must be a number" })
    .min(1, "Hourly rate must be at least ₹1")
    .max(100000, "Hourly rate cannot exceed ₹100,000"),
  minimumFee: z
    .number({ error: "Minimum fee must be a number" })
    .min(1, "Minimum fee must be at least ₹1")
    .max(500000, "Minimum fee cannot exceed ₹5,00,000"),
  profilePic: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  address: z.string().min(3, "Address is required").max(200, "Address too long"),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "State is required").max(100, "State too long"),
  country: z.string().min(2, "Country is required").max(100, "Country too long"),
  postalCode: z.string().min(4, "Postal code is required").max(20, "Postal code too long"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type WorkerFormData = z.infer<typeof workerFormSchema>;

// Input schema for forms (accepts strings that will be transformed)
export const workerFormInputSchema = z.object({
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be a 12 digit number"),
  qualification: z.string().min(2, "Qualification is required").max(100, "Qualification too long"),
  certificates: z.string().max(1000, "Certificates field too long").optional(),
  skilledIn: z.string().min(1, "At least one skill is required").max(500, "Skills field too long"),
  availableAreas: z.string().max(500, "Available areas field too long").optional(),
  yearsExperience: z
    .number({ error: "Years of experience must be a number" })
    .min(0, "Must be 0 or more years")
    .max(70, "Experience cannot exceed 70 years"),
  hourlyRate: z
    .number({ error: "Hourly rate must be a number" })
    .min(1, "Hourly rate must be at least ₹1")
    .max(100000, "Hourly rate cannot exceed ₹100,000"),
  minimumFee: z
    .number({ error: "Minimum fee must be a number" })
    .min(1, "Minimum fee must be at least ₹1")
    .max(500000, "Minimum fee cannot exceed ₹5,00,000"),
  profilePic: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Must be a valid URL",
    }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  address: z.string().min(3, "Address is required").max(200, "Address too long"),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "State is required").max(100, "State too long"),
  country: z.string().min(2, "Country is required").max(100, "Country too long"),
  postalCode: z.string().min(4, "Postal code is required").max(20, "Postal code too long"),
});

export type WorkerFormInput = z.infer<typeof workerFormInputSchema>;
