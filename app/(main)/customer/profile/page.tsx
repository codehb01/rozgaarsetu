"use client";

import { useState, useEffect } from "react";
import { ProfileSkeleton } from "@/components/ui/dashboard-skeleton";

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1300));
        
        // Mock profile data
        const mockProfile = {
          name: "Priya Sharma",
          location: "Delhi, India",
          memberSince: "January 2023",
          phone: "+91 99887 76543",
          email: "priya.sharma@email.com",
          totalBookings: 15,
          completedBookings: 12,
          recentBookings: [
            { id: "1", service: "Plumbing", worker: "John Kumar", status: "Completed", date: "2024-01-15", rating: 5 },
            { id: "2", service: "Electrical Work", worker: "Rajesh Singh", status: "Completed", date: "2024-01-10", rating: 4 },
            { id: "3", service: "AC Repair", worker: "Amit Patel", status: "In Progress", date: "2024-01-08" }
          ],
          preferences: ["Plumbing", "Electrical Work", "AC Repair"]
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Profile</h1>
      
      {profile && (
        <div className="space-y-6">
          {/* Profile header */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {profile.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-lg text-gray-600">Customer</p>
                <p className="text-gray-500">{profile.location}</p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
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
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900">{profile.memberSince}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-gray-900">{profile.totalBookings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {profile.preferences.map((pref: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent bookings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {profile.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.service}</p>
                    <p className="text-sm text-gray-600">Worker: {booking.worker} • {new Date(booking.date).toLocaleDateString()}</p>
                    {booking.rating && (
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">{'★'.repeat(booking.rating)}</span>
                        <span className="text-gray-300">{'★'.repeat(5 - booking.rating)}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
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