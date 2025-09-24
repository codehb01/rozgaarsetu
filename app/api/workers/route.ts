import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  calculateDistance,
  formatDistance,
  calculateWorkerRelevanceScore,
  sortWorkersByDistance,
  Coordinates,
} from "@/lib/location";

type SearchParams = {
  q?: string | null;
  category?: string | null;
  limit?: string | null;
  lat?: string | null;
  lng?: string | null;
  radius?: string | null;
  sortBy?: string | null;
};

interface WorkerWithDistance {
  id: string;
  name: string | null;
  role: string;
  workerProfile: {
    skilledIn: string[] | null;
    city: string | null;
    state: string | null;
    availableAreas: string[] | null;
    yearsExperience: number | null;
    qualification: string | null;
    profilePic: string | null;
    bio: string | null;
  } | null;
  distance?: number;
  distanceText?: string;
  relevanceScore?: number;
}

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

function matchesKeyword(
  q: string,
  worker: {
    name: string | null;
    workerProfile: {
      skilledIn: string[] | null;
      qualification: string | null;
      city: string | null;
      availableAreas: string[] | null;
      bio: string | null;
    } | null;
  }
): boolean {
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
      lat: url.searchParams.get("lat"),
      lng: url.searchParams.get("lng"),
      radius: url.searchParams.get("radius"),
      sortBy: url.searchParams.get("sortBy"),
    };

    const q = sp.q?.toLowerCase().trim() ?? "";
    const category = sp.category?.toLowerCase().trim() ?? "";
    const limit = Math.min(
      Math.max(parseInt(sp.limit || "50", 10) || 50, 1),
      200
    );
    const sortBy = sp.sortBy || "relevance"; // relevance, distance, experience, rating
    const radiusKm = parseInt(sp.radius || "25", 10); // Default 25km radius

    // Get customer location from params for now
    let customerLocation: Coordinates | null = null;
    if (sp.lat && sp.lng) {
      customerLocation = {
        latitude: parseFloat(sp.lat),
        longitude: parseFloat(sp.lng),
      };
    }

    // Fetch workers with basic data
    const workersRaw = await prisma.user.findMany({
      where: { role: "WORKER" },
      include: {
        workerProfile: {
          select: {
            skilledIn: true,
            city: true,
            state: true,
            availableAreas: true,
            yearsExperience: true,
            qualification: true,
            profilePic: true,
            bio: true,
          },
        },
      },
      take: 500, // Fetch more to filter by location
    });

    // Filter and enhance workers
    let workers: WorkerWithDistance[] = workersRaw
      .filter((w) => {
        const categoryOk = category
          ? flattenStringArray(w.workerProfile?.skilledIn).includes(category)
          : true;
        const keywordOk = matchesKeyword(q, w);
        return categoryOk && keywordOk;
      })
      .map((worker) => {
        const enhanced: WorkerWithDistance = { ...worker };

        // For now, mock distance calculation for demonstration
        // TODO: Add actual coordinates from database after schema fix
        if (customerLocation) {
          // Mock distance based on city (for demo purposes)
          const mockDistance = Math.random() * 50; // Random distance 0-50km
          enhanced.distance = mockDistance;
          enhanced.distanceText = formatDistance(mockDistance).distanceText;
        }

        // Calculate basic relevance score
        enhanced.relevanceScore = calculateBasicRelevanceScore(worker, q);

        return enhanced;
      });

    // Filter by radius if customer location is available
    if (customerLocation && radiusKm > 0) {
      workers = workers.filter((worker) => {
        if (!worker.distance) return true; // Keep workers without coordinates
        return worker.distance <= radiusKm;
      });
    }

    // Sort workers based on sort preference
    switch (sortBy) {
      case "distance":
        workers.sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        break;
      case "experience":
        workers.sort((a, b) => {
          const aExp = a.workerProfile?.yearsExperience || 0;
          const bExp = b.workerProfile?.yearsExperience || 0;
          return bExp - aExp;
        });
        break;
      case "relevance":
      default:
        workers.sort((a, b) => {
          const aScore = a.relevanceScore || 0;
          const bScore = b.relevanceScore || 0;
          return bScore - aScore;
        });
        break;
    }

    // Apply limit
    const result = workers.slice(0, limit);

    return NextResponse.json({
      count: result.length,
      totalAvailable: workers.length,
      workers: result,
      hasLocationData: !!customerLocation,
      searchRadius: radiusKm,
      sortBy,
      note: "Location features will be fully enabled after database schema update",
    });
  } catch (err) {
    console.error("/api/workers error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function calculateBasicRelevanceScore(
  worker: {
    workerProfile: {
      skilledIn: string[] | null;
      yearsExperience: number | null;
      qualification: string | null;
    } | null;
  },
  searchQuery: string
): number {
  let score = 0;

  // Experience score (20%)
  const experience = worker.workerProfile?.yearsExperience || 0;
  score += Math.min(experience * 2, 20); // Max 20 points

  // Skills match score (40%)
  const skills = flattenStringArray(worker.workerProfile?.skilledIn);
  if (searchQuery) {
    const queryWords = searchQuery.toLowerCase().split(" ");
    const matchingSkills = skills.filter((skill) =>
      queryWords.some((word) => skill.includes(word))
    );
    score += (matchingSkills.length / Math.max(skills.length, 1)) * 40;
  } else {
    score += skills.length * 5; // Base score for having skills
  }

  // Qualification bonus (10%)
  if (worker.workerProfile?.qualification) {
    score += 10;
  }

  return Math.min(score, 100);
}
