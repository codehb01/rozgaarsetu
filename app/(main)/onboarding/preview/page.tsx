"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";

export default function PreviewPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Load onboarding data
    const savedData = sessionStorage.getItem("onboardingData");
    if (savedData) {
      setOnboardingData(JSON.parse(savedData));
    } else {
      // If no data found, redirect back to role selection
      router.push("/onboarding");
      return;
    }
    setIsInitialLoading(false);
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create FormData for submission
      const formData = new FormData();
      
      // Add all the data to formData
      Object.keys(onboardingData).forEach(key => {
        if (key === 'locationData') {
          // Handle location data specially
          const locationData = onboardingData[key];
          formData.append("formattedAddress", locationData.formattedAddress || "");
          formData.append("placeId", locationData.placeId || "");
          if (locationData.streetNumber) formData.append("streetNumber", locationData.streetNumber);
          if (locationData.streetName) formData.append("streetName", locationData.streetName);
          if (locationData.locality) formData.append("locality", locationData.locality);
          if (locationData.sublocality) formData.append("sublocality", locationData.sublocality);
          formData.append("city", locationData.city || "");
          formData.append("state", locationData.state || "");
          formData.append("country", locationData.country || "");
          formData.append("postalCode", locationData.postalCode || "");
          formData.append("latitude", locationData.latitude?.toString() || "0");
          formData.append("longitude", locationData.longitude?.toString() || "0");
        } else if (key === 'workSamples') {
          // Handle work samples as JSON array
          formData.append("workSamples", JSON.stringify(onboardingData[key]));
        } else if (key === 'skilledIn' && onboardingData[key]) {
          // Handle skills as JSON array
          const skillsArray = onboardingData[key].split(',').map((s: string) => s.trim()).filter(Boolean);
          formData.append("skilledIn", JSON.stringify(skillsArray));
        } else if (key === 'certificates' && onboardingData[key]) {
          // Handle certificates as JSON array
          const certsArray = onboardingData[key].split(',').map((s: string) => s.trim()).filter(Boolean);
          formData.append("certificates", JSON.stringify(certsArray));
        } else if (key === 'availableAreas' && onboardingData[key]) {
          // Handle available areas as JSON array
          const areasArray = onboardingData[key].split(',').map((s: string) => s.trim()).filter(Boolean);
          formData.append("availableAreas", JSON.stringify(areasArray));
        } else {
          // Handle all other fields
          formData.append(key, onboardingData[key] || "");
        }
      });

      // Submit to the onboarding API
      const response = await fetch('/api/actions/onboarding', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.redirect) {
        // Clear the session storage
        sessionStorage.removeItem("onboardingData");
        router.push("/onboarding/finish");
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string) => {
    if (onboardingData?.role === "WORKER") {
      if (section === "personal") {
        router.push("/onboarding/worker-details");
      } else if (section === "portfolio") {
        router.push("/onboarding/previous-work");
      }
    } else if (onboardingData?.role === "CUSTOMER") {
      router.push("/onboarding/customer-details");
    }
  };

  if (isInitialLoading) {
    return <OnboardingSkeleton />;
  }

  if (!onboardingData) {
    return null;
  }

  const isWorker = onboardingData.role === "WORKER";
  const stepCount = isWorker ? 4 : 2;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Step {stepCount - 1} of {stepCount}</span>
            <span className="text-sm text-muted-foreground">Review & Submit</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Review Your Information</h1>
          <p className="text-muted-foreground">
            Please review your details before submitting your registration
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Your basic details</p>
                </div>
              </div>
              <button
                onClick={() => handleEdit("personal")}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Edit
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Role:</span> {isWorker ? "Service Provider" : "Customer"}
              </div>
              <div>
                <span className="font-medium">Full Name:</span> {onboardingData.fullName || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {onboardingData.phone || "Not provided"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {onboardingData.email || "Not provided"}
              </div>
              {onboardingData.profilePic && (
                <div className="md:col-span-2">
                  <span className="font-medium">Profile Picture:</span> Uploaded
                </div>
              )}
              {onboardingData.bio && (
                <div className="md:col-span-2">
                  <span className="font-medium">Bio:</span> {onboardingData.bio}
                </div>
              )}
            </div>
          </div>

          {/* Professional Information (Workers only) */}
          {isWorker && (
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Professional Information</h3>
                    <p className="text-sm text-muted-foreground">Your skills and experience</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit("personal")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Edit
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Skills:</span> {onboardingData.skilledIn || "Not provided"}
                </div>
                <div>
                  <span className="font-medium">Experience:</span> {onboardingData.yearsExperience ? `${onboardingData.yearsExperience} years` : "Not provided"}
                </div>
                {onboardingData.hourlyRate && (
                  <div>
                    <span className="font-medium">Hourly Rate:</span> ₹{onboardingData.hourlyRate}
                  </div>
                )}
                {onboardingData.availability && (
                  <div>
                    <span className="font-medium">Availability:</span> {onboardingData.availability}
                  </div>
                )}
                {onboardingData.certificates && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Certificates:</span> {onboardingData.certificates}
                  </div>
                )}
                {onboardingData.availableAreas && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Service Areas:</span> {onboardingData.availableAreas}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio Information (Workers only) */}
          {isWorker && (
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Portfolio & Previous Work</h3>
                    <p className="text-sm text-muted-foreground">Your work samples and experience</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit("portfolio")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Work Samples:</span> {
                    onboardingData.workSamples && onboardingData.workSamples.length > 0 
                      ? `${onboardingData.workSamples.length} files uploaded`
                      : "None uploaded"
                  }
                </div>
                {onboardingData.previousProjects && (
                  <div>
                    <span className="font-medium">Previous Projects:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.previousProjects}</p>
                  </div>
                )}
                {onboardingData.specializations && (
                  <div>
                    <span className="font-medium">Specializations:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.specializations}</p>
                  </div>
                )}
                {onboardingData.achievements && (
                  <div>
                    <span className="font-medium">Achievements:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.achievements}</p>
                  </div>
                )}
                {onboardingData.testimonials && (
                  <div>
                    <span className="font-medium">Testimonials:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.testimonials}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Preferences (Customers only) */}
          {!isWorker && (
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Service Preferences</h3>
                    <p className="text-sm text-muted-foreground">Your service requirements</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit("personal")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                {onboardingData.preferences && (
                  <div>
                    <span className="font-medium">Service Types:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.preferences}</p>
                  </div>
                )}
                {onboardingData.budget && (
                  <div>
                    <span className="font-medium">Budget Range:</span> {onboardingData.budget}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Information */}
          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Location Information</h3>
                <p className="text-sm text-muted-foreground">Where you're located</p>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="space-y-2">
                {isWorker && onboardingData.locationData ? (
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="mt-1 text-muted-foreground">{onboardingData.locationData.formattedAddress}</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="mt-1 text-muted-foreground">{onboardingData.address}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <span className="font-medium">City:</span> {onboardingData.city}
                      </div>
                      <div>
                        <span className="font-medium">State:</span> {onboardingData.state}
                      </div>
                      <div>
                        <span className="font-medium">PIN:</span> {onboardingData.pinCode}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => {
              if (isWorker) {
                router.push("/onboarding/previous-work");
              } else {
                router.push("/onboarding/customer-details");
              }
            }}
            className="px-6 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-2 rounded-md text-sm font-medium transition-colors ${
              loading 
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  );
}