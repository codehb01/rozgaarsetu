"use client";

import { useState, useEffect } from "react";
import { EarningsSkeleton } from "@/components/ui/dashboard-skeleton";

export default function EarningPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock earnings data
        const mockEarnings = {
          total: 25000,
          thisMonth: 8500,
          lastMonth: 6200,
          recentJobs: [
            { id: "1", title: "Bathroom Repair", amount: 2500, date: "2024-01-15", customer: "Priya Sharma" },
            { id: "2", title: "Kitchen Plumbing", amount: 1800, date: "2024-01-14", customer: "Raj Patel" },
            { id: "3", title: "Water Tank Installation", amount: 3500, date: "2024-01-13", customer: "Amit Kumar" },
            { id: "4", title: "Pipe Replacement", amount: 1200, date: "2024-01-12", customer: "Sunita Devi" },
            { id: "5", title: "Drain Cleaning", amount: 800, date: "2024-01-11", customer: "Vikash Singh" }
          ]
        };
        
        setEarnings(mockEarnings);
      } catch (error) {
        console.error("Error loading earnings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEarnings();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EarningsSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
      
      {earnings && (
        <div className="space-y-6">
          {/* Total earnings card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold text-green-600">₹{earnings.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">All time earnings</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">₹{earnings.thisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Last Month</h3>
              <p className="text-2xl font-bold text-gray-600">₹{earnings.lastMonth.toLocaleString()}</p>
            </div>
          </div>

          {/* Recent earnings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
            <div className="space-y-3">
              {earnings.recentJobs.map((job: any) => (
                <div key={job.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.customer} • {new Date(job.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-green-600">₹{job.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
