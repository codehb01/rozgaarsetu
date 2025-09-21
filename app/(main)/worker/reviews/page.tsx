"use client";

import { useState, useEffect } from "react";
import { ReviewsSkeleton } from "@/components/ui/dashboard-skeleton";

export default function WorkerReviewsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1600));
        
        // Mock reviews data
        const mockReviews = {
          average: 4.7,
          total: 45,
          distribution: { 5: 30, 4: 10, 3: 3, 2: 1, 1: 1 },
          recent: [
            {
              id: "1",
              customer: "Priya Sharma",
              rating: 5,
              comment: "Excellent work! John fixed my bathroom plumbing issue quickly and professionally. Very satisfied with the service.",
              date: "2024-01-15",
              service: "Bathroom Plumbing"
            },
            {
              id: "2", 
              customer: "Raj Patel",
              rating: 4,
              comment: "Good service, arrived on time and completed the electrical work as requested. Minor delay but overall satisfied.",
              date: "2024-01-12",
              service: "Electrical Work"
            },
            {
              id: "3",
              customer: "Amit Kumar", 
              rating: 5,
              comment: "Outstanding service! Professional, clean work and fair pricing. Highly recommend John for any plumbing needs.",
              date: "2024-01-10",
              service: "Water Tank Installation"
            },
            {
              id: "4",
              customer: "Sunita Devi",
              rating: 4,
              comment: "Quick response and quality work. Fixed the pipe leak efficiently. Will call again for future needs.",
              date: "2024-01-08",
              service: "Pipe Repair"
            },
            {
              id: "5",
              customer: "Vikash Singh",
              rating: 5,
              comment: "Fantastic job! Very knowledgeable and explained everything clearly. Clean work and reasonable rates.",
              date: "2024-01-05",
              service: "Drain Cleaning"
            }
          ]
        };
        
        setReviews(mockReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ReviewsSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h1>
      
      {reviews && (
        <div className="space-y-6">
          {/* Reviews summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Overall Rating</h2>
              <span className="text-2xl font-bold text-blue-600">{reviews.average}/5</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.floor(reviews.average) ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">Based on {reviews.total} reviews</span>
            </div>
            
            {/* Rating distribution */}
            <div className="mt-4 space-y-2">
              {Object.entries(reviews.distribution).reverse().map(([stars, count]) => (
                <div key={stars} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${((count as number) / reviews.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            {reviews.recent.map((review: any) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {review.customer.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.customer}</p>
                      <p className="text-sm text-gray-600">{review.service} • {new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
