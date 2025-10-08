import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { distanceKm } from "@/lib/location";

type SearchParams = {
  q?: string | null;
  category?: string | null;
  limit?: string | null;
  sort?: string | null;
  lat?: string | null;
  lng?: string | null;
};

function flattenStringArray(values: string[] | null | undefined): string[] {
  if (!values) return [];
  const out: string[] = [];
  for (const raw of values) {
    if (!raw) continue;
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const p of parsed) {
            if (typeof p === "string" && p.trim())
              out.push(p.toLowerCase().trim());
          }
          continue;
        }
      } catch {
        // fall through to push trimmed below
      }
    }
    out.push(trimmed.toLowerCase());
  }
  return Array.from(new Set(out));
}

interface WorkerForSearch {
  name?: string | null;
  workerProfile?: {
    skilledIn?: string[] | null;
    availableAreas?: string[] | null;
    qualification?: string | null;
    city?: string | null;
    bio?: string | null;
  } | null;
}

function matchesKeyword(q: string, worker: WorkerForSearch): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const skills = flattenStringArray(worker.workerProfile?.skilledIn);
  const areas = flattenStringArray(worker.workerProfile?.availableAreas);
  return (
    (worker.name ?? "").toLowerCase().includes(needle) ||
    (worker.workerProfile?.qualification ?? "")
      .toLowerCase()
      .includes(needle) ||
    (worker.workerProfile?.city ?? "").toLowerCase().includes(needle) ||
    (worker.workerProfile?.bio ?? "").toLowerCase().includes(needle) ||
    skills.some((s) => s.includes(needle)) ||
    areas.some((a) => a.includes(needle))
  );
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sp: SearchParams = {
      q: url.searchParams.get("q"),
      category: url.searchParams.get("category"),
      limit: url.searchParams.get("limit"),
      sort: url.searchParams.get("sort"),
      lat: url.searchParams.get("lat"),
      lng: url.searchParams.get("lng"),
    };

    const q = sp.q?.toLowerCase().trim() ?? "";
    const category = sp.category?.toLowerCase().trim() ?? "";
    const limit = Math.min(
      Math.max(parseInt(sp.limit || "50", 10) || 50, 1),
      200
    );
    const sort = (sp.sort || "relevance").toLowerCase();
    const lat = sp.lat ? parseFloat(sp.lat) : undefined;
    const lng = sp.lng ? parseFloat(sp.lng) : undefined;

    // If lat/lng provided and sort=nearest, perform a DB-side distance sort using Haversine
    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      sort === "nearest"
    ) {
      try {
        // Use a parameterized raw query to compute distance and order.
        const rows = (await prisma.$queryRaw`
          SELECT u."id" as id, u."name" as name, u."role" as role, wp.* , (
            6371 * acos(
              cos(radians(${lat})) * cos(radians(wp."latitude")) * cos(radians(wp."longitude") - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(wp."latitude"))
            )
          ) AS distance_km
          FROM "User" u
          JOIN "WorkerProfile" wp ON wp."userId" = u."id"
          WHERE u."role" = 'WORKER'
          ORDER BY distance_km ASC
          LIMIT ${limit}
        `) as Array<{
          id: string;
          name: string | null;
          role: string;
          skilledIn?: string[] | null;
          skilled_in?: string[] | null;
          city?: string | null;
          availableAreas?: string[] | null;
          available_areas?: string[] | null;
          yearsExperience?: number | null;
          years_experience?: number | null;
          qualification?: string | null;
          profilePic?: string | null;
          profile_pic?: string | null;
          bio?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          distance_km: number | string;
        }>;

        const mapped = rows.map((r) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          workerProfile: {
            skilledIn: r.skilledIn ?? r.skilled_in,
            city: r.city,
            availableAreas: r.availableAreas ?? r.available_areas,
            yearsExperience: r.yearsExperience ?? r.years_experience,
            qualification: r.qualification,
            profilePic: r.profilePic ?? r.profile_pic,
            bio: r.bio,
            latitude: r.latitude,
            longitude: r.longitude,
          },
          distanceKm:
            typeof r.distance_km === "number"
              ? r.distance_km
              : parseFloat(r.distance_km),
        }));

        const filtered = mapped.filter((w) => {
          const categoryOk = category
            ? flattenStringArray(w.workerProfile?.skilledIn).includes(category)
            : true;
          const keywordOk = matchesKeyword(q, w);
          return categoryOk && keywordOk;
        });
        return NextResponse.json({ count: filtered.length, workers: filtered });
      } catch (e) {
        // Likely the DB doesn't have latitude/longitude columns yet (migration not applied).
        // Fall back to the JS-based fetch below instead of returning 500.
        try {
          console.warn(
            "/api/workers nearest query failed, falling back to JS filter:",
            JSON.stringify(e)
          );
        } catch {
          console.warn(
            "/api/workers nearest query failed, falling back to JS filter",
            e
          );
        }
      }
    }

    // Fallback: fetch small set and filter in JS
    const workersRaw = (await prisma.user.findMany({
      where: { role: "WORKER" },
      select: {
        id: true,
        name: true,
        role: true,
        // select the whole relation so we can access newly-added columns without compile-time type errors
        workerProfile: true,
      },
      take: 200,
    })) as Array<{
      id: string;
      name: string | null;
      role: string;
      workerProfile: {
        skilledIn?: string[] | null;
        city?: string | null;
        availableAreas?: string[] | null;
        yearsExperience?: number | null;
        qualification?: string | null;
        profilePic?: string | null;
        bio?: string | null;
        latitude?: number | null;
        longitude?: number | null;
      } | null;
    }>;

    // Compute distances where possible (JS fallback). This lets the frontend show distances
    // even before DB-side Haversine ordering is used.
    const withDistances = workersRaw.map((w) => {
      const wp = w.workerProfile || {};
      const latVal = wp.latitude;
      const lngVal = wp.longitude;
      let d: number | null = null;
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        typeof latVal === "number" &&
        typeof lngVal === "number"
      ) {
        try {
          d = distanceKm({ lat, lng }, { lat: latVal, lng: lngVal });
        } catch {
          d = null;
        }
      }
      return { ...w, distanceKm: d };
    });

    // Apply category/keyword filters
    const filtered = withDistances.filter((w) => {
      const categoryOk = category
        ? flattenStringArray(w.workerProfile?.skilledIn).includes(category)
        : true;
      const keywordOk = matchesKeyword(q, w);
      return categoryOk && keywordOk;
    });

    // If requested sort=nearest and distances were computed, sort by distance (nulls last)
    let result = filtered;
    if (
      sort === "nearest" &&
      typeof lat === "number" &&
      typeof lng === "number"
    ) {
      result = filtered.sort((a, b) => {
        const da =
          a.distanceKm == null ? Number.POSITIVE_INFINITY : a.distanceKm;
        const db =
          b.distanceKm == null ? Number.POSITIVE_INFINITY : b.distanceKm;
        return da - db;
      });
    }

    result = result.slice(0, limit);
    return NextResponse.json({ count: result.length, workers: result });
  } catch (err) {
    console.error("/api/workers error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
