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
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnBoardingLayout;
