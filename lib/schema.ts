import { z } from "zod";

// ----------------- Customer Schema -----------------
export const customerFormSchema = z.object({
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

// ----------------- Worker Schema -----------------
export const workerFormSchema = z.object({
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
  profilePic: z.string().url("Must be a valid URL").optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type WorkerFormData = z.infer<typeof workerFormSchema>;
