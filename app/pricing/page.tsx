import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Wrench, CheckCircle, Lock, Zap, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing • RozgaarSetu",
  description: "Simple platform fee model. Pay only when you complete work.",
};

export default function PricingPage() {
  return (
    <div className="relative bg-slate-900">
      <div className="bg-white dark:bg-black text-foreground pb-20 rounded-b-[3rem] relative z-10">
        {/* Hero Section */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center space-y-4 mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground font-normal max-w-2xl mx-auto">
              No subscriptions. No hidden fees. Pay only when work is completed.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {/* For Customers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">For Customers</h2>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">5%</span>
                  <span className="text-muted-foreground">per job</span>
                </div>
                <p className="text-sm text-muted-foreground">Platform fee on completed jobs</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited job postings",
                  "Browse all worker profiles",
                  "Direct messaging with workers",
                  "24/7 customer support",
                  "Secure payment processing",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>

            {/* For Workers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Wrench className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">For Workers</h2>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-orange-600 dark:text-orange-400">10%</span>
                  <span className="text-muted-foreground">per job</span>
                </div>
                <p className="text-sm text-muted-foreground">Platform fee on completed jobs</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited job leads",
                  "Professional profile showcase",
                  "Direct communication with customers",
                  "Fast & secure payments",
                  "24/7 support & dispute resolution",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-20 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-foreground mb-8 text-center">Example Calculation</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="font-semibold text-foreground">Customer pays:</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Job cost:</span>
                    <span className="font-medium text-foreground">₹1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee (5%):</span>
                    <span className="font-medium text-foreground">₹50</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">₹1,050</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <p className="font-semibold text-foreground">Worker receives:</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Job cost:</span>
                    <span className="font-medium text-foreground">₹1,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform fee (10%):</span>
                    <span className="font-medium text-foreground">-₹100</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold">
                    <span>Earnings:</span>
                    <span className="text-green-600 dark:text-green-400">₹900</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mb-20">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight mb-12 text-center">
              Why RozgaarSetu?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CreditCard, label: "No subscriptions", desc: "No monthly fees or commitments", color: "blue" },
                { icon: Zap, label: "Pay per use", desc: "Only charged on completed work", color: "green" },
                { icon: Lock, label: "Secure payments", desc: "Safe and encrypted transactions", color: "purple" },
                { icon: CheckCircle, label: "Instant access", desc: "Start using all features immediately", color: "amber" },
              ].map((benefit, i) => {
                const Icon = benefit.icon;
                const colorClass = `${benefit.color}-600 dark:${benefit.color}-400`;
                const bgClass = `bg-${benefit.color}-100 dark:bg-${benefit.color}-900/30`;
                return (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-shadow duration-200">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 ${bgClass} rounded-lg`}>
                        <Icon className={`h-6 w-6 text-${colorClass}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.label}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
              <h3 className="text-3xl font-semibold text-foreground mb-3">Ready to get started?</h3>
              <p className="text-lg text-muted-foreground mb-8">Join thousands of customers and workers on RozgaarSetu</p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Have questions?{" "}
              <a
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
                href="mailto:support@rozgaarsetu.com"
              >
                Contact support@rozgaarsetu.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
