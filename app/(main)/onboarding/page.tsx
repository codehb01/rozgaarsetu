"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Wrench, CheckCircle, ArrowRight, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const customerFeatures = [
  "Instant booking with verified workers",
  "Real-time job progress tracking",
  "Secure payment processing",
  "24/7 customer support",
  "Quality guarantee on all services",
];

const workerFeatures = [
  "Access to verified job opportunities",
  "Flexible work schedule",
  "Fair and transparent pricing",
  "Build your professional reputation",
  "Secure and timely payments",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="space-y-12 pb-12 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-semibold text-foreground tracking-tight">Welcome to RozgaarSetu</h1>
        <p className="text-base text-muted-foreground font-normal max-w-2xl mx-auto">Choose how you&apos;d like to get started</p>
      </motion.div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Customer Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onHoverStart={() => setHoveredCard("customer")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20">
            <CardContent className="p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-950/20 rounded-xl">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Join as a Customer</h2>
                <p className="text-sm text-muted-foreground font-normal">Find and hire skilled professionals</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {customerFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Button
                onClick={() => router.push("/onboarding/customer-details")}
                className="w-full"
              >
                Get Started as Customer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Worker Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onHoverStart={() => setHoveredCard("worker")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20">
            <CardContent className="p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-purple-100 dark:bg-purple-950/20 rounded-xl">
                  <Wrench className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Join as a Worker</h2>
                <p className="text-sm text-muted-foreground font-normal">Offer your services and grow</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {workerFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Button
                onClick={() => router.push("/onboarding/worker-details")}
                className="w-full"
              >
                Get Started as Worker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Secure platform</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Verified profiles</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Protected payments</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
