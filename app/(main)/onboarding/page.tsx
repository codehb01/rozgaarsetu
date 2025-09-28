"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Wrench } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer card */}
      <Card
        className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        onClick={() => router.push("/onboarding/customer-details")}
      >
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
          <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
            <User className="h-8 w-8 text-emerald-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-white mb-2">
            Join as a Customer
          </CardTitle>
          <CardDescription className="mb-4">
            Book workers, manage your service requests and track jobs.
          </CardDescription>
          <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
            Continue as Customer
          </Button>
        </CardContent>
      </Card>

      {/* Worker card */}
      <Card
        className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        onClick={() => router.push("/onboarding/worker-details")}
      >
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
          <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
            <Wrench className="h-8 w-8 text-emerald-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-white mb-2">
            Join as a Worker
          </CardTitle>
          <CardDescription className="mb-4">
            Create your profile, list your skills, and get hired for jobs.
          </CardDescription>
          <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
            Continue as Worker
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
