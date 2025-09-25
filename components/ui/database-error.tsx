'use client';

import { AlertCircle, Database } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DatabaseErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function DatabaseError({ error = "Database connection failed", onRetry }: DatabaseErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Database className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Database Connection Issue
        </h1>
        
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-gray-600 dark:text-gray-400">
            {error}
          </p>
        </div>
        
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <p>This might be due to:</p>
          <ul className="text-left space-y-1">
            <li>• Database server temporarily down</li>
            <li>• Network connectivity issues</li>
            <li>• Database maintenance in progress</li>
          </ul>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
        
        <div className="mt-4 text-xs text-gray-400">
          If the issue persists, please contact support
        </div>
      </Card>
    </div>
  );
}