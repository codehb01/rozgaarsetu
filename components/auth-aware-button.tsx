"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/app/api/actions/onboarding";

interface AuthAwareButtonProps {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

const AuthAwareButton = ({
  children,
  size,
  className,
  variant,
}: AuthAwareButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);

      // Check current user status
      const user = await getCurrentUser();

      if (!user) {
        // Not authenticated - redirect to sign up
        router.push("/sign-up");
        return;
      }

      // User is authenticated
      if (!user.role || user.role === "UNASSIGNED") {
        // Needs to complete onboarding
        router.push("/onboarding");
      } else {
        // Has role - redirect to dashboard
        const dashboardPath =
          user.role === "WORKER" ? "/worker/dashboard" : "/customer/dashboard";
        router.push(dashboardPath);
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      // Default to sign up on error
      router.push("/sign-up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
};

export default AuthAwareButton;
