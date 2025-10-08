import { NextResponse } from "next/server";
import { reverseGeocodeFreeOSM } from "@/lib/geocoding";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }
  try {
    const result = await reverseGeocodeFreeOSM(lat, lng);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "reverse geocode failed" },
      { status: 500 }
    );
  }
}
