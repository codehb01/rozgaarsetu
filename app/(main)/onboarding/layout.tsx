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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to RozgaarSetu
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us how you want to use the platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default OnBoardingLayout;
