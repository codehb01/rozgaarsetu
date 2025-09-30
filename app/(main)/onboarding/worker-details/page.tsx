"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";
import ImageUpload from "@/components/ui/image-upload";
import AddressTextarea from "@/components/ui/address-textarea";

export default function WorkerDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationData, setLocationData] = useState<{
    formattedAddress: string;
    placeId: string;
    streetNumber?: string;
    streetName?: string;
    locality?: string;
    sublocality?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }>({
    formattedAddress: "",
    placeId: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
  });
  const router = useRouter();

  useEffect(() => {
    setIsInitialLoading(false);
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
          const data = await response.json();
          
          if (data.success) {
            setLocationData(data.locationData);
          } else {
            setError("Failed to get address from location");
          }
        } catch (err) {
          setError("Failed to process location");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setError("Failed to get your location");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Store worker details in sessionStorage for the next step
      const workerData = {
        role: "WORKER",
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        profilePic: profilePicture,
        bio: formData.get("bio"),
        skilledIn: formData.get("skilledIn"),
        yearsExperience: formData.get("yearsExperience"),
        certificates: formData.get("certificates"),
        availableAreas: formData.get("availableAreas"),
        hourlyRate: formData.get("hourlyRate"),
        availability: formData.get("availability"),
        locationData: locationData,
      };

      sessionStorage.setItem("onboardingData", JSON.stringify(workerData));
      router.push("/onboarding/previous-work");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoading) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Step 1 of 4</span>
            <span className="text-sm text-muted-foreground">Worker Details</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "25%" }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Worker Registration</h1>
          <p className="text-muted-foreground">
            Share your professional details to start getting job opportunities
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-4">
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
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Profile Picture
                </label>
                <ImageUpload
                  value={profilePicture}
                  onChange={setProfilePicture}
                  uploadType="profile"
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  placeholder="Upload profile picture"
                />
                <p className="text-xs text-muted-foreground">Upload a clear photo of yourself (max 5MB)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="fullName"
                    name="fullName" 
                    type="text"
                    placeholder="Enter your full name" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="phone"
                    name="phone" 
                    type="tel"
                    placeholder="Enter your phone number" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="email"
                    name="email" 
                    type="email"
                    placeholder="Enter your email address" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea 
                  id="bio"
                  name="bio" 
                  rows={3}
                  placeholder="Tell customers about yourself, your experience, and work style (optional)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3 mb-4">
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
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="skilledIn" className="text-sm font-medium">
                  Skills <span className="text-destructive">*</span>
                </label>
                <input 
                  id="skilledIn"
                  name="skilledIn" 
                  type="text"
                  placeholder="Enter your skills (e.g., Plumbing, Electrical work, Carpentry)" 
                  required 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="yearsExperience" className="text-sm font-medium">
                    Years of Experience <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="yearsExperience"
                    name="yearsExperience" 
                    type="number"
                    min="0"
                    max="50"
                    placeholder="Enter years of experience" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="hourlyRate" className="text-sm font-medium">
                    Hourly Rate (₹)
                  </label>
                  <input 
                    id="hourlyRate"
                    name="hourlyRate" 
                    type="number"
                    min="50"
                    max="10000"
                    placeholder="Your hourly rate" 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="certificates" className="text-sm font-medium">
                  Certificates & Licenses
                </label>
                <input 
                  id="certificates"
                  name="certificates" 
                  type="text"
                  placeholder="Enter your certifications (optional)" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">Separate multiple certificates with commas</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="availability" className="text-sm font-medium">
                  Availability
                </label>
                <select 
                  id="availability"
                  name="availability" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select your availability</option>
                  <option value="full-time">Full Time (40+ hours/week)</option>
                  <option value="part-time">Part Time (20-40 hours/week)</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="flexible">Flexible Hours</option>
                  <option value="on-demand">On Demand</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="availableAreas" className="text-sm font-medium">
                  Available Service Areas
                </label>
                <input 
                  id="availableAreas"
                  name="availableAreas" 
                  type="text"
                  placeholder="Areas where you can provide services (optional)" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">Separate multiple areas with commas</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Location Information</h3>
                <p className="text-sm text-muted-foreground">Where you're based for work</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <AddressTextarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Enter your complete address (Street, Area, City, State, PIN Code)"
                    required
                    value={locationData.formattedAddress || ''}
                    onChange={(value) => setLocationData({
                      ...locationData,
                      formattedAddress: value
                    })}
                    onPlaceSelect={(placeData) => setLocationData({
                      formattedAddress: placeData.formattedAddress,
                      placeId: placeData.placeId,
                      streetNumber: placeData.streetNumber,
                      streetName: placeData.streetName,
                      locality: placeData.locality,
                      sublocality: placeData.sublocality,
                      city: placeData.city,
                      state: placeData.state,
                      country: placeData.country,
                      postalCode: placeData.postalCode,
                      latitude: placeData.latitude,
                      longitude: placeData.longitude,
                    })}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    locationLoading 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {locationLoading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="px-6 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                loading 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {loading ? 'Processing...' : 'Continue to Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}