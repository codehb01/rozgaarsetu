import { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// In-memory store for basic rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default configuration: 50 requests per minute
const LIMIT = 50;
const WINDOW_MS = 60 * 1000;

export function checkRateLimit(req: NextRequest, limit = LIMIT, windowMs = WINDOW_MS): { success: boolean; limit: number; remaining: number } {
  // Try to get IP from headers, fallback to a default string
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("x-real-ip") || 
             "unknown-ip";
             
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (now > entry.resetTime) {
    // Window expired, reset
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return { success: false, limit, remaining: 0 };
  }

  // Increment count
  entry.count += 1;
  return { success: true, limit, remaining: limit - entry.count };
}
