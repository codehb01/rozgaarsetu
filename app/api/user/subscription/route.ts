import { NextResponse } from "next/server";

// Subscription endpoint removed — subscription/usage features disabled.
export async function POST() {
  return NextResponse.json(
    {
      error: "Subscription feature has been removed",
    },
    { status: 404 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error: "Subscription feature has been removed",
    },
    { status: 404 }
  );
}
