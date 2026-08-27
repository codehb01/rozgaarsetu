"use client"

import { ReactNode, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { WorkerSidebar } from "@/components/worker/sidebar-nav";

// Force dynamic rendering for this route group
export const dynamic = "force-dynamic";

export default function WorkerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { user, isLoaded } = useUser();

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated (this will be handled by Clerk middleware)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Please sign in to access worker dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar for desktop */}
      <div className="hidden lg:block">
        <WorkerSidebar
          open={desktopSidebarOpen}
          setOpen={setDesktopSidebarOpen}
        />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50">
            <WorkerSidebar onMobileClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md bg-card shadow-lg border border-border"
        >
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main content with conditional margin based on sidebar state */}
      <main className={`min-h-screen bg-background transition-all duration-300 ${
        desktopSidebarOpen ? "lg:ml-64" : "lg:ml-16"
      }`}>
        <div className="px-4 py-6 sm:px-6 lg:px-8 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
