"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Clock, Phone } from "lucide-react";

interface Worker {
  id: string;
  name: string;
  role: string;
  workerProfile: {
    skilledIn: string[];
    city: string;
    state: string;
    availableAreas: string[];
    yearsExperience: number;
    qualification: string;
    profilePic: string;
    bio: string;
  };
  distance?: number;
  distanceText?: string;
  relevanceScore?: number;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = searchParams.get("service");
  const location = searchParams.get("location");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(() => {
    if (service) {
      fetchWorkers();
    }
  }, [service, location, lat, lng]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (service) params.append("category", service);
      if (lat && lng) {
        params.append("lat", lat);
        params.append("lng", lng);
      }
      params.append("limit", "20");
      params.append("sortBy", "relevance");

      const response = await fetch(`/api/workers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch workers");
      
      const data = await response.json();
      setWorkers(data.workers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {service && `${service.charAt(0).toUpperCase() + service.slice(1)} services`}
          {location && ` in ${location}`}
          {workers.length > 0 && ` • ${workers.length} results found`}
        </p>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No workers found</h3>
            <p>Try adjusting your search criteria or location.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-shadow p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {worker.workerProfile?.profilePic ? (
                    <img
                      src={worker.workerProfile.profilePic}
                      alt={worker.name || "Worker"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                        {(worker.name || "W").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {worker.name || "Worker"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {worker.workerProfile?.qualification || "Professional"}
                    </p>
                  </div>
                </div>
                {worker.distanceText && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    {worker.distanceText}
                  </span>
                )}
              </div>
              
              {/* Skills */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {worker.workerProfile?.skilledIn?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                  {worker.workerProfile?.skilledIn?.length > 3 && (
                    <span className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
                      +{worker.workerProfile.skilledIn.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{worker.workerProfile?.city}, {worker.workerProfile?.state}</span>
              </div>

              {/* Experience */}
              {worker.workerProfile?.yearsExperience && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{worker.workerProfile.yearsExperience} years experience</span>
                </div>
              )}

              {/* Bio */}
              {worker.workerProfile?.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {worker.workerProfile.bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}