"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { User, LayoutDashboard, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/app/api/actions/onboarding";

type UserWithRole = {
  id: string;
  role?: "CUSTOMER" | "WORKER" | "UNASSIGNED" | null;
} | null;

const ProfileButton = () => {
  const [user, setUser] = useState<UserWithRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Button
        variant="ghost"
        disabled
        className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2"
      >
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="font-medium text-gray-400">Loading...</span>
      </Button>
    );
  }

  // Handle error state - still show onboarding button as fallback
  if (error) {
    return (
      <Link href="/onboarding">
        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
        >
          <User className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Complete Profile</span>
        </Button>
      </Link>
    );
  }

  // If user doesn't have a role or has UNASSIGNED role, show Complete Profile button
  if (!user?.role || user.role === "UNASSIGNED") {
    return (
      <Link href="/onboarding">
        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
        >
          <User className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Complete Profile</span>
        </Button>
        <Button
          variant="ghost"
          className="md:hidden w-10 h-10 p-0 rounded-full hover:bg-amber-50"
          aria-label="Complete Profile"
        >
          <User className="h-5 w-5 text-amber-500" />
        </Button>
      </Link>
    );
  }

  // If user has a role, return null (no dashboard button)
  return null;
};

export default ProfileButton;
