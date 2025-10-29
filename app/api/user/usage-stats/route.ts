import { NextResponse } from "next/server";

// Usage stats endpoint removed — subscription/usage features disabled.
export async function GET() {
  return NextResponse.json(
    {
      error: "Usage stats feature has been removed",
    },
    { status: 404 }
  );
}
