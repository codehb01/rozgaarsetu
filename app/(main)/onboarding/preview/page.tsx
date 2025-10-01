"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
} from "lucide-react";
import { setUserRole } from "@/app/api/actions/onboarding";
import useFetch from "@/hooks/use-fetch";

// Profile Image Component with fallback
function ProfileImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || !src.trim() || imageError) {
    return <User className="h-16 w-16 text-gray-400" />;
  }

  return (
    <Image
      src={src}
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
  src: string;
  alt: string;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || !src.trim() || imageError) {
    return (
      <div className="w-full h-24 bg-gray-700 rounded flex items-center justify-center">
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
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
  profilePic?: string;
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
  imageUrl: string;
};

export default function PreviewPage() {
  const router = useRouter();
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {isWorker ? "Previous Work" : "Details"}
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Preview
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your profile before submitting
          </p>
        </div>

        {isWorker && workerDetails ? (
          <>
            {/* Worker Profile Preview */}
            <Card className="border-emerald-900/20 mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      <ProfileImage
                        src={workerDetails.profilePic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {workerDetails.qualification || "Professional"}
                      </h2>
                      <div className="flex items-center text-gray-400 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {workerDetails.city}, {workerDetails.state}
                      </div>
                      <div className="flex items-center text-gray-400 mb-3">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {workerDetails.yearsExperience} years experience
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-white mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {workerDetails.skilledIn.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-emerald-900/20 text-emerald-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {workerDetails.bio && (
                      <div className="mb-4">
                        <h3 className="font-semibold text-white mb-2">About</h3>
                        <p className="text-gray-300">{workerDetails.bio}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Hourly Rate
                        </h4>
                        <p className="text-emerald-400">
                          ₹{workerDetails.hourlyRate}/hour
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Minimum Fee
                        </h4>
                        <p className="text-emerald-400">
                          ₹{workerDetails.minimumFee}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Work */}
            {previousWorks.length > 0 && (
              <Card className="border-emerald-900/20 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-emerald-400" />
                    Previous Work ({previousWorks.length})
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {previousWorks.map((work) => (
                      <div
                        key={work.id}
                        className="border border-gray-700 rounded-lg p-3"
                      >
                        <WorkImage
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                        <h4 className="font-medium text-white text-sm mb-1">
                          {work.title}
                        </h4>
                        {work.description && (
                          <p className="text-gray-400 text-xs line-clamp-2">
                            {work.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Areas */}
            {workerDetails.availableAreas.length > 0 && (
              <Card className="border-emerald-900/20 mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-white mb-4">
                    Service Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {workerDetails.availableAreas.map((area, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          customerDetails && (
            /* Customer Profile Preview */
            <Card className="border-emerald-900/20 mb-6">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome, Customer!
                  </h2>
                  <div className="flex items-center justify-center text-gray-400 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {customerDetails.city}, {customerDetails.state}
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <h3 className="font-semibold text-white mb-4">
                    Address Information
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p>{customerDetails.address}</p>
                    <p>
                      {customerDetails.city}, {customerDetails.state}{" "}
                      {customerDetails.postalCode}
                    </p>
                    <p>{customerDetails.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 px-8"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            {isWorker ? "Create Worker Profile" : "Create Customer Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}
