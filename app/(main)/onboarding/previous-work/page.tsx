"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSkeleton } from "@/components/ui/dashboard-skeleton";
import MultiFileUpload from "@/components/ui/multi-file-upload";

export default function PreviousWorkPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [workSamples, setWorkSamples] = useState<File[]>([]);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Load existing onboarding data
    const savedData = sessionStorage.getItem("onboardingData");
    if (savedData) {
      setOnboardingData(JSON.parse(savedData));
    } else {
      // If no data found, redirect back to worker details
      router.push("/onboarding/worker-details");
      return;
    }
    setIsInitialLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Upload work samples if any
      let workSampleUrls: string[] = [];
      if (workSamples.length > 0) {
        for (const sample of workSamples) {
          const sampleFormData = new FormData();
          sampleFormData.append('file', sample);
          sampleFormData.append('type', 'work-sample');

          const sampleResponse = await fetch('/api/upload', {
            method: 'POST',
            body: sampleFormData,
          });

          if (sampleResponse.ok) {
            const sampleResult = await sampleResponse.json();
            workSampleUrls.push(sampleResult.url);
          }
        }
      }

      // Update onboarding data with portfolio information
      const updatedData = {
        ...onboardingData,
        workSamples: workSampleUrls,
        previousProjects: formData.get("previousProjects"),
        specializations: formData.get("specializations"),
        achievements: formData.get("achievements"),
        testimonials: formData.get("testimonials"),
      };

      sessionStorage.setItem("onboardingData", JSON.stringify(updatedData));
      router.push("/onboarding/preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Update onboarding data with empty portfolio information
    const updatedData = {
      ...onboardingData,
      workSamples: [],
      previousProjects: "",
      specializations: "",
      achievements: "",
      testimonials: "",
    };

    sessionStorage.setItem("onboardingData", JSON.stringify(updatedData));
    router.push("/onboarding/preview");
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
            <span className="text-sm font-medium text-primary">Step 2 of 4</span>
            <span className="text-sm text-muted-foreground">Portfolio & Previous Work</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "50%" }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Showcase Your Work</h1>
          <p className="text-muted-foreground">
            Share your previous projects and work samples to build trust with potential customers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Samples Upload */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Work Samples & Photos</h3>
                <p className="text-sm text-muted-foreground">Upload photos of your best work</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Work Samples
              </label>
              <MultiFileUpload
                value={workSamples}
                onChange={setWorkSamples}
                maxFiles={10}
                accept="image/*,.pdf"
                maxSize={10 * 1024 * 1024} // 10MB
                placeholder="Upload photos of your work"
                uploadType="work-sample"
              />
              <p className="text-xs text-muted-foreground">
                Upload up to 10 images or PDFs showing your best work (max 10MB each)
              </p>
            </div>
          </div>

          {/* Previous Projects */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Previous Projects</h3>
                <p className="text-sm text-muted-foreground">Describe your notable projects</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="previousProjects" className="text-sm font-medium">
                Notable Projects & Clients
              </label>
              <textarea 
                id="previousProjects"
                name="previousProjects" 
                rows={4}
                placeholder="Describe some of your notable projects, clients you've worked with, or significant jobs you've completed (optional)"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              />
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Specializations & Expertise</h3>
                <p className="text-sm text-muted-foreground">What makes you unique</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="specializations" className="text-sm font-medium">
                  Special Skills & Techniques
                </label>
                <textarea 
                  id="specializations"
                  name="specializations" 
                  rows={3}
                  placeholder="Any special techniques, tools, or methods you use that set you apart (optional)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="achievements" className="text-sm font-medium">
                  Achievements & Recognition
                </label>
                <textarea 
                  id="achievements"
                  name="achievements" 
                  rows={3}
                  placeholder="Any awards, recognition, or notable achievements in your field (optional)"
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                />
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Customer Testimonials</h3>
                <p className="text-sm text-muted-foreground">What customers say about your work</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="testimonials" className="text-sm font-medium">
                Customer Reviews & Feedback
              </label>
              <textarea 
                id="testimonials"
                name="testimonials" 
                rows={4}
                placeholder="Share any positive feedback or testimonials from previous customers (optional)"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              />
              <p className="text-xs text-muted-foreground">
                You can add more detailed testimonials later in your profile
              </p>
            </div>
          </div>

          {/* Optional Section Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  This section is optional
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  You can skip this step and add portfolio items later. However, having work samples significantly increases your chances of getting hired.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/onboarding/worker-details")}
              className="px-6 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                Skip for Now
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
          </div>
        </form>
      </div>
    </div>
  );
}