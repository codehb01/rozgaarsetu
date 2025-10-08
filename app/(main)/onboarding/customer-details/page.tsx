"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  LocateFixed,
  Loader2,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { customerFormSchema, type CustomerFormData } from "@/lib/schema";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import { useLocation } from "@/hooks/use-location";
import { formatDisplayAddress } from "@/lib/location";
import ClickSpark from "@/components/ClickSpark";
import { motion } from "framer-motion";

export default function CustomerDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const { getCurrentPosition, status: geoStatus, place } = useLocation();

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);

    // Store form data in sessionStorage for later use
    sessionStorage.setItem("customerDetails", JSON.stringify(data));

    // Navigate to preview page
    router.push("/onboarding/preview");

    setIsLoading(false);
  };

  // When geocode or browser location is available, set latitude/longitude into form data
  // Note: CustomerFormData already allows latitude/longitude (schema updated)
  const applyGeocode = (res: {
    address?: {
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    coords?: {
      lat?: number;
      lng?: number;
    };
  }) => {
    const addr = res?.address || {};
    if (addr.city) setValue("city", addr.city);
    if (addr.state) setValue("state", addr.state);
    if (addr.country) setValue("country", addr.country);
    if (addr.postalCode) setValue("postalCode", addr.postalCode);
    if (res?.coords?.lat) setValue("latitude", res.coords.lat);
    if (res?.coords?.lng) setValue("longitude", res.coords.lng);
  };

  if (typeof window !== "undefined" && place && geoStatus === "success") {
    if (!watch("address")) {
      setValue(
        "address",
        formatDisplayAddress(place.address) || place.displayName || ""
      );
      applyGeocode(place);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with motion */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              className="mb-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Role Selection
            </Button>

            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Customer Profile Setup
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Tell us where you&apos;re located so we can connect you with
                nearby workers
              </p>
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 md:p-8">
                {/* Step Badge */}
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-400/20">
                    <Sparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Location Setup
                    </span>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Address Information
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        Tell us where you&apos;re located so we can find workers
                        near you
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Full Address
                        </label>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <OpenStreetMapInput
                              value={watch("address")}
                              onChange={(v) => setValue("address", v)}
                              onSelect={applyGeocode}
                              placeholder="Search your address"
                              inputClassName="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getCurrentPosition}
                            className="whitespace-nowrap h-11 md:h-12 px-4 border-gray-200 dark:border-gray-700"
                            disabled={geoStatus === "locating"}
                          >
                            {geoStatus === "locating" ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <LocateFixed className="h-4 w-4 mr-2" />
                            )}
                            <span className="hidden sm:inline">
                              Use my location
                            </span>
                            <span className="sm:hidden">Location</span>
                          </Button>
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Input
                            placeholder="City"
                            {...register("city")}
                            className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Input
                            placeholder="State"
                            {...register("state")}
                            className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Input
                            placeholder="Country"
                            {...register("country")}
                            className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.country.message}
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Input
                            placeholder="Postal Code"
                            {...register("postalCode")}
                            className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                          />
                          {errors.postalCode && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.postalCode.message}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-emerald-50/50 dark:bg-emerald-950/20 p-5 md:p-6 rounded-xl border border-emerald-200/50 dark:border-emerald-400/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                            Why do we need your location?
                          </h3>
                          <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                            We use your address to show you workers in your area
                            and help them understand where the job is located.
                            Your exact location is only shared with workers you
                            book.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <ClickSpark
                      sparkColor="#10b981"
                      sparkCount={12}
                      sparkRadius={25}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 md:h-12 px-6 md:px-8 shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : null}
                        Continue to Preview
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </ClickSpark>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
