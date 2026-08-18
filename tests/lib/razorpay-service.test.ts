import { describe, it, expect } from "vitest";
import { calculateFees, verifyPaymentSignature } from "@/lib/razorpay-service";
import crypto from "crypto";

describe("calculateFees", () => {
  it("deducts 10% platform fee from the job charge", () => {
    const result = calculateFees(1000);
    expect(result.platformFee).toBe(100);
    expect(result.workerEarnings).toBe(900);
  });

  it("rounds platform fee to 2 decimal places", () => {
    // ₹333.33 → fee = 33.333 → rounds to 33.33
    const result = calculateFees(333.33);
    expect(result.platformFee).toBe(33.33);
    expect(result.workerEarnings).toBe(300);
  });

  it("handles zero charge", () => {
    const result = calculateFees(0);
    expect(result.platformFee).toBe(0);
    expect(result.workerEarnings).toBe(0);
  });

  it("fee + earnings always sum back to original charge (within float tolerance)", () => {
    const charge = 499.99;
    const result = calculateFees(charge);
    expect(result.platformFee + result.workerEarnings).toBeCloseTo(charge, 2);
  });
});

describe("verifyPaymentSignature", () => {
  const KEY_SECRET = "test_secret_key_12345";

  /** Build a valid HMAC the same way the service does. */
  function makeValidSig(orderId: string, paymentId: string, secret = KEY_SECRET) {
    return crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
  }

  it("returns true for a valid signature", () => {
    process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
    const sig = makeValidSig("order_abc123", "pay_xyz789");
    expect(verifyPaymentSignature("order_abc123", "pay_xyz789", sig)).toBe(true);
  });

  it("returns false when orderId is wrong", () => {
    process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
    const sig = makeValidSig("order_abc123", "pay_xyz789");
    expect(verifyPaymentSignature("order_WRONG", "pay_xyz789", sig)).toBe(false);
  });

  it("returns false when paymentId is wrong", () => {
    process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
    const sig = makeValidSig("order_abc123", "pay_xyz789");
    expect(verifyPaymentSignature("order_abc123", "pay_WRONG", sig)).toBe(false);
  });

  it("returns false when signature was built with a different secret", () => {
    process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
    // Build sig with a DIFFERENT key — length matches so timingSafeEqual won't throw
    const sigWithWrongKey = makeValidSig("order_abc123", "pay_xyz789", "completely_different_secret");
    expect(
      verifyPaymentSignature("order_abc123", "pay_xyz789", sigWithWrongKey)
    ).toBe(false);
  });
});
