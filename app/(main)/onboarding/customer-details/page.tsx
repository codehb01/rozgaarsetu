"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LocateFixed, Loader2 } from "lucide-react";
import { customerFormSchema, type CustomerFormData } from "@/lib/schema";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import { useLocation } from "@/hooks/use-location";
import { Button as UIButton } from "@/components/ui/button";
import { formatDisplayAddress } from "@/lib/location";

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
  const applyGeocode = (res: any) => {
    const addr = res?.address || {}
    if (addr.city) setValue("city", addr.city)
    if (addr.state) setValue("state", addr.state)
    if (addr.country) setValue("country", addr.country)
    if (addr.postalCode) setValue("postalCode", addr.postalCode)
    if (res?.coords?.lat) setValue("latitude", res.coords.lat)
    if (res?.coords?.lng) setValue("longitude", res.coords.lng)
  }

  if (typeof window !== "undefined" && place && geoStatus === "success") {
    if (!watch("address")) {
      setValue("address", formatDisplayAddress(place.address) || place.displayName || "")
      applyGeocode(place)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/onboarding")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Customer Profile Details
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us where you&apos;re located
          </p>
        </div>

        <Card className="border-emerald-900/20">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Address Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Address</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <OpenStreetMapInput
                        value={watch("address")}
                        onChange={(v) => setValue("address", v)}
                        onSelect={applyGeocode}
                        placeholder="Search your address"
                        inputClassName="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <UIButton
                      type="button"
                      variant="outline"
                      onClick={getCurrentPosition}
                      className="whitespace-nowrap"
                      disabled={geoStatus === "locating"}
                    >
                      {geoStatus === "locating" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LocateFixed className="h-4 w-4 mr-2" />
                      )}
                      Use my location
                    </UIButton>
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      {...register("city")}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="State"
                      {...register("state")}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Country"
                      {...register("country")}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Postal Code"
                      {...register("postalCode")}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Continue to Preview
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
