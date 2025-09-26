import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type SearchParams = {
  q?: string | null;
  category?: string | null;
  limit?: string | null;
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

function matchesKeyword(
  q: string,
  worker: {
    name: string | null;
    WorkerProfile: {
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
  const skills = flattenStringArray(worker.WorkerProfile?.skilledIn);
  const areas = flattenStringArray(worker.WorkerProfile?.availableAreas);
  return (
    (worker.name ?? "").toLowerCase().includes(needle) ||
    (worker.WorkerProfile?.qualification ?? "")
      .toLowerCase()
      .includes(needle) ||
    (worker.WorkerProfile?.city ?? "").toLowerCase().includes(needle) ||
    (worker.WorkerProfile?.bio ?? "").toLowerCase().includes(needle) ||
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
    };

    const q = sp.q?.toLowerCase().trim() ?? "";
    const category = sp.category?.toLowerCase().trim() ?? "";
    const limit = Math.min(
      Math.max(parseInt(sp.limit || "50", 10) || 50, 1),
      200
    );

    // Get workers but handle case where WorkerProfile might not exist
    const workersRaw = await prisma.user.findMany({
      where: { role: "WORKER" },
      select: {
        id: true,
        name: true,
        role: true,
      },
      take: 200,
    });

    // Transform to expected format with null profiles since profiles table is empty
    const workersWithProfiles = workersRaw.map(user => ({
      ...user,
      WorkerProfile: null
    }));

    const filtered = workersWithProfiles.filter((w) => {
      const categoryOk = category
        ? flattenStringArray(w.WorkerProfile?.skilledIn).includes(category)
        : true;
      const keywordOk = matchesKeyword(q, w);
      return categoryOk && keywordOk;
    });

    const result = filtered.slice(0, limit);
    return NextResponse.json({ count: result.length, workers: result });
  } catch (err) {
    console.error("/api/workers error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
