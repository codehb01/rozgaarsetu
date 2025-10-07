import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contentScanner } from "@/lib/content-scanner";

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
    };

    const q = sp.q?.toLowerCase().trim() ?? "";
    const category = sp.category?.toLowerCase().trim() ?? "";
    const limit = Math.min(
      Math.max(parseInt(sp.limit || "50", 10) || 50, 1),
      200
    );

    const workersRaw = await prisma.user.findMany({
      where: { role: "WORKER" },
      select: {
        id: true,
        name: true,
        role: true,
        workerProfile: {
          select: {
            skilledIn: true,
            city: true,
            availableAreas: true,
            yearsExperience: true,
            qualification: true,
            profilePic: true,
            bio: true,
          },
        },
      },
      take: 200,
    });

    const filtered = workersRaw.filter((w) => {
      const categoryOk = category
        ? flattenStringArray(w.workerProfile?.skilledIn).includes(category)
        : true;
      const keywordOk = matchesKeyword(q, w);
      return categoryOk && keywordOk;
    });

    const result = filtered.slice(0, limit);
    
    // Check if client requested translation
    const targetLanguage = req.headers.get('x-translate-to');
    
    if (targetLanguage && targetLanguage !== 'en' && result.length > 0) {
      try {
        // Auto-translate worker data
        const translatedWorkers = await Promise.all(
          result.map(worker => 
            contentScanner.autoTranslateComponentData(worker, targetLanguage, 'workers')
          )
        );
        
        return NextResponse.json({ 
          count: translatedWorkers.length, 
          workers: translatedWorkers,
          translated: true,
          targetLanguage
        });
      } catch (translationError) {
        console.error('Translation error:', translationError);
        // Fall back to original data if translation fails
      }
    }
    
    return NextResponse.json({ count: result.length, workers: result });
  } catch (err) {
    console.error("/api/workers error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
