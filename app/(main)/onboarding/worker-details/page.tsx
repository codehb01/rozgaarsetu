"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, ArrowLeft } from "lucide-react";

interface WorkerFormData {
  aadharNumber: string;
  qualification: string;
  certificates: string;
  skilledIn: string;
  availableAreas: string;
  yearsExperience: number;
  hourlyRate: number;
  minimumFee: number;
  profilePic: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function WorkerDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      skilledIn: "",
      qualification: "",
      certificates: "",
      aadharNumber: "",
      yearsExperience: 0,
      hourlyRate: 0,
      minimumFee: 0,
      profilePic: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      availableAreas: "",
    },
  });

  const onSubmit = async (data: WorkerFormData) => {
    setIsLoading(true);

    // Process array fields - convert comma-separated strings to arrays
    const processedData = {
      ...data,
      skilledIn: data.skilledIn
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      certificates: data.certificates
        ? data.certificates
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      availableAreas: data.availableAreas
        ? data.availableAreas
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
    };

    // Store processed form data in sessionStorage for later use
    sessionStorage.setItem("workerDetails", JSON.stringify(processedData));

    // Navigate to previous work page
    router.push("/onboarding/previous-work");

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
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
            Worker Profile Details
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your skills and experience
          </p>
        </div>

        <Card className="border-emerald-900/20">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Aadhar Number (12 digits)"
                      {...register("aadharNumber")}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.aadharNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.aadharNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Years of Experience"
                      type="number"
                      {...register("yearsExperience", { valueAsNumber: true })}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.yearsExperience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.yearsExperience.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Qualification"
                    {...register("qualification")}
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.qualification.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Certificates (comma separated)"
                    {...register("certificates")}
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.certificates && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.certificates.message}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us about yourself (Bio)"
                    {...register("bio")}
                    className="bg-gray-800 border-gray-700 min-h-20"
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bio.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills and Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Skills & Services
                </h3>

                <div>
                  <Input
                    placeholder="Skilled In (comma separated, e.g., plumber, electrician)"
                    {...register("skilledIn")}
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.skilledIn && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.skilledIn.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Available Areas (comma separated)"
                    {...register("availableAreas")}
                    className="bg-gray-800 border-gray-700"
                  />
                  {errors.availableAreas && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.availableAreas.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Pricing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Hourly Rate (₹)"
                      type="number"
                      {...register("hourlyRate", { valueAsNumber: true })}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.hourlyRate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hourlyRate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Minimum Fee (₹)"
                      type="number"
                      {...register("minimumFee", { valueAsNumber: true })}
                      className="bg-gray-800 border-gray-700"
                    />
                    {errors.minimumFee && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.minimumFee.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Address Information
                </h3>

                <div>
                  <Input
                    placeholder="Address"
                    {...register("address")}
                    className="bg-gray-800 border-gray-700"
                  />
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

              {/* Profile Picture */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Profile Picture (Optional)
                </h3>

                <Controller
                  name="profilePic"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                      type="profile"
                      placeholder="Upload profile picture or paste URL"
                    />
                  )}
                />
                {errors.profilePic && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profilePic.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Continue to Previous Work
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
