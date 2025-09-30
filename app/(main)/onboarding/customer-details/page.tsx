"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";

export default function CustomerDetailsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsInitialLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Store customer details in sessionStorage for the preview page
      const customerData = {
        role: "CUSTOMER",
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        pinCode: formData.get("pinCode"),
        preferences: formData.get("preferences"),
        budget: formData.get("budget"),
      };

      sessionStorage.setItem("onboardingData", JSON.stringify(customerData));
      router.push("/onboarding/preview");
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
            <span className="text-sm font-medium text-primary">Step 1 of 2</span>
            <span className="text-sm text-muted-foreground">Customer Details</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "50%" }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Customer Registration</h1>
          <p className="text-muted-foreground">
            Tell us about yourself so we can connect you with the right service providers
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
                <p className="text-sm text-muted-foreground">Where you need services</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </label>
                <textarea 
                  id="address"
                  name="address" 
                  rows={3}
                  placeholder="Enter your complete address" 
                  required 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="city"
                    name="city" 
                    type="text"
                    placeholder="City" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">
                    State <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="state"
                    name="state" 
                    type="text"
                    placeholder="State" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="pinCode" className="text-sm font-medium">
                    PIN Code <span className="text-destructive">*</span>
                  </label>
                  <input 
                    id="pinCode"
                    name="pinCode" 
                    type="text"
                    placeholder="PIN Code" 
                    required 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Service Preferences</h3>
                <p className="text-sm text-muted-foreground">Help us match you better</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="preferences" className="text-sm font-medium">
                  Service Types You're Looking For
                </label>
                <textarea 
                  id="preferences"
                  name="preferences" 
                  rows={3}
                  placeholder="e.g., Plumbing, Electrical work, House cleaning, Gardening (optional)" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Typical Budget Range
                </label>
                <select 
                  id="budget"
                  name="budget" 
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select your typical budget (optional)</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1,000</option>
                  <option value="1000-2500">₹1,000 - ₹2,500</option>
                  <option value="2500-5000">₹2,500 - ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="above-10000">Above ₹10,000</option>
                </select>
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
              {loading ? 'Processing...' : 'Continue to Preview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}