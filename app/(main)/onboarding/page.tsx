"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/app/api/actions/onboarding";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";

export default function OnboardingPage() {
  const [step, setStep] = useState<"choose-role" | "worker-form" | "customer-form">("choose-role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get address from location');
          }
          
          const data = await response.json();
          
          if (data && data.display_name) {
            setLocationData({
              formattedAddress: data.display_name,
              placeId: data.place_id?.toString() || '',
              streetNumber: data.address?.house_number || '',
              streetName: data.address?.road || '',
              locality: data.address?.neighbourhood || data.address?.suburb || '',
              sublocality: data.address?.quarter || '',
              city: data.address?.city || data.address?.town || data.address?.village || '',
              state: data.address?.state || '',
              country: data.address?.country || '',
              postalCode: data.address?.postcode || '',
              latitude,
              longitude,
            });
          } else {
            throw new Error('No address found for this location');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to get address');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permission.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <OnboardingSkeleton />;
  }

  const handleRoleSelection = (role: "customer" | "worker") => {
    if (role === "customer") {
      setStep("customer-form");
    } else {
      setStep("worker-form");
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Combine first and last name into full name
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Remove separate name fields and add combined name
    formData.delete("firstName");
    formData.delete("lastName");
    formData.append("name", fullName);
    formData.append("role", "CUSTOMER");
    
    // Add location data (whether manually typed or autofilled)
    formData.append("formattedAddress", locationData.formattedAddress);
    if (locationData.placeId) formData.append("placeId", locationData.placeId);
    if (locationData.streetNumber) formData.append("streetNumber", locationData.streetNumber);
    if (locationData.streetName) formData.append("streetName", locationData.streetName);
    if (locationData.locality) formData.append("locality", locationData.locality);
    if (locationData.sublocality) formData.append("sublocality", locationData.sublocality);
    if (locationData.city) formData.append("city", locationData.city);
    if (locationData.state) formData.append("state", locationData.state);
    if (locationData.country) formData.append("country", locationData.country);
    if (locationData.postalCode) formData.append("postalCode", locationData.postalCode);

    try {
      const response = await setUserRole(formData);
      if (response.success && response.redirect) {
        router.push(response.redirect);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("role", "WORKER");

    // Add location data
    formData.append("formattedAddress", locationData.formattedAddress);
    formData.append("placeId", locationData.placeId);
    if (locationData.streetNumber) formData.append("streetNumber", locationData.streetNumber);
    if (locationData.streetName) formData.append("streetName", locationData.streetName);
    if (locationData.locality) formData.append("locality", locationData.locality);
    if (locationData.sublocality) formData.append("sublocality", locationData.sublocality);
    formData.append("city", locationData.city);
    formData.append("state", locationData.state);
    formData.append("country", locationData.country);
    formData.append("postalCode", locationData.postalCode);

    // Handle comma-separated values
    const skilledIn = formData.get("skilledIn") as string;
    const certificates = formData.get("certificates") as string;
    const availableAreas = formData.get("availableAreas") as string;

    if (skilledIn) {
      const skillsArray = skilledIn.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("skilledIn", JSON.stringify(skillsArray));
    }
    if (certificates) {
      const certsArray = certificates.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("certificates", JSON.stringify(certsArray));
    }
    if (availableAreas) {
      const areasArray = availableAreas.split(',').map(s => s.trim()).filter(Boolean);
      formData.set("availableAreas", JSON.stringify(areasArray));
    }

    try {
      const response = await setUserRole(formData);
      if (response.success && response.redirect) {
        router.push(response.redirect);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Role Selection
  if (step === "choose-role") {
    return (
      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
            Choose Your Role
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#6b7280" }}>
            Select how you want to use RozgaarSetu
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "20px" }}>
          
          {/* Customer Option */}
          <div onClick={() => handleRoleSelection("customer")} style={{ cursor: "pointer" }}>
            <MainMenusGradientCard
              title="Join as Customer"
              description="Book workers, manage service requests and track jobs. Find skilled professionals for your needs."
              withArrow={false}
              circleSize={300}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                gap: "1rem"
              }}>
                <div style={{ fontSize: "4rem" }}>👤</div>
                <button 
                  style={{ 
                    padding: "12px 24px", 
                    backgroundColor: "#3b82f6", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  Continue as Customer
                </button>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Worker Option */}
          <div onClick={() => handleRoleSelection("worker")} style={{ cursor: "pointer" }}>
            <MainMenusGradientCard
              title="Join as Worker"
              description="Create your profile, list your skills, and get hired for jobs. Start earning with your expertise."
              withArrow={false}
              circleSize={300}
            >
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%",
                gap: "1rem"
              }}>
                <div style={{ fontSize: "4rem" }}>🔧</div>
                <button 
                  style={{ 
                    padding: "12px 24px", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                  }}
                >
                  Continue as Worker
                </button>
              </div>
            </MainMenusGradientCard>
          </div>
        </div>
      </div>
    );
  }

  // Customer Form
  if (step === "customer-form") {
    return (
      <div className="min-h-screen bg-background text-foreground py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to RozgaarSetu
            </h1>
            <p className="text-muted-foreground">
              Complete your profile to start finding skilled professionals
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">
                Complete Your Customer Profile
              </h2>
              <p className="text-sm text-muted-foreground">
                Please fill in all required fields to continue
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleCustomerSubmit} className="space-y-6">
              
              {/* Personal Details Section */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personal Details</h3>
                    <p className="text-sm text-muted-foreground">Your basic information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <input 
                      id="firstName"
                      name="firstName" 
                      type="text"
                      placeholder="Enter your first name" 
                      required 
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <input 
                      id="lastName"
                      name="lastName" 
                      type="text"
                      placeholder="Enter your last name" 
                      required 
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Contact Information</h3>
                    <p className="text-sm text-muted-foreground">How we can reach you</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
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
                </div>
              </div>

              {/* Location Information Section */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Location Information</h3>
                    <p className="text-sm text-muted-foreground">Where you're located for service delivery</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        placeholder="Enter your complete address&#10;(Street, Area, City, State, PIN Code)"
                        required
                        value={locationData.formattedAddress || ''}
                        onChange={(e) => setLocationData({
                          ...locationData,
                          formattedAddress: e.target.value
                        })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
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
                    
                    <button
                      type="button"
                      onClick={() => {
                        setLocationData({
                          formattedAddress: '',
                          placeId: '',
                          city: '',
                          state: '',
                          country: '',
                          postalCode: '',
                          latitude: 0,
                          longitude: 0,
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    You can type your address manually or click "Use Current Location" to automatically detect your address
                  </p>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading || !locationData.formattedAddress}
                  className={`w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    loading || !locationData.formattedAddress
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Profile...
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Worker Form
  if (step === "worker-form") {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Complete Your Worker Profile</h2>
        {error && (
          <div style={{ 
            padding: "10px", 
            backgroundColor: "#f8d7da", 
            color: "#721c24", 
            border: "1px solid #f5c6cb", 
            borderRadius: "4px", 
            marginBottom: "20px" 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleWorkerSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            name="aadharNumber" 
            placeholder="Aadhar Number (12 digits)" 
            required 
            pattern="[0-9]{12}"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="qualification" 
            placeholder="Qualification" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="skilledIn" 
            placeholder="Skills (comma separated)" 
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="yearsExperience" 
            placeholder="Years of Experience" 
            type="number" 
            min="0"
            required 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="certificates" 
            placeholder="Certificates (comma separated, optional)" 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input 
            name="profilePic" 
            placeholder="Profile Picture URL (optional)" 
            type="url"
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <textarea 
            name="bio" 
            placeholder="Bio (optional)" 
            rows={3}
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
          />
          <input 
            name="availableAreas" 
            placeholder="Available Areas (comma separated, optional)" 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "600" }}>Location Information</h3>
            <OpenStreetMapInput
              onPlaceSelect={setLocationData}
              placeholder="Enter your work address"
              value={locationData.formattedAddress}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !locationData.formattedAddress || !locationData.city}
            style={{ 
              padding: "12px", 
              backgroundColor: (loading || !locationData.formattedAddress || !locationData.city) ? "#6c757d" : "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: (loading || !locationData.formattedAddress || !locationData.city) ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            {loading ? "Submitting..." : "Complete Profile"}
          </button>
        </form>
      </div>
    );
  }

  return null;
}
