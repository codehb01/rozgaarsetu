import Razorpay from "razorpay";
import crypto from "crypto";

// Platform fee configuration (10% of job charge)
const PLATFORM_FEE_PERCENTAGE = 10;

// Lazy initialization of Razorpay instance
let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
      );
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayInstance;
}

/**
 * Calculate platform fee and worker earnings
 * @param jobCharge - Total job charge in INR
 * @returns Object containing platformFee and workerEarnings
 */
export function calculateFees(jobCharge: number) {
  const platformFee = (jobCharge * PLATFORM_FEE_PERCENTAGE) / 100;
  const workerEarnings = jobCharge - platformFee;

  return {
    platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimal places
    workerEarnings: Math.round(workerEarnings * 100) / 100,
  };
}

/**
 * Create a Razorpay order for job payment
 * @param jobId - Job ID for reference
 * @param amount - Amount to charge in INR
 * @param customerEmail - Customer email for receipt
 * @param customerPhone - Customer phone for receipt
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
  jobId: string,
  amount: number,
  customerEmail: string,
  customerPhone: string
) {
  try {
    const razorpay = getRazorpayInstance();
    
    // Convert amount to paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `job_${jobId}`,
      notes: {
        jobId,
        customerEmail,
        customerPhone,
        description: "Job completion payment",
      },
    });

    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
}

/**
 * Verify Razorpay payment signature
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Razorpay signature from webhook
 * @returns Boolean indicating if signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Compare signatures using timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 * @param paymentId - Razorpay payment ID
 * @returns Payment details object
 */
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new Error("Failed to fetch payment details");
  }
}

/**
 * Create a refund for a payment
 * @param paymentId - Razorpay payment ID
 * @param amount - Amount to refund in INR (optional, full refund if not specified)
 * @returns Refund object
 */
export async function createRefund(paymentId: string, amount?: number) {
  try {
    const razorpay = getRazorpayInstance();
    const refundData: { payment_id: string; amount?: number } = {
      payment_id: paymentId,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, refundData);
    return refund;
  } catch (error) {
    console.error("Error creating refund:", error);
    throw new Error("Failed to create refund");
  }

}

export default getRazorpayInstance;
