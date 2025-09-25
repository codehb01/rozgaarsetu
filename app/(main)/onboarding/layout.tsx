import { getCurrentUser } from "@/app/api/actions/onboarding";
import { redirect } from "next/navigation";
import { DatabaseError } from "@/components/ui/database-error";
import React from "react";

const OnBoardingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  try {
    const user = await getCurrentUser();
    
    // If user is null, it might be a database issue or new user
    if (user === null) {
      // Let the onboarding flow handle new users
      console.log("No user found or database connection issue - continuing with onboarding");
    } else {
      // Only redirect away from onboarding for completed roles.
      if (user?.role === "CUSTOMER") {
        redirect("/customer/dashboard");
      }
      if (user?.role === "WORKER") {
        redirect("/worker/dashboard");
      }
    }
  } catch (error) {
    console.error("Database error in onboarding layout:", error);
    return <DatabaseError error="Unable to load user profile" />;
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
