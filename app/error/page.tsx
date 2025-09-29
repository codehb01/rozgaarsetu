"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-6 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="animate-fade-in-up">
          <h1 className="text-8xl md:text-9xl font-light text-white tracking-tight leading-none">
            4<span className="text-blue-400 animate-pulse">0</span>4
          </h1>
        </div>

        {/* Main message */}
        <div className="animate-fade-in-up delay-300">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
            <br className="hidden md:block" />
            <span className="text-blue-400 font-medium">
              Let&apos;s get you back on track.
            </span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="animate-fade-in-up delay-500">
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-10 py-4 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 rounded-full border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 text-lg font-medium transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Subtle help text */}
        <div className="animate-fade-in-up delay-700">
          <p className="text-sm text-gray-500 mt-12">
            If you believe this is an error, please{" "}
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
