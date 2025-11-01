import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing • RozgaarSetu",
  description:
    "Choose a plan that fits your needs. Simple, transparent pricing for customers and workers.",
};



export default function PricingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-background/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Whether you&apos;re hiring or looking for work, pick a plan that
              fits. Upgrade anytime.
            </p>
          </div>


          {/* Single Transparent Pricing Card */}
          <div className="mt-16 flex justify-center">
            <Card className="max-w-xl w-full mx-auto border-0 shadow-2xl ring-2 ring-blue-700/20 bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-950/60 dark:to-gray-900/90 p-0 overflow-hidden">
              <CardHeader className="flex flex-col items-center gap-2 bg-blue-700/90 dark:bg-blue-900/80 py-8 px-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl">💸</span>
                  <CardTitle className="text-3xl font-extrabold text-white tracking-tight text-center drop-shadow">Simple, Transparent Pricing</CardTitle>
                </div>
                <CardDescription className="text-center text-lg mt-2 text-blue-100 font-medium">
                  Only pay a <span className="font-bold text-yellow-300">10% platform fee</span> on each booking.<br />
                  <span className="text-green-200 font-semibold">No subscriptions. No hidden charges. No fees for workers.</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="py-10 px-8 flex flex-col gap-6">
                <ul className="space-y-4 text-base text-gray-800 dark:text-gray-200">
                  <li className="flex items-center gap-3">
                    <span className="inline-block size-2.5 rounded-full bg-blue-700" />
                    <span>Customers pay only when a job is completed</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-block size-2.5 rounded-full bg-blue-700" />
                    <span><span className="font-semibold text-blue-700">10% platform fee</span> is added to the job charge</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-block size-2.5 rounded-full bg-blue-700" />
                    <span>Workers receive the full remaining amount—<span className="font-semibold text-green-700">no deductions</span></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-block size-2.5 rounded-full bg-blue-700" />
                    <span>No subscriptions, no monthly fees, no pay-to-unlock features</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-block size-2.5 rounded-full bg-blue-700" />
                    <span>All features included for both customers and workers</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4 pb-8">
                <a href="mailto:support@rozgaarsetu.com" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-colors text-lg">Contact Support</a>
                <span className="text-xs text-gray-500 text-center">Questions? We’re here to help.</span>
              </CardFooter>
            </Card>
          </div>


        </div>
      </section>
    </div>
  );
}
