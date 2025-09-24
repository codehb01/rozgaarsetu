"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/ui/dashboard-skeleton";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";

const categories = [
  { key: "plumber", label: "Plumber", emoji: "🔧" },
  { key: "electrician", label: "Electrician", emoji: "⚡" },
  { key: "mechanic", label: "Mechanic", emoji: "🔧" },
  { key: "carpenter", label: "Carpenter", emoji: "🔨" },
  { key: "painter", label: "Painter", emoji: "🎨" },
  { key: "cleaner", label: "Cleaner", emoji: "✨" },
  { key: "gardener", label: "Gardener", emoji: "🌱" },
  { key: "driver", label: "Driver", emoji: "🚗" },
  { key: "ac-technician", label: "AC Technician", emoji: "❄️" },
];

export default function CustomerDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading workers from API
    const loadWorkers = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock worker data
        const mockWorkers = [
          {
            id: "1",
            name: "Rajesh Kumar",
            workerProfile: {
              skilledIn: ["plumber", "electrician"],
              city: "Mumbai",
              availableAreas: ["Andheri", "Bandra"],
              yearsExperience: 5,
              qualification: "ITI Certificate",
              profilePic: null,
              bio: "Experienced plumber and electrician"
            }
          },
          // Add more mock workers as needed
        ];
        
        setWorkers(mockWorkers);
      } catch (error) {
        console.error("Error loading workers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkers();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="min-h-screen relative overflow-hidden">
        {/* Hero Section */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              <ShimmerText 
                text="Find Your Perfect Worker"
                className="text-4xl sm:text-5xl font-bold tracking-tight"
              />
            </h1>
            <div className="max-w-2xl mx-auto">
              <TextGenerateEffect 
                words="Connect with skilled professionals in your area. Browse by category or search for specific expertise."
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                duration={0.6}
              />
            </div>
          </motion.div>
        </section>

        {/* Categories Section */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Select a category to find skilled professionals
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {categories.map(({ key, label, emoji }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
              >
                <Link
                  href={`/customer/search?category=${encodeURIComponent(key)}`}
                  className="block group"
                >
                  <MainMenusGradientCard
                    title={label}
                    description={`Professional ${label.toLowerCase()}s ready to help`}
                    withArrow={true}
                    circleSize={300}
                    className="h-32 flex flex-col items-center justify-center"
                  >
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-200">
                      {emoji}
                    </div>
                  </MainMenusGradientCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Workers Section */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Professionals
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Recently joined skilled workers
              </p>
            </div>
            <Link 
              href="/customer/search"
              className="group inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 no-underline border-none cursor-pointer"
            >
              <span className="relative z-10">Browse All Workers</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
          </motion.div>

          {workers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center py-16"
            >
              <div className="text-gray-600 dark:text-gray-400 text-xl mb-2">
                No workers available at the moment
              </div>
              <p className="text-gray-500 dark:text-gray-500 text-base">
                Check back later for new professionals
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {workers.map((w, index) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
                  className="group flex items-center gap-6 p-6 rounded-2xl transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-900/50 hover:backdrop-blur-xl border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {(w.name ?? "U").charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {w.name ?? "Professional Worker"}
                    </h3>

                    <div className="flex items-center gap-4 mb-3 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">
                        {w.workerProfile?.qualification || "Skilled Professional"}
                      </span>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span>
                        {w.workerProfile?.yearsExperience ?? 0}+ years experience
                      </span>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {w.workerProfile?.city || "Location"}
                      </span>
                    </div>

                    {w.workerProfile?.skilledIn && w.workerProfile.skilledIn.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {w.workerProfile.skilledIn.slice(0, 4).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {w.workerProfile.skilledIn.length > 4 && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                            +{w.workerProfile.skilledIn.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      href={`/workers/${w.id}`}
                      className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] no-underline"
                    >
                      View Profile
                    </Link>
                    <Link 
                      href={`/customer/bookings?worker=${w.id}`}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 no-underline"
                    >
                      Book Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
