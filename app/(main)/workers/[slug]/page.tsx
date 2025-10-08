import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";
import { auth } from "@clerk/nextjs/server";
import { TranslatedText } from "@/components/translation/auto-translate";

export const dynamic = "force-dynamic";

type Params = { slug: string };

function isUuidLike(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    val
  );
}

function flattenStrings(values: string[] | null | undefined): string[] {
  if (!values) return [];
  const out: string[] = [];
  for (const raw of values) {
    if (!raw) continue;
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const p of parsed)
            if (typeof p === "string" && p.trim())
              out.push(p.toLowerCase().trim());
          continue;
        }
      } catch {}
    }
    out.push(trimmed.toLowerCase());
  }
  return Array.from(new Set(out));
}

export default async function WorkerOrSpecialityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { userId } = await auth();
  const current = userId
    ? await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, role: true },
      })
    : null;

  if (isUuidLike(slug)) {
    const worker = await prisma.user.findUnique({
      where: { id: slug },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        workerProfile: true,
      },
    });
    if (!worker || !worker.workerProfile) {
      return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
          <section className="mx-auto max-w-4xl px-6 py-10">
            <div className="text-gray-300"><TranslatedText context="workers">Worker not found.</TranslatedText></div>
          </section>
        </main>
      );
    }
    const wp = worker.workerProfile;
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
        <section className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-light text-white">{worker.name}</h1>
            {current?.role === "CUSTOMER" && (
              <BookWorkerButton workerId={worker.id} />
            )}
          </div>
          <Card className="border-gray-800 bg-gray-800/50 p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6 text-gray-200">
              <div>
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Qualification</TranslatedText></div>
                <div>{wp.qualification || "—"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Experience</TranslatedText></div>
                <div>{wp.yearsExperience ?? 0} <TranslatedText context="workers">years</TranslatedText></div>
              </div>
              <div>
                <div className="text-sm text-gray-400"><TranslatedText context="workers">City</TranslatedText></div>
                <div>{wp.city}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Aadhar</TranslatedText></div>
                <div>{wp.aadharNumber}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Bio</TranslatedText></div>
                <div>{wp.bio || "—"}</div>
              </div>
            </div>
          </Card>
          <Card className="border-gray-800 bg-gray-800/50 p-6">
            <div className="text-gray-200">
              <div className="mb-3">
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Skills</TranslatedText></div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(wp.skilledIn || []).map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-sm text-gray-400"><TranslatedText context="workers">Available Areas</TranslatedText></div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(wp.availableAreas || []).map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md text-xs bg-gray-500/10 text-gray-300 border border-gray-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-400"><TranslatedText context="workers">Address</TranslatedText></div>
                  <div>{wp.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400"><TranslatedText context="workers">Location</TranslatedText></div>
                  <div>
                    {wp.city}, {wp.state}, {wp.country} - {wp.postalCode}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const normalized = slug.replace(/-/g, " ").toLowerCase().trim();
  const workersRaw = await prisma.user.findMany({
    where: { role: "WORKER" },
    select: {
      id: true,
      name: true,
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
  const workers = workersRaw.filter((w) =>
    flattenStrings(w.workerProfile?.skilledIn).includes(normalized)
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-white">
            <TranslatedText context="workers">Speciality</TranslatedText>: {slug.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-400 mt-2">
            <TranslatedText context="workers">Browse professionals in this speciality.</TranslatedText>
          </p>
        </div>
        {workers.length === 0 ? (
          <div className="text-gray-400">
            <TranslatedText context="workers">No workers found for this speciality.</TranslatedText>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((w) => (
              <Card key={w.id} className="border-gray-800 bg-gray-800/50 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-700 overflow-hidden" />
                  <div>
                    <div className="text-white font-medium">
                      {w.name ?? "Unnamed Worker"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {w.workerProfile?.qualification || "—"} •{" "}
                      {w.workerProfile?.yearsExperience ?? 0} <TranslatedText context="workers">yrs exp</TranslatedText>
                    </div>
                    <div className="mt-1 text-sm text-gray-400">
                      {w.workerProfile?.city || "City"} •{" "}
                      {(w.workerProfile?.availableAreas || [])
                        .slice(0, 2)
                        .join(", ")}
                    </div>
                    <div className="mt-2 text-xs text-gray-300">
                      {(w.workerProfile?.skilledIn || [])
                        .slice(0, 4)
                        .join(" • ")}
                    </div>
                    {current?.role === "CUSTOMER" && (
                      <div className="mt-4 flex gap-2">
                        <Link
                          href={`/workers/${w.id}`}
                          className="inline-flex px-3 py-2 rounded-md text-sm bg-gray-700 text-white hover:bg-gray-600"
                        >
                          <TranslatedText context="workers">View</TranslatedText>
                        </Link>
                        <BookWorkerButton workerId={w.id} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
