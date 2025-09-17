import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import BookWorkerButton from "@/components/book-worker-button";
import { auth } from "@clerk/nextjs/server";

type Params = { id: string };

export default async function WorkerProfilePage({
  params,
}: {
  params: Params;
}) {
  const { userId } = await auth();
  const current = userId
    ? await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, role: true },
      })
    : null;

  const worker = await prisma.user.findUnique({
    where: { id: params.id },
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
          <div className="text-gray-300">Worker not found.</div>
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
              <div className="text-sm text-gray-400">Qualification</div>
              <div>{wp.qualification || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Experience</div>
              <div>{wp.yearsExperience ?? 0} years</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">City</div>
              <div>{wp.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Aadhar</div>
              <div>{wp.aadharNumber}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-400">Bio</div>
              <div>{wp.bio || "—"}</div>
            </div>
          </div>
        </Card>

        <Card className="border-gray-800 bg-gray-800/50 p-6">
          <div className="text-gray-200">
            <div className="mb-3">
              <div className="text-sm text-gray-400">Skills</div>
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
              <div className="text-sm text-gray-400">Available Areas</div>
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
                <div className="text-sm text-gray-400">Address</div>
                <div>{wp.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Location</div>
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
