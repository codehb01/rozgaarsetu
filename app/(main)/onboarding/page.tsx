"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Wrench, CheckCircle, ArrowRight, Users, Star, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { TranslatedText } from "@/components/translation/auto-translate";

const customerFeatures = [
  "Instant booking with verified workers",
  "Real-time job progress tracking",
  "Secure payment processing",
  "24/7 customer support",
  "Quality guarantee on all services"
];

const workerFeatures = [
  "Access to verified job opportunities",
  "Flexible work schedule",
  "Fair and transparent pricing",
  "Build your professional reputation",
  "Secure and timely payments"
];

const stats = [
  { icon: Users, label: "Active Users", value: "10,000+" },
  { icon: CheckCircle, label: "Jobs Completed", value: "50,000+" },
  { icon: Star, label: "Average Rating", value: "4.8/5" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <stat.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <TranslatedText context="onboarding">{stat.label}</TranslatedText>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onHoverStart={() => setHoveredCard('customer')}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card
            className="h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 group"
            onClick={() => router.push("/onboarding/customer-details")}
          >
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300">
                    <User className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      <TranslatedText context="onboarding">Join as a Customer</TranslatedText>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      <TranslatedText context="onboarding">Find and hire skilled professionals</TranslatedText>
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 text-gray-400 transition-all duration-300 ${
                  hoveredCard === 'customer' ? 'translate-x-1 text-gray-600 dark:text-gray-300' : ''
                }`} />
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {customerFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <TranslatedText context="onboarding">{feature}</TranslatedText>
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-300 group-hover:scale-[1.02]"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/onboarding/customer-details");
                }}
              >
                <TranslatedText context="onboarding">Get Started as Customer</TranslatedText>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Worker Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onHoverStart={() => setHoveredCard('worker')}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card
            className="h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 group"
            onClick={() => router.push("/onboarding/worker-details")}
          >
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300">
                    <Wrench className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      <TranslatedText context="onboarding">Join as a Worker</TranslatedText>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      <TranslatedText context="onboarding">Offer your services and grow your business</TranslatedText>
                    </CardDescription>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 text-gray-400 transition-all duration-300 ${
                  hoveredCard === 'worker' ? 'translate-x-1 text-gray-600 dark:text-gray-300' : ''
                }`} />
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {workerFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <TranslatedText context="onboarding">{feature}</TranslatedText>
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-300 group-hover:scale-[1.02]"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/onboarding/worker-details");
                }}
              >
                <TranslatedText context="onboarding">Get Started as Worker</TranslatedText>
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
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span><TranslatedText context="onboarding">Secure platform</TranslatedText></span>
          <span>•</span>
          <span><TranslatedText context="onboarding">Verified profiles</TranslatedText></span>
          <span>•</span>
          <span><TranslatedText context="onboarding">Protected payments</TranslatedText></span>
        </div>
      </motion.div>
    </div>
  );
}
