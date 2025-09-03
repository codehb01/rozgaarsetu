import { getCurrentUser } from "@/app/api/actions/onboarding";
import { redirect } from "next/navigation";
import React from "react";
const OnBoardingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getCurrentUser();
  // Only redirect away from onboarding for completed roles.
  if (user?.role === "CUSTOMER") {
    redirect("/customer/dashboard");
  }
  if (user?.role === "WORKER") {
    redirect("/worker/dashboard");
  }
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
