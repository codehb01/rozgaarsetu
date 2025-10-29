import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookWorkerButton from "@/components/book-worker-button";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import {
  Wrench,
  Plug,
  Settings,
  Hammer,
  Paintbrush,
  Sparkles,
  Leaf,
  Car,
  ArrowRight,
  MapPin,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";

const categories = [
  {
    key: "plumber",
    label: "Plumber",
    icon: Wrench,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    key: "electrician",
    label: "Electrician",
    icon: Plug,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    key: "mechanic",
    label: "Mechanic",
    icon: Settings,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    key: "carpenter",
    label: "Carpenter",
    icon: Hammer,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
  },
  {
    key: "painter",
    label: "Painter",
    icon: Paintbrush,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    key: "cleaner",
    label: "Cleaner",
    icon: Sparkles,
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-950",
  },
  {
    key: "gardener",
    label: "Gardener",
    icon: Leaf,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    key: "driver",
    label: "Driver",
    icon: Car,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Find skilled professionals for your next project
            </p>
          </div>
          <Link href="/customer/search">
            <Button className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-sm">
              Browse All Workers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats and Usage Tracker */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Bookings
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  2
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Jobs
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  8
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Rating Given
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  4.8
                </p>
              </div>
            </div>
          </Card>

          {/* Usage Tracker removed */}
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Find professionals by their expertise
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(({ key, label, icon: Icon, color, bgColor }) => (
            <Link
              key={key}
              href={`/customer/search?category=${encodeURIComponent(key)}`}
              aria-label={`Browse ${label}s`}
              className="group block"
            >
              <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Available now
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Workers Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recently Joined
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              New professionals on the platform
            </p>
          </div>
          <Link
            href="/customer/search"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {workers.length === 0 ? (
          <Card className="p-8 text-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No workers available</p>
              <p className="text-sm mt-1">
                Check back later for new professionals
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <Card
                key={worker.id}
                className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {(worker.name ?? "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {worker.name ?? "Professional"}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {worker.workerProfile?.qualification ||
                        "Skilled Professional"}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">
                        {worker.workerProfile?.city || "Location not specified"}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {worker.workerProfile?.yearsExperience ?? 0}+ years
                      </span>
                    </div>

                    {worker.workerProfile?.skilledIn &&
                      worker.workerProfile.skilledIn.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {worker.workerProfile.skilledIn
                            .slice(0, 2)
                            .map((skill: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
                              >
                                {skill}
                              </span>
                            ))}
                          {worker.workerProfile.skilledIn.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                              +{worker.workerProfile.skilledIn.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                    <div className="flex gap-2 mt-4">
                      <Link href={`/workers/${worker.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          View Profile
                        </Button>
                      </Link>
                      <BookWorkerButton workerId={worker.id} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
