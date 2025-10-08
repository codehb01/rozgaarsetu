import { NextResponse } from "next/server";
import { geocodeFreeOSM } from "@/lib/geocoding";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await geocodeFreeOSM(q);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "geocode failed" },
      { status: 500 }
    );
  }
}
