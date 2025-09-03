import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/api/actions/onboarding";

export const metadata = {
  title: "Onboarding - RozgaarSetu",
  description: "Complete your onboarding process to start using RozgaarSetu",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect users who have already completed onboarding
  if (user) {
    if (user.role === "CUSTOMER") {
      redirect("/customer/dashboard");
    } else if (user.role === "WORKER") {
      redirect("/worker/dashboard");
    } else if (user.role === "UNASSIGNED") {
      redirect("/onboarding");
    } else {
      redirect("/error");
    }
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
}
