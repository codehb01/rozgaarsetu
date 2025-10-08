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
import { TranslatedText } from "@/hooks/use-batch-translation";

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
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Handle different src types
  let imageUrl: string | null = null;
  
  if (src) {
    if (typeof src === 'string') {
      imageUrl = src.trim() || null;
    } else if (Array.isArray(src) && src.length > 0) {
      // Check if the first item is actually a File object
      const firstItem = src[0];
      if (firstItem && typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem) {
        try {
          const url = URL.createObjectURL(firstItem as File);
          imageUrl = url;
          setObjectUrl(url);
        } catch (error) {
          console.warn('Failed to create object URL:', error);
          imageUrl = null;
        }
      }
    }
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

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

  // Handle different src types
  let imageUrl: string | null = null;
  
  if (src) {
    if (typeof src === 'string') {
      imageUrl = src.trim() || null;
    } else if (Array.isArray(src) && src.length > 0) {
      // Check if the first item is actually a File object
      const firstItem = src[0];
      if (firstItem && typeof firstItem === 'object' && 'name' in firstItem && 'type' in firstItem) {
        try {
          imageUrl = URL.createObjectURL(firstItem as File);
        } catch (error) {
          console.warn('Failed to create object URL:', error);
          imageUrl = null;
        }
      }
    }
  }

  if (!imageUrl || imageError) {
    return (
      <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center border border-gray-200 dark:border-gray-600">
        <span className="text-gray-400 text-xs"><TranslatedText context="onboarding">No Image</TranslatedText></span>
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
          <div className="text-gray-400"><TranslatedText context="onboarding">Loading...</TranslatedText></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <TranslatedText context="onboarding">Back to</TranslatedText>{" "}
              {isWorker ? <TranslatedText context="onboarding">Previous Work</TranslatedText> : <TranslatedText context="onboarding">Details</TranslatedText>}
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                <TranslatedText context="onboarding">Profile Preview</TranslatedText>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                <TranslatedText context="onboarding">Review your professional profile before going live</TranslatedText>
              </p>
            </div>
          </div>

        {isWorker && workerDetails ? (
          <>
            {/* Worker Profile Preview */}
            <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                      <ProfileImage
                        src={workerDetails.profilePic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-6">
                      <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                        {workerDetails.qualification || <TranslatedText context="onboarding">Professional</TranslatedText>}
                      </h2>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-5 w-5 mr-2" />
                        {workerDetails.city}, {workerDetails.state}
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Briefcase className="h-5 w-5 mr-2" />
                        {workerDetails.yearsExperience} <TranslatedText context="onboarding">years experience</TranslatedText>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3"><TranslatedText context="onboarding">Skills</TranslatedText></h3>
                      <div className="flex flex-wrap gap-2">
                        {workerDetails.skilledIn.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {workerDetails.bio && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3"><TranslatedText context="onboarding">About</TranslatedText></h3>
                        <p className="text-gray-600 leading-relaxed">{workerDetails.bio}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          <TranslatedText context="onboarding">Hourly Rate</TranslatedText>
                        </h4>
                        <p className="text-2xl font-semibold text-gray-900">
                          ₹{workerDetails.hourlyRate}/<TranslatedText context="onboarding">hour</TranslatedText>
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          <TranslatedText context="onboarding">Minimum Fee</TranslatedText>
                        </h4>
                        <p className="text-2xl font-semibold text-gray-900">
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
              <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
                <CardContent className="p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <Star className="h-5 w-5 mr-3 text-blue-600" />
                    <TranslatedText context="onboarding">Previous Work</TranslatedText> ({previousWorks.length})
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {previousWorks.map((work) => (
                      <div
                        key={work.id}
                        className="bg-gray-50 border-0 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <WorkImage
                          src={work.images && work.images.length > 0 ? work.images : (work.imageUrl || "")}
                          alt={work.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h4 className="font-medium text-gray-900 text-sm mb-2">
                          {work.title}
                        </h4>
                        {work.description && (
                          <p className="text-gray-600 text-xs line-clamp-2">
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
              <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
                <CardContent className="p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    <TranslatedText context="onboarding">Service Areas</TranslatedText>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {workerDetails.availableAreas.map((area, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1"
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
            <Card className="bg-white border-0 shadow-sm rounded-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    <TranslatedText context="onboarding">Welcome, Customer!</TranslatedText>
                  </h2>
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    {customerDetails.city}, {customerDetails.state}
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                    <TranslatedText context="onboarding">Address Information</TranslatedText>
                  </h3>
                  <div className="space-y-3 text-gray-600 bg-gray-50 rounded-xl p-6">
                    <p className="leading-relaxed">{customerDetails.address}</p>
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
            className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : null}
            <TranslatedText context="onboarding">{isWorker ? "Create Worker Profile" : "Create Customer Profile"}</TranslatedText>
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
