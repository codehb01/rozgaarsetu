"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Send to error tracking service
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Sorry, but something unexpected occurred. Our team has been notified.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                Error details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={() => reset()} className="bg-blue-600 hover:bg-blue-700">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="border-gray-300 dark:border-gray-600"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
