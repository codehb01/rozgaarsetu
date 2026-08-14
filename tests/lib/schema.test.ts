import { describe, it, expect } from "vitest";
import {
  customerFormSchema,
  workerFormSchema,
  workerFormInputSchema,
} from "@/lib/schema";

// ---------------------------------------------------------------------------
// customerFormSchema
// ---------------------------------------------------------------------------
describe("customerFormSchema", () => {
  const validCustomer = {
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400001",
  };

  it("passes for a valid customer input", () => {
    const result = customerFormSchema.safeParse(validCustomer);
    expect(result.success).toBe(true);
  });

  it("accepts optional latitude and longitude", () => {
    const result = customerFormSchema.safeParse({
      ...validCustomer,
      latitude: 19.076,
      longitude: 72.8777,
    });
    expect(result.success).toBe(true);
  });

  it("fails when address is too short (< 3 chars)", () => {
    const result = customerFormSchema.safeParse({ ...validCustomer, address: "AB" });
    expect(result.success).toBe(false);
  });

  it("fails when city is missing", () => {
    const { city: _, ...withoutCity } = validCustomer;
    const result = customerFormSchema.safeParse(withoutCity);
    expect(result.success).toBe(false);
  });

  it("fails when postalCode is too short (< 4 chars)", () => {
    const result = customerFormSchema.safeParse({ ...validCustomer, postalCode: "40" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// workerFormSchema — focus on the tricky fields
// ---------------------------------------------------------------------------
describe("workerFormSchema", () => {
  const validWorker = {
    aadharNumber: "123456789012", // exactly 12 digits
    qualification: "B.Tech",
    skilledIn: ["Plumbing", "Electrical"],
    yearsExperience: 3,
    hourlyRate: 250,
    minimumFee: 500,
    address: "456 Worker Lane",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    postalCode: "110001",
  };

  it("passes for a valid worker input", () => {
    const result = workerFormSchema.safeParse(validWorker);
    expect(result.success).toBe(true);
  });

  it("fails when aadharNumber has fewer than 12 digits", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      aadharNumber: "12345678901", // 11 digits
    });
    expect(result.success).toBe(false);
  });

  it("fails when aadharNumber has more than 12 digits", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      aadharNumber: "1234567890123", // 13 digits
    });
    expect(result.success).toBe(false);
  });

  it("fails when aadharNumber contains letters", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      aadharNumber: "12345678901A",
    });
    expect(result.success).toBe(false);
  });

  it("fails when hourlyRate is 0", () => {
    const result = workerFormSchema.safeParse({ ...validWorker, hourlyRate: 0 });
    expect(result.success).toBe(false);
  });

  it("fails when minimumFee is negative", () => {
    const result = workerFormSchema.safeParse({ ...validWorker, minimumFee: -1 });
    expect(result.success).toBe(false);
  });

  it("fails when yearsExperience is negative", () => {
    const result = workerFormSchema.safeParse({ ...validWorker, yearsExperience: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts 0 years of experience", () => {
    const result = workerFormSchema.safeParse({ ...validWorker, yearsExperience: 0 });
    expect(result.success).toBe(true);
  });

  it("transforms comma-separated skilledIn string into an array", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      skilledIn: "Plumbing, Electrical, Carpentry",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skilledIn).toEqual(["Plumbing", "Electrical", "Carpentry"]);
    }
  });

  it("trims whitespace from entries when transforming skilledIn", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      skilledIn: "  Plumbing  ,  Electrical  ",
    });
    if (result.success) {
      expect(result.data.skilledIn).toEqual(["Plumbing", "Electrical"]);
    }
  });

  it("rejects invalid profilePic URL", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      profilePic: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid profilePic URL", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      profilePic: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("bio cannot exceed 500 characters", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      bio: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("bio of exactly 500 characters is valid", () => {
    const result = workerFormSchema.safeParse({
      ...validWorker,
      bio: "A".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// workerFormInputSchema — the string-only input variant
// ---------------------------------------------------------------------------
describe("workerFormInputSchema", () => {
  const validInput = {
    aadharNumber: "123456789012",
    qualification: "Diploma",
    skilledIn: "Plumbing",
    yearsExperience: 2,
    hourlyRate: 200,
    minimumFee: 400,
    address: "789 Test Road",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600001",
  };

  it("passes for a valid input", () => {
    const result = workerFormInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("fails when skilledIn is empty string", () => {
    const result = workerFormInputSchema.safeParse({ ...validInput, skilledIn: "" });
    expect(result.success).toBe(false);
  });

  it("certificates is optional and defaults to absent", () => {
    const { ...rest } = validInput;
    const result = workerFormInputSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });
});
