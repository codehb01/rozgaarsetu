"use client";

import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="border-gray-300 dark:border-gray-600 w-full sm:w-auto"
    >
      Go back
    </Button>
  );
}
