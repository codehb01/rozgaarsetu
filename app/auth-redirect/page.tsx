"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";

export default function AuthRedirect() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scroll while loading
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function handleRedirect() {
      if (!isLoaded) return;

      console.log("🔄 Auth redirect - User loaded:", isLoaded, "User:", user?.id);

      if (!user) {
        console.log("❌ No user, redirecting to sign-in");
        router.push("/sign-in");
        return;
      }

      try {
        console.log("📡 Fetching user profile...");
        // Call the API to check user role and get redirect URL
        const response = await fetch("/api/user/check-profile");
        const data = await response.json();

        console.log("📨 API response:", data);

        // Set progress to 100 before redirecting
        setProgress(100);

        // Small delay to show 100% completion
        setTimeout(() => {
          if (data.redirectUrl) {
            console.log("✅ Redirecting to:", data.redirectUrl);
            router.push(data.redirectUrl);
          } else {
            console.log("⚠️ No redirect URL, going to home");
            router.push("/");
          }
        }, 300);
      } catch (error) {
        console.error("❌ Error during redirect:", error);
        router.push("/");
      }
    }

    handleRedirect();
  }, [user, isLoaded, router]);

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-950">
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={progress}
        gaugePrimaryColor="rgb(37 99 235)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        className="size-48"
      />
    </div>
  );
}
