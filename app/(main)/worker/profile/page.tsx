"use client";

import { useState, useEffect } from "react";
import { ProfileSkeleton } from "@/components/ui/dashboard-skeleton";

export default function WorkerProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1400));
        
        // Mock profile data
        const mockProfile = {
          name: "John Kumar",
          role: "Plumber & Electrician", 
          location: "Mumbai, Maharashtra",
          experience: "5 years",
          rating: 4.8,
          completedJobs: 127,
          phone: "+91 98765 43210",
          email: "john.kumar@email.com",
          skills: ["Plumbing", "Electrical Work", "Water Tank Installation", "Pipe Repair"],
          recentJobs: [
            { id: "1", title: "Bathroom Repair", customer: "Priya Sharma", status: "Completed", date: "2024-01-15" },
            { id: "2", title: "Kitchen Plumbing", customer: "Raj Patel", status: "In Progress", date: "2024-01-14" },
            { id: "3", title: "Water Tank Installation", customer: "Amit Kumar", status: "Completed", date: "2024-01-13" }
          ]
        };
        
        setProfile(mockProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Worker Profile</h1>
      
      {profile && (
        <div className="space-y-6">
          {/* Profile header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {profile.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-lg text-gray-600">{profile.role}</p>
                <p className="text-gray-500">{profile.location}</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-900">{profile.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Jobs</p>
                  <p className="text-gray-900">{profile.completedJobs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {profile.recentJobs.map((job: any) => (
                <div key={job.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-600">{job.customer} • {new Date(job.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
