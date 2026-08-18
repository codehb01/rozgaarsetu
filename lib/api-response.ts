import { NextRequest, NextResponse } from "next/server";

export type ApiResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string | { message: string };
  code?: string;
};

/**
 * Send a success response with consistent shape
 */
export function sendSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data } as ApiResponse<T>, {
    status,
  });
}

/**
 * Send an error response with consistent shape
 */
export function sendError(
  message: string,
  code?: string,
  status = 400,
  details?: unknown
) {
  const body: Record<string, unknown> = {
    success: false,
    error: message,
    code: code || "UNKNOWN_ERROR",
  };
  if (details) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

/**
 * Wrapper for API routes that adds consistent error handling.
 * Supports both simple routes (req only) and dynamic routes (req + context).
 */
export function withErrorHandling(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (req: NextRequest, context: any) => Promise<NextResponse>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("[API Error]", error);
      return sendError("Internal server error", "INTERNAL_ERROR", 500);
    }
  };
}
