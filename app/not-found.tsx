import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-6">
          <div className="text-6xl sm:text-8xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            404
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Page not found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            This page does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Go home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-gray-300 dark:border-gray-600 w-full sm:w-auto"
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
