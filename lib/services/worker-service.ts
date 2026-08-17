/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import prisma from "@/lib/prisma";
import { distanceKm } from "@/lib/location";

export async function updateWorkerProfile(workerProfileId: string, data: any) {
  return await prisma.workerProfile.update({
    where: { id: workerProfileId },
    data: {
      bio: data.bio ?? undefined,
      skilledIn: data.skilledIn,
      qualification: data.qualification ?? undefined,
      yearsExperience: data.yearsExperience ? parseInt(String(data.yearsExperience)) : undefined,
      hourlyRate: data.hourlyRate ? parseFloat(String(data.hourlyRate)) : undefined,
      minimumFee: data.minimumFee ? parseFloat(String(data.minimumFee)) : undefined,
      address: data.address ?? undefined,
      city: data.city ?? undefined,
      state: data.state ?? undefined,
      postalCode: data.postalCode ?? undefined,
      country: data.country ?? undefined,
    },
    include: {
      previousWorks: {
        orderBy: { createdAt: "desc" },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });
}

export async function getWorkerJobs(workerId: string) {
  return await prisma.job.findMany({
    where: { workerId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true } },
      review: { select: { rating: true, comment: true } },
    },
    take: 50,
  });
}

export async function getWorkerEarningsStats(workerId: string) {
  const completedJobs = await prisma.job.findMany({
    where: { workerId, status: "COMPLETED" },
    select: {
      id: true,
      description: true,
      charge: true,
      createdAt: true,
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = completedJobs.reduce((sum, j) => sum + j.charge, 0);
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  const thisMonth = completedJobs
    .filter((j) => j.createdAt >= thisMonthStart)
    .reduce((sum, j) => sum + j.charge, 0);
  const lastMonth = completedJobs
    .filter(
      (j) => j.createdAt >= lastMonthStart && j.createdAt <= lastMonthEnd
    )
    .reduce((sum, j) => sum + j.charge, 0);

  const monthlyChange =
    lastMonth > 0
      ? ((thisMonth - lastMonth) / lastMonth) * 100
      : thisMonth > 0
      ? 100
      : 0;

  return {
    total,
    thisMonth,
    lastMonth,
    monthlyChange,
    jobs: completedJobs.map((j) => ({
      id: j.id,
      description: j.description,
      charge: j.charge,
      date: j.createdAt,
      customer: j.customer?.name || "Customer",
    })),
  };
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

export async function searchWorkers(sp: {
  q: string;
  category: string;
  limit: number;
  sort: string;
  lat?: number;
  lng?: number;
}) {
  const { q, category, limit, sort, lat, lng } = sp;

  if (typeof lat === "number" && typeof lng === "number" && sort === "nearest") {
    try {
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
      `) as Array<any>;

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
      return { count: filtered.length, workers: filtered };
    } catch (e) {
      console.warn("/api/workers nearest query failed, falling back to JS filter", e);
    }
  }

  const workersRaw = (await prisma.user.findMany({
    where: { role: "WORKER" },
    select: {
      id: true,
      name: true,
      role: true,
      workerProfile: true,
    },
    take: 200,
  })) as Array<any>;

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

  const filtered = withDistances.filter((w) => {
    const categoryOk = category
      ? flattenStringArray(w.workerProfile?.skilledIn).includes(category)
      : true;
    const keywordOk = matchesKeyword(q, w);
    return categoryOk && keywordOk;
  });

  let result = filtered;
  if (sort === "nearest" && typeof lat === "number" && typeof lng === "number") {
    result = filtered.sort((a, b) => {
      const da = a.distanceKm == null ? Number.POSITIVE_INFINITY : a.distanceKm;
      const db = b.distanceKm == null ? Number.POSITIVE_INFINITY : b.distanceKm;
      return da - db;
    });
  }

  result = result.slice(0, limit);
  return { count: result.length, workers: result };
}
