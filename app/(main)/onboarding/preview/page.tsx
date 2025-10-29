"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Star,
  Loader2,
  Check,
  Sparkles,
  Award,
  Clock,
} from "lucide-react";
import { setUserRole } from "@/app/api/actions/onboarding";
import useFetch from "@/hooks/use-fetch";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useUser } from "@clerk/nextjs";
import ClickSpark from "@/components/ClickSpark";

// Profile Image Component with fallback
function ProfileImage({
  src,
  alt,
  className,
}: {
  src?: string | File[];
  alt: string;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    if (src) {
      if (typeof src === "string") {
        url = src.trim() || null;
        setImageUrl(url);
      } else if (Array.isArray(src) && src.length > 0) {
        // Check if the first item is actually a File object
        const firstItem = src[0];
        if (
          firstItem &&
          typeof firstItem === "object" &&
          "name" in firstItem &&
          "type" in firstItem
        ) {
          try {
            url = URL.createObjectURL(firstItem as File);
            setImageUrl(url);
          } catch (error) {
            console.warn("Failed to create object URL:", error);
            setImageUrl(null);
          }
        }
      }
    }

    // Cleanup function
    return () => {
      if (url && typeof src !== "string") {
        URL.revokeObjectURL(url);
      }
    };
  }, [src]);

  if (!imageUrl || imageError) {
    return <User className="h-16 w-16 text-gray-400" />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={128}
      height={128}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}

// Work Image Component with fallback
function WorkImage({
  src,
  alt,
  className,
}: {
  src: string | File[];
  alt: string;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;

    if (src) {
      if (typeof src === "string") {
        url = src.trim() || null;
        setImageUrl(url);
      } else if (Array.isArray(src) && src.length > 0) {
        // Check if the first item is actually a File object
        const firstItem = src[0];
        if (
          firstItem &&
          typeof firstItem === "object" &&
          "name" in firstItem &&
          "type" in firstItem
        ) {
          try {
            url = URL.createObjectURL(firstItem as File);
            setImageUrl(url);
          } catch (error) {
            console.warn("Failed to create object URL:", error);
            setImageUrl(null);
          }
        }
      }
    }

    // Cleanup function
    return () => {
      if (url && typeof src !== "string") {
        URL.revokeObjectURL(url);
      }
    };
  }, [src]);

  if (!imageUrl || imageError) {
    return (
      <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center border border-gray-200 dark:border-gray-600">
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={200}
      height={120}
      className={className}
      style={{ width: "auto", height: "auto" }}
      onError={() => setImageError(true)}
    />
  );
}

type OnboardingResponse = {
  success: boolean;
  redirect?: string;
  error?: string;
};

type WorkerDetails = {
  aadharNumber: string;
  qualification: string;
  certificates: string[];
  skilledIn: string[];
  availableAreas: string[];
  yearsExperience: number;
  hourlyRate: number;
  minimumFee: number;
  profilePic?: File[];
  bio?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type CustomerDetails = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type PreviousWork = {
  id: string;
  title: string;
  description: string;
  images: File[];
  category?: string;
  dateCompleted?: string;
  duration?: string;
  complexity?: string;
  costRange?: string;
  // Keep backward compatibility
  imageUrl?: string;
};

export default function PreviewPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(
    null
  );
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetails | null>(null);
  const [previousWorks, setPreviousWorks] = useState<PreviousWork[]>([]);
  const [isWorker, setIsWorker] = useState(false);

  const {
    loading,
    data,
    fn: submitUserRole,
  } = useFetch<[FormData], OnboardingResponse>(setUserRole);

  // Get user's full name
  const userName = user?.fullName || user?.firstName || "Professional";

  useEffect(() => {
    // Check if user is worker or customer based on stored data
    const storedWorkerDetails = sessionStorage.getItem("workerDetails");
    const storedCustomerDetails = sessionStorage.getItem("customerDetails");
    const storedPreviousWorks = sessionStorage.getItem("previousWorks");

    if (storedWorkerDetails) {
      setWorkerDetails(JSON.parse(storedWorkerDetails));
      setIsWorker(true);
      if (storedPreviousWorks) {
        setPreviousWorks(JSON.parse(storedPreviousWorks));
      }
    } else if (storedCustomerDetails) {
      setCustomerDetails(JSON.parse(storedCustomerDetails));
      setIsWorker(false);
    } else {
      // No data found, redirect to onboarding
      router.push("/onboarding");
    }
  }, [router]);

  useEffect(() => {
    if (data?.success && data.redirect) {
      // Clear session storage
      sessionStorage.removeItem("workerDetails");
      sessionStorage.removeItem("customerDetails");
      sessionStorage.removeItem("previousWorks");

      router.push(data.redirect);
    }
  }, [data, router]);
  const handleSubmit = async () => {
    if (!workerDetails && !customerDetails) return;

    // Create profile
    const formData = new FormData();

    if (isWorker && workerDetails) {
      formData.append("role", "WORKER");
      Object.entries(workerDetails).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      // Add previous works if any
      if (previousWorks.length > 0) {
        formData.append("previousWorks", JSON.stringify(previousWorks));
      }
    } else if (customerDetails) {
      formData.append("role", "CUSTOMER");
      Object.entries(customerDetails).forEach(([key, val]) => {
        formData.append(key, String(val));
      });
    }

    await submitUserRole(formData);
  };

  const handleBack = () => {
    if (isWorker) {
      router.push("/onboarding/previous-work");
    } else {
      router.push("/onboarding/customer-details");
    }
  };

  if (!workerDetails && !customerDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {isWorker ? "Previous Work" : "Details"}
            </Button>

            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <ShimmerText
                  text="Profile Preview"
                  className="text-3xl md:text-4xl font-bold mb-2"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
              >
                Review your professional profile before going live
              </motion.p>
            </div>
          </motion.div>

          {isWorker && workerDetails ? (
            <>
              {/* Worker Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-6 overflow-hidden">
                  <CardContent className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      {/* Profile Image */}
                      <motion.div
                        className="flex-shrink-0 mx-auto md:mx-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="relative">
                          <div className="w-28 h-28 md:w-32 md:h-32 bg-blue-50 dark:bg-blue-950/20 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white dark:ring-gray-800">
                            <ProfileImage
                              src={workerDetails.profilePic}
                              alt="Profile"
                              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Profile Info */}
                      <div className="flex-1 text-center md:text-left">
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {userName}
                          </h2>
                          {workerDetails.qualification && (
                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-3">
                              {workerDetails.qualification}
                            </p>
                          )}
                          <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start">
                            <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                              <span className="text-sm">
                                {workerDetails.city}, {workerDetails.state}
                              </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                              <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                              <span className="text-sm">
                                {workerDetails.yearsExperience} years experience
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {workerDetails.skilledIn.map((skill, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all px-3 py-1"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Bio Section */}
                        {workerDetails.bio && (
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                              <User className="h-5 w-5 text-purple-600" />
                              About
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                              {workerDetails.bio}
                            </p>
                          </motion.div>
                        )}

                        {/* Pricing Cards */}
                        <motion.div
                          className="grid grid-cols-2 gap-3 md:gap-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 md:p-5 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all">
                            <h4 className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Hourly Rate
                            </h4>
                            <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100">
                              ₹{workerDetails.hourlyRate}
                              <span className="text-sm font-normal text-blue-600 dark:text-blue-400">
                                /hr
                              </span>
                            </p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 md:p-5 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-lg transition-all">
                            <h4 className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              Minimum Fee
                            </h4>
                            <p className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100">
                              ₹{workerDetails.minimumFee}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Previous Work Section */}
              {previousWorks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-6">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Star className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        Portfolio Highlights
                        <Badge className="bg-blue-600 text-white ml-2">
                          {previousWorks.length}
                        </Badge>
                      </h3>
                      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {previousWorks.map((work, index) => (
                          <motion.div
                            key={work.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="group"
                          >
                            <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all duration-300 h-full">
                              <div className="relative overflow-hidden rounded-lg mb-4">
                                <WorkImage
                                  src={
                                    work.images && work.images.length > 0
                                      ? work.images
                                      : work.imageUrl || ""
                                  }
                                  alt={work.title}
                                  className="w-full h-40 object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                                />
                                {work.category && (
                                  <Badge className="absolute top-2 right-2 bg-blue-600/90 text-white text-xs">
                                    {work.category}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-1">
                                {work.title}
                              </h4>
                              {work.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-3">
                                  {work.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-auto">
                                {work.complexity && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                                  >
                                    {work.complexity}
                                  </Badge>
                                )}
                                {work.duration && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {work.duration}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Service Areas Section */}
              {workerDetails.availableAreas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-6">
                    <CardContent className="p-6 md:p-10">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <MapPin className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        Service Areas
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {workerDetails.availableAreas.map((area, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge
                              variant="outline"
                              className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-4 py-2 text-sm transition-all"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {area}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            customerDetails && (
              /* Customer Profile Preview */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-xl rounded-2xl mb-6">
                  <CardContent className="p-6 md:p-10">
                    <div className="text-center mb-8">
                      <motion.div
                        className="relative inline-block"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-blue-50 dark:bg-blue-950/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-white dark:ring-gray-800">
                          <User className="h-12 w-12 md:h-14 md:w-14 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </motion.div>

                      <motion.h2
                        className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Welcome, {userName}!
                      </motion.h2>

                      <motion.div
                        className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                        <span className="text-sm md:text-base">
                          {customerDetails.city}, {customerDetails.state}
                        </span>
                      </motion.div>
                    </div>

                    <motion.div
                      className="max-w-md mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        Address Information
                      </h3>
                      <div className="space-y-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <p className="leading-relaxed text-sm md:text-base">
                          {customerDetails.address}
                        </p>
                        <p className="text-sm md:text-base">
                          {customerDetails.city}, {customerDetails.state}{" "}
                          {customerDetails.postalCode}
                        </p>
                        <p className="text-sm md:text-base">
                          {customerDetails.country}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}

          {/* Submit Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={25}>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 px-8 md:px-12 py-5 md:py-6 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base md:text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    )}
                    {isWorker
                      ? "Create Worker Profile"
                      : "Create Customer Profile"}
                  </span>
                  <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </ClickSpark>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-4 text-sm text-gray-500 dark:text-gray-400"
            >
              🎉 You&apos;re one click away from joining our community!
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
