import { checkUserRole } from "@/lib/auth-utils";

// Force dynamic rendering for this route group
export const dynamic = "force-dynamic";

export default async function CustomerLayout({ children }) {
  // Check that only customers can access customer routes
  await checkUserRole("CUSTOMER");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">{children}</div>
    </div>
  );
}
