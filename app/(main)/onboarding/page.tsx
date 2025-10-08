"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Wrench,
  CheckCircle,
  ArrowRight,
  Users,
  Star,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

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

const stats = [
  { icon: Users, label: "Active Users", value: "10,000+" },
  { icon: CheckCircle, label: "Jobs Completed", value: "50,000+" },
  { icon: Star, label: "Average Rating", value: "4.8/5" },
];

const typewriterWords = [
  { text: "Choose" },
  { text: "how" },
  { text: "you'd" },
  { text: "like" },
  { text: "to" },
  { text: "get", className: "text-blue-500 dark:text-blue-400" },
  { text: "started", className: "text-blue-500 dark:text-blue-400" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section with Text Effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-400/20 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Welcome to your journey
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
          <ShimmerText
            text="Welcome to RozgaarSetu"
            className="text-gray-900 dark:text-white"
          />
        </h1>

        <div className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          <TypewriterEffect
            words={typewriterWords}
            className="justify-center"
          />
        </div>
      </motion.div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Customer Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onHoverStart={() => setHoveredCard("customer")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card
            className="h-full border-2 border-blue-200/60 dark:border-blue-400/30 bg-blue-50/80 dark:bg-blue-950/30 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-blue-500/20 hover:border-blue-300 dark:hover:border-blue-400/60 group backdrop-blur-sm hover:scale-[1.02]"
            onClick={() => router.push("/onboarding/customer-details")}
          >
            <CardContent className="p-8 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-blue-200/50 dark:border-blue-400/20 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
                    <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2 tracking-tight">
                      Join as a Customer
                    </CardTitle>
                    <CardDescription className="text-base text-blue-600/80 dark:text-blue-400/70 font-medium">
                      Find and hire skilled professionals
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight
                  className={`h-6 w-6 text-blue-400/60 dark:text-blue-400/50 transition-all duration-300 flex-shrink-0 mt-1 ${
                    hoveredCard === "customer"
                      ? "translate-x-2 text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                />
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {customerFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 group/item"
                  >
                    <div className="mt-0.5">
                      <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm leading-relaxed text-blue-900/90 dark:text-blue-100/90 font-medium">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all duration-300 group-hover:scale-[1.02] shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 h-12 text-base font-semibold rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/onboarding/customer-details");
                }}
              >
                Get Started as Customer
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Worker Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onHoverStart={() => setHoveredCard("worker")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card
            className="h-full border-2 border-purple-200/60 dark:border-purple-400/30 bg-purple-50/80 dark:bg-purple-950/30 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-purple-200/40 dark:hover:shadow-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400/60 group backdrop-blur-sm hover:scale-[1.02]"
            onClick={() => router.push("/onboarding/worker-details")}
          >
            <CardContent className="p-8 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-purple-200/50 dark:border-purple-400/20 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
                    <Wrench className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-2 tracking-tight">
                      Join as a Worker
                    </CardTitle>
                    <CardDescription className="text-base text-purple-600/80 dark:text-purple-400/70 font-medium">
                      Offer your services
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight
                  className={`h-6 w-6 text-purple-400/60 dark:text-purple-400/50 transition-all duration-300 flex-shrink-0 mt-1 ${
                    hoveredCard === "worker"
                      ? "translate-x-2 text-purple-600 dark:text-purple-400"
                      : ""
                  }`}
                />
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {workerFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-start space-x-3 group/item"
                  >
                    <div className="mt-0.5">
                      <CheckCircle className="h-5 w-5 text-purple-500 dark:text-purple-400 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm leading-relaxed text-purple-900/90 dark:text-purple-100/90 font-medium">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-all duration-300 group-hover:scale-[1.02] shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 h-12 text-base font-semibold rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/onboarding/worker-details");
                }}
              >
                Get Started as Worker
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto">
        <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
      </div>

      {/* Stats Section - Redesigned with Apple-style cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <Card className="text-center border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Indicators - Redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span className="font-medium">Secure platform</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            <span className="font-medium">Verified profiles</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span className="font-medium">Protected payments</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
