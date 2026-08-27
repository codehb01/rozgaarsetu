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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnBoardingLayout;
