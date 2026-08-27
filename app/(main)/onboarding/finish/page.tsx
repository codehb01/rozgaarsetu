"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  User,
  Briefcase,
  Sparkles,
  Star,
} from "lucide-react";
import { getCurrentUser } from "@/app/api/actions/onboarding";
import { motion } from "framer-motion";
import {
  triggerConfettiCelebration,
  testConfetti,
  simpleBurst,
  checkConfetti,
  basicConfettiEffect,
} from "@/components/ui/confetti";
import ClickSpark from "@/components/ClickSpark";

export default function FinishPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"CUSTOMER" | "WORKER" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        console.log("🔍 Checking user role...");

        // Check confetti availability first
        checkConfetti();

        const user = await getCurrentUser();
        console.log("👤 User data:", user);
        if (user?.role) {
          setUserRole(user.role as "CUSTOMER" | "WORKER");
          console.log("✅ User role set:", user.role);

          // Test immediate confetti first
          console.log("🎯 Testing immediate confetti...");
          simpleBurst();

          // Test basic confetti effect as backup
          setTimeout(() => {
            console.log("🎈 Testing basic confetti effect...");
            basicConfettiEffect();
          }, 1000);

          // Then trigger delayed celebration
          setTimeout(() => {
            console.log("⏰ Triggering main confetti celebration...");
            triggerConfettiCelebration();
          }, 3000); // Increased delay to 3 seconds for visibility
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const handleGoToDashboard = () => {
    if (userRole === "WORKER") {
      router.push("/worker/dashboard");
    } else if (userRole === "CUSTOMER") {
      router.push("/customer/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="relative mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: "spring",
                  bounce: 0.6,
                }}
                className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30"
              >
                <CheckCircle className="h-12 w-12 md:h-14 md:w-14 text-white" />
              </motion.div>

              {/* Sparkles around success icon */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + (i % 2) * 80}%`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            >
              Welcome to RozgaarSetu! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg md:text-xl text-green-600 dark:text-green-400 font-semibold mb-2"
            >
              Profile Created Successfully!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
            >
              {userRole === "WORKER"
                ? "You're now ready to receive job requests from customers and start earning!"
                : "You can now start browsing and booking services from skilled workers in your area."}
            </motion.p>
          </motion.div>

          {/* Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="border border-border bg-card backdrop-blur-sm shadow-xl mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 md:gap-6 mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10 rounded-2xl flex items-center justify-center border-2 border-green-200 dark:border-green-800"
                  >
                    {userRole === "WORKER" ? (
                      <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-green-600 dark:text-green-400" />
                    ) : (
                      <User className="h-8 w-8 md:h-10 md:w-10 text-green-600 dark:text-green-400" />
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {userRole === "WORKER"
                        ? "Worker Profile"
                        : "Customer Profile"}
                    </h3>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      Profile setup completed ✓
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4 mb-6">
                  {userRole === "WORKER" ? (
                    <>
                      {[
                        "Skills & Experience",
                        "Pricing Information",
                        "Service Areas",
                        "Profile Visibility",
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 1.3 + index * 0.1,
                            duration: 0.3,
                          }}
                          className="flex items-center justify-between py-3 border-b border-border"
                        >
                          <span className="text-muted-foreground">
                            {item}
                          </span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Completed
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        "Address Information",
                        "Account Settings",
                        "Ready to Book",
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 1.3 + index * 0.1,
                            duration: 0.3,
                          }}
                          className="flex items-center justify-between py-3 border-b border-border"
                        >
                          <span className="text-muted-foreground">
                            {item}
                          </span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Completed
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                  className="bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-400/20 rounded-xl p-5 md:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
                        What&apos;s Next?
                      </h4>
                      <p className="text-sm md:text-base text-green-700 dark:text-green-300 leading-relaxed">
                        {userRole === "WORKER"
                          ? "Complete your profile by adding a professional photo and start receiving job requests. You can update your pricing and availability anytime from your dashboard."
                          : "Browse our skilled professionals by category or search for specific services. You can book services, track job progress, and leave reviews for completed work."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="text-center space-y-6"
          >
            <ClickSpark sparkColor="#10b981" sparkCount={15} sparkRadius={30}>
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold shadow-xl shadow-green-500/30 dark:shadow-green-500/20 transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </ClickSpark>

            <p className="text-sm text-muted-foreground">
              Need help getting started?{" "}
              <span className="text-green-600 dark:text-green-400 cursor-pointer hover:underline font-medium">
                Check out our guide
              </span>
            </p>

            {/* Debug Buttons - Remove in production */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                onClick={() => {
                  console.log("🔥 Manual confetti test clicked");
                  testConfetti();
                }}
                variant="outline"
                size="sm"
              >
                Test Confetti 🎉
              </Button>
              <Button
                onClick={() => {
                  console.log("💥 Simple burst test clicked");
                  simpleBurst();
                }}
                variant="outline"
                size="sm"
              >
                Simple Burst 💥
              </Button>
              <Button
                onClick={() => {
                  console.log("🔍 Check confetti clicked");
                  checkConfetti();
                }}
                variant="outline"
                size="sm"
              >
                Check Library 🔍
              </Button>
              <Button
                onClick={() => {
                  console.log("🎈 Basic confetti test clicked");
                  basicConfettiEffect();
                }}
                variant="outline"
                size="sm"
              >
                Basic Effect 🎈
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
