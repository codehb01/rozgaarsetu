"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";

export default function FinishPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the user role from session storage before clearing it
    const savedData = sessionStorage.getItem("onboardingData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserRole(data.role);
    }
    
    // Clear session storage
    sessionStorage.removeItem("onboardingData");
    setIsLoading(false);

    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      if (userRole === "WORKER") {
        router.push("/worker");
      } else if (userRole === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [userRole, router]);

  const handleContinue = () => {
    if (userRole === "WORKER") {
      router.push("/worker");
    } else if (userRole === "CUSTOMER") {
      router.push("/customer");
    } else {
      router.push("/");
    }
  };

  if (isLoading) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar - Complete */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">Registration Complete!</span>
            <span className="text-sm text-muted-foreground">Welcome to RozgaarSetu</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "100%" }}></div>
          </div>
        </div>

        {/* Success Content */}
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4">Registration Successful! 🎉</h1>
          
          {userRole === "WORKER" ? (
            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-4">
                Welcome to RozgaarSetu! Your worker profile has been created successfully.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="font-semibold mb-3">What's Next?</h3>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Browse available jobs in your area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete your profile to increase visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Start receiving job requests from customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Build your reputation with quality work</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : userRole === "CUSTOMER" ? (
            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-4">
                Welcome to RozgaarSetu! Your customer profile has been created successfully.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold mb-3">What's Next?</h3>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Search for skilled workers in your area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Post job requests with your requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Review worker profiles and ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hire workers and manage your projects</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to RozgaarSetu! Your registration has been completed successfully.
            </p>
          )}

          {/* Auto-redirect Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 mb-6">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You'll be automatically redirected to your dashboard in a few seconds...
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {userRole === "WORKER" ? "Go to Worker Dashboard" : 
             userRole === "CUSTOMER" ? "Go to Customer Dashboard" : 
             "Continue to Dashboard"}
          </button>

          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-semibold mb-4">Need Help Getting Started?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-background border border-input rounded-lg p-4">
                <h4 className="font-medium mb-2">📚 Help Center</h4>
                <p className="text-muted-foreground">Find guides and tutorials to make the most of RozgaarSetu</p>
              </div>
              <div className="bg-background border border-input rounded-lg p-4">
                <h4 className="font-medium mb-2">💬 Support</h4>
                <p className="text-muted-foreground">Contact our support team if you have any questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}