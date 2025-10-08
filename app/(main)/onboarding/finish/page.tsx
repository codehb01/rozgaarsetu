"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, User, Briefcase } from "lucide-react";
import { getCurrentUser } from "@/app/api/actions/onboarding";
import { TranslatedText } from "@/hooks/use-batch-translation";

export default function FinishPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<"CUSTOMER" | "WORKER" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const user = await getCurrentUser();
        if (user?.role) {
          setUserRole(user.role as "CUSTOMER" | "WORKER");
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-gray-400">
            <TranslatedText context="onboarding">Loading...</TranslatedText>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            <TranslatedText context="onboarding">Welcome to RozgaarSetu! 🎉</TranslatedText>
          </h1>

          <p className="text-xl text-gray-300 mb-2">
            <TranslatedText context="onboarding">Your profile has been created successfully</TranslatedText>
          </p>

          <p className="text-gray-400">
            {userRole === "WORKER"
              ? <TranslatedText context="onboarding">You're now ready to receive job requests from customers</TranslatedText>
              : <TranslatedText context="onboarding">You can now start browsing and booking services from skilled workers</TranslatedText>}
          </p>
        </div>

        <Card className="border-emerald-900/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center">
                {userRole === "WORKER" ? (
                  <Briefcase className="h-8 w-8 text-emerald-400" />
                ) : (
                  <User className="h-8 w-8 text-emerald-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {userRole === "WORKER"
                    ? <TranslatedText context="onboarding">Worker Profile</TranslatedText>
                    : <TranslatedText context="onboarding">Customer Profile</TranslatedText>}
                </h3>
                <p className="text-gray-400">
                  <TranslatedText context="onboarding">Profile setup completed</TranslatedText>
                </p>
              </div>
              <div className="ml-auto">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {userRole === "WORKER" ? (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Skills & Experience</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Added</TranslatedText></span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Pricing Information</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Set</TranslatedText></span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Service Areas</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Configured</TranslatedText></span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Profile Visibility</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Public</TranslatedText></span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Address Information</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Added</TranslatedText></span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Account Settings</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Configured</TranslatedText></span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">
                      <TranslatedText context="onboarding">Ready to Book</TranslatedText>
                    </span>
                    <span className="text-emerald-400">✓ <TranslatedText context="onboarding">Yes</TranslatedText></span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-400 mb-2">
                <TranslatedText context="onboarding">What's Next?</TranslatedText>
              </h4>
              <p className="text-gray-300 text-sm">
                {userRole === "WORKER"
                  ? <TranslatedText context="onboarding">Complete your profile by adding a professional photo and start receiving job requests. You can update your pricing and availability anytime from your dashboard.</TranslatedText>
                  : <TranslatedText context="onboarding">Browse our skilled professionals by category or search for specific services. You can book services, track job progress, and leave reviews for completed work.</TranslatedText>}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={handleGoToDashboard}
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 px-8"
          >
            <TranslatedText context="onboarding">Go to Dashboard</TranslatedText>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            <TranslatedText context="onboarding">Need help getting started?</TranslatedText>{" "}
            <span className="text-emerald-400 cursor-pointer hover:underline">
              <TranslatedText context="onboarding">Check out our guide</TranslatedText>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
