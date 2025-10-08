"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function AuthCallbackLoading() {
  useEffect(() => {
    // Prevent scroll while loading
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-8"
      >
        <div className="bg-white dark:bg-black rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Logo Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-16 w-16 rounded-2xl" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Setting up your workspace...
            </motion.p>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-indigo-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
