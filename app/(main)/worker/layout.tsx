import { ReactNode } from "react";
import { checkUserRole } from "@/lib/auth-utils";

// Force dynamic rendering for this route group
export const dynamic = "force-dynamic";

export default async function WorkerLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Ensure only workers can access worker routes
  await checkUserRole("WORKER");

  return <div className="min-h-screen bg-gray-900">{children}</div>;
}
