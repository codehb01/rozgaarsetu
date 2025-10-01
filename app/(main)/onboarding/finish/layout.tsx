import { checkOnboardingAccess } from "@/lib/auth-utils";
import React from "react";

// Force dynamic rendering for this route group
export const dynamic = "force-dynamic";

const FinishLayout = async ({ children }: { children: React.ReactNode }) => {
  // Allow users with roles to access the finish page
  await checkOnboardingAccess(true);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
};

export default FinishLayout;
