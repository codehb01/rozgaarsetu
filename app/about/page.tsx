"use client";

// Centralized About page data for maintainability and to avoid static literals in JSX
const ABOUT_DATA = {
  mission: 'Bridge the gap between skilled workers and customers, create economic opportunities, and build trust through technology.',
  features: [
    'Location-based search',
    'Real-time booking',
    'Verified profiles',
    'Secure payments',
    'Transparent fees',
    'Mobile-first',
    'Usage tracking',
  ],
  objectives: [
    'Connect skilled blue-collar workers with customers efficiently',
    'Ensure transparent pricing with a platform fee model',
    'Empower workers with digital profiles and unlimited job access',
    'Build trust via reviews and ratings',
    'Make the platform accessible across devices',
    'Boost worker income and provide customer savings',
  ],
  stats: {
    bookings: undefined,
    workers: undefined,
    rating: undefined,
  },
  socialProof: [
    'Trusted by both customers and professionals',
    'Continuous improvement and user-focused innovation',
  ],
  contact: {
    email: 'support@rozgaarsetu.com',
    text: 'Have questions or want to join as a worker? Contact us — we’re here to help!'
  },
  description: `India’s modern platform for connecting skilled blue-collar workers—plumbers, painters, electricians, and more—with customers who need reliable services. Empowering workers, ensuring fair pricing, and making hiring seamless and trustworthy.`
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/CountUp";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function AboutPage() {
  return (
    <AuroraBackground className="min-h-screen flex flex-col items-center justify-center py-0">
      <section className="w-full max-w-4xl mx-auto py-20 flex flex-col items-center text-center px-4 gap-12">
        <div className="flex flex-col gap-2 items-center">
          <TypewriterEffect
            words={[
              { text: "About", className: "text-blue-700 dark:text-blue-300 font-extrabold text-5xl md:text-6xl tracking-tight" },
              { text: "RozgaarSetu", className: "text-blue-900 dark:text-blue-100 font-extrabold text-5xl md:text-6xl tracking-tight" },
            ]}
          />
          <span className="block h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mt-2 mb-2 opacity-70" />
        </div>
        <div className="max-w-2xl mx-auto text-balance text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-medium leading-relaxed mb-2">
          {ABOUT_DATA.description.split('Empowering workers,').map((part, idx, arr) => idx < arr.length - 1 ? (<>{part}<span key="empowering" className="text-blue-700 dark:text-blue-300 font-semibold">Empowering workers,</span></>) : part)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-2xl border-0 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px]">
            <CardHeader className="mb-0 flex flex-col items-center justify-center w-full">
              <CardTitle className="text-blue-800 dark:text-blue-200 text-xl font-bold tracking-tight text-center leading-tight mb-2">Our<br/>Mission</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center w-full">
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed text-center max-w-md">
                {ABOUT_DATA.mission}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 dark:bg-gray-900/90 shadow-2xl border-0 rounded-2xl p-6 flex flex-col items-center">
            <CardHeader className="mb-2">
              <CardTitle className="text-blue-800 dark:text-blue-200 text-lg font-semibold tracking-wide">What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {ABOUT_DATA.features.map((feature) => (
                  <Badge key={feature} className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">{feature}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl p-8 w-full">
          <CardHeader className="mb-2">
            <CardTitle className="text-blue-800 dark:text-blue-200 text-lg font-semibold tracking-wide">Core Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 text-base list-disc pl-6 max-w-2xl mx-auto">
              {ABOUT_DATA.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <Card className="bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px]">
            <CardHeader className="mb-0 flex flex-col items-center justify-center w-full">
              <CardTitle className="text-blue-800 dark:text-blue-200 text-xl font-bold tracking-tight text-center leading-tight mb-2">Why<br/>Choose<br/>Us?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center w-full">
              <ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 text-base list-disc pl-6 max-w-md mx-auto">
                {ABOUT_DATA.socialProof.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[260px]">
            <CardHeader className="mb-0 flex flex-col items-center justify-center w-full">
              <CardTitle className="text-blue-800 dark:text-blue-200 text-xl font-bold tracking-tight text-center leading-tight mb-2 flex flex-col items-center gap-1">
                <span>Contact</span>
                <span>&amp;</span>
                <span>Support</span>
                <span className="mt-2 text-3xl">💬</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center w-full">
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed text-center max-w-md mb-4">
                Have questions or need help? Our team is here for you.<br />
                <a href="/customer/help" className="text-blue-700 underline font-semibold">Help Center</a> &nbsp;|&nbsp; <a href="/worker/support" className="text-blue-700 underline font-semibold">Worker Support</a>
              </p>
              <a href={`mailto:${ABOUT_DATA.contact.email}`} className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors">Email Us</a>
            </CardContent>
          </Card>
        </div>
        <Link href="/">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white mt-8 px-8 py-3 rounded-full text-lg font-semibold shadow-lg" aria-label="Back to Home">Back to Home</Button>
        </Link>
      </section>
    </AuroraBackground>
  );
}
