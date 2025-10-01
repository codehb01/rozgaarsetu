import { checkOnboardingAccess } from "@/lib/auth-utils";
import React from "react";

// Force dynamic rendering for this route group
export const dynamic = "force-dynamic";

const OnBoardingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Ensure only users without a role can access onboarding
  await checkOnboardingAccess();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to RozgaarSetu
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose how you'd like to get started on your journey with us
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default OnBoardingLayout;
