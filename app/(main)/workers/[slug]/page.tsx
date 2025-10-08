import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";
import OpenBookFromQuery from "@/components/open-book-from-query";
import { auth } from "@clerk/nextjs/server";
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiMail,
  FiPhone,
  FiAward,
} from "react-icons/fi";

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
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl p-8 text-center max-w-md w-full">
              <FiUser className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Worker Not Found
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                The worker profile you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
            </Card>
          </div>
        </main>
      );
    }
    const wp = worker.workerProfile;
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                {worker.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Professional {wp.qualification || "Worker"} •{" "}
                {wp.yearsExperience ?? 0} years experience
              </p>
            </div>
            {current?.role === "CUSTOMER" && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <BookWorkerButton workerId={worker.id} />
                <OpenBookFromQuery workerId={worker.id} />
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Left Sidebar - Worker Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl lg:sticky lg:top-6">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center border-2 sm:border-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-900">
                      <div className="text-blue-500 dark:text-blue-400 text-lg sm:text-2xl lg:text-4xl font-bold">
                        {worker.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {worker.name}
                  </h2>

                  {/* Role Badge */}
                  <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0 text-xs sm:text-sm">
                    {wp.qualification || "Professional"}
                  </Badge>

                  {/* Contact Info */}
                  <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6 text-left">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <FiMail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 truncate min-w-0">
                        {worker.email}
                      </span>
                    </div>

                    {worker.phone && !worker.phone.startsWith("no-phone-") && (
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <FiPhone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {worker.phone}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {wp.city}, {wp.state}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Experience
                      </span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                        {wp.yearsExperience ?? 0} years
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Skills
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {wp.skilledIn?.length || 0} skills
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Content - Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Professional Information */}
              <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Professional Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qualification
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                        {wp.qualification || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                        {wp.yearsExperience ?? 0} years
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {wp.bio || "No bio provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Aadhar Number
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                      {wp.aadharNumber}
                    </p>
                  </div>
                </div>
              </Card>
              {/* Skills & Services */}
              <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FiAward className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Skills & Expertise
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Professional Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(wp.skilledIn || []).map((skill, i) => (
                        <Badge
                          key={i}
                          className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {(wp.skilledIn || []).length === 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Areas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(wp.availableAreas || []).map((area, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-gray-300 dark:border-gray-600"
                        >
                          {area}
                        </Badge>
                      ))}
                      {(wp.availableAreas || []).length === 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No service areas listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location & Contact */}
              <Card className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FiMapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Location & Address
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street Address
                      </label>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {wp.address || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Complete Location
                      </label>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {wp.city}, {wp.state}, {wp.country} - {wp.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
            Professionals
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Browse skilled professionals specializing in{" "}
            {slug.replace(/-/g, " ")}
          </p>
        </div>

        {workers.length === 0 ? (
          <Card className="p-8 sm:p-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl text-center">
            <FiUser className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Workers Found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              No professionals found in this speciality. Try browsing other
              categories.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((w) => (
              <Card
                key={w.id}
                className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/20 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl font-bold">
                      {(w.name ?? "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                        {w.name ?? "Unnamed Worker"}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                          {w.workerProfile?.qualification || "Professional"}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                          {w.workerProfile?.yearsExperience ?? 0} yrs
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <FiMapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {w.workerProfile?.city || "City"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {(w.workerProfile?.skilledIn || [])
                          .slice(0, 3)
                          .join(" • ")}
                      </div>
                    </div>
                    {current?.role === "CUSTOMER" && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs sm:text-sm"
                        >
                          <Link href={`/workers/${w.id}`}>View Profile</Link>
                        </Button>
                        <BookWorkerButton workerId={w.id} />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
