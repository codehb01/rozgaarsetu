import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookWorkerButton from "@/components/book-worker-button";
import prisma from "@/lib/prisma";
import {
  Wrench,
  Plug,
  Settings,
  Hammer,
  Paintbrush,
  Sparkles,
  Leaf,
  Car,
  Fan,
} from "lucide-react";

const categories = [
  {
    key: "plumber",
    label: "Plumber",
    icon: Wrench,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "electrician",
    label: "Electrician",
    icon: Plug,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    key: "mechanic",
    label: "Mechanic",
    icon: Settings,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    key: "carpenter",
    label: "Carpenter",
    icon: Hammer,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    key: "painter",
    label: "Painter",
    icon: Paintbrush,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    key: "cleaner",
    label: "Cleaner",
    icon: Sparkles,
    gradient: "from-sky-500 to-indigo-500",
  },
  {
    key: "gardener",
    label: "Gardener",
    icon: Leaf,
    gradient: "from-green-500 to-lime-500",
  },
  {
    key: "driver",
    label: "Driver",
    icon: Car,
    gradient: "from-slate-500 to-gray-500",
  },
  {
    key: "ac-technician",
    label: "AC Technician",
    icon: Fan,
    gradient: "from-blue-600 to-indigo-600",
  },
];

export default async function CustomerDashboardPage() {
  const workers = await prisma.user.findMany({
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
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-white tracking-tight">
              Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-light">
                Perfect Worker
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
              Connect with skilled professionals in your area. Browse by
              category or search for specific expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
            Browse Categories
          </h2>
          <p className="text-gray-400 text-base">
            Select a category to find skilled professionals
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(({ key, label, icon: Icon, gradient }) => (
            <Link
              key={key}
              href={`/customer/search?category=${encodeURIComponent(key)}`}
              aria-label={`Browse ${label}s`}
              className="group block"
            >
              <Card className="relative h-full border-0 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div
                        className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40`}
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-white group-hover:text-gray-100 transition-colors">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed px-2">
                        Professional {label.toLowerCase()}s ready to help
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                      <div className="inline-flex items-center text-sm text-blue-400 font-medium">
                        View professionals
                        <svg
                          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Workers Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">
              Featured Professionals
            </h2>
            <p className="text-gray-400 text-base">
              Recently joined skilled workers
            </p>
          </div>
          <Link href="/customer/search">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              Browse All Workers
            </Button>
          </Link>
        </div>

        {workers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              No workers available at the moment
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Check back later for new professionals
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((w) => (
              <Card
                key={w.id}
                className="group border-0 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 overflow-hidden flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {(w.name ?? "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-1 truncate group-hover:text-blue-300 transition-colors">
                        {w.name ?? "Professional Worker"}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="truncate">
                          {w.workerProfile?.qualification ||
                            "Skilled Professional"}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="whitespace-nowrap">
                          {w.workerProfile?.yearsExperience ?? 0}+ years
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <svg
                          className="h-4 w-4 text-gray-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {w.workerProfile?.city || "Location"}
                        </span>
                        {w.workerProfile?.availableAreas &&
                          w.workerProfile.availableAreas.length > 0 && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="truncate text-xs">
                                +{w.workerProfile.availableAreas.length} areas
                              </span>
                            </>
                          )}
                      </div>

                      {w.workerProfile?.skilledIn &&
                        w.workerProfile.skilledIn.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {w.workerProfile.skilledIn
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            {w.workerProfile.skilledIn.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                +{w.workerProfile.skilledIn.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      <div className="mt-4 flex gap-2">
                        <Link href={`/workers/${w.id}`}>
                          <Button
                            variant="secondary"
                            className="bg-gray-700 text-white hover:bg-gray-600"
                          >
                            View
                          </Button>
                        </Link>
                        <BookWorkerButton workerId={w.id} />
                      </div>
                    </div>
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
