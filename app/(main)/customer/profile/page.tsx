"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiStar,
  FiNavigation,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
} from "react-icons/fi";
import { getCurrentUser } from "@/app/api/actions/onboarding";
import ClickSpark from "@/components/ClickSpark";

type CustomerProfile = {
  id: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  customerProfile: CustomerProfile | null;
};

export default function CustomerProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<CustomerProfile>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">("overview");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleGetCurrentLocation = async () => {
    setFetchingLocation(true);
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const response = await fetch(
        `/api/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error("Failed to get address from coordinates");
      }

      const data = await response.json();
      const result = data.result;

      if (!result) {
        throw new Error("No address found for this location");
      }

      // Update address fields from the geocoded result
      setEditedProfile({
        ...editedProfile,
        address: result.address?.line1 || result.displayName || "",
        city: result.address?.city || "",
        state: result.address?.state || "",
        postalCode: result.address?.postalCode || "",
        country: result.address?.country || "India",
      });
    } catch (error) {
      console.error("Error getting location:", error);
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enable location access in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
        }
      } else {
        alert("Failed to get current location. Please try again.");
      }
    } finally {
      setFetchingLocation(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }
      setData(user);
      if (user.customerProfile) {
        setEditedProfile(user.customerProfile);
      }
    } catch (e) {
      console.error("Error loading profile:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: editedProfile.address,
          city: editedProfile.city,
          state: editedProfile.state,
          postalCode: editedProfile.postalCode,
          country: editedProfile.country,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save profile");
      }

      const result = await response.json();
      
      // Update the profile data with the saved data
      if (data) {
        setData({
          ...data,
          customerProfile: result.profile,
        });
      }

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (data?.customerProfile) {
      setEditedProfile(data.customerProfile);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.customerProfile) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please complete your onboarding to view your profile.
            </p>
            <Button onClick={() => router.push("/onboarding")} className="bg-blue-600 hover:bg-blue-700 mt-4">
              Complete Onboarding
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const profile = data.customerProfile;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FiEdit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <ClickSpark sparkColor="#22c55e" sparkCount={10} sparkRadius={20}>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </ClickSpark>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center border-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-900">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={data.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Show initials avatar on error
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.initials-avatar')) {
                            const initialsDiv = document.createElement('div');
                            initialsDiv.className = 'initials-avatar text-blue-500 dark:text-blue-400 text-4xl font-bold flex items-center justify-center w-full h-full';
                            initialsDiv.textContent = data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                            parent.appendChild(initialsDiv);
                          }
                        }}
                      />
                    ) : (
                      <div className="text-blue-500 dark:text-blue-400 text-4xl font-bold">
                        {data.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {data.name}
                </h2>

                {/* Role Badge */}
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
                  Customer
                </Badge>

                {/* Contact Info */}
                <div className="space-y-3 mt-6 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FiMail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {data.email}
                    </span>
                  </div>

                  {data.phone && !data.phone.startsWith('no-phone-') && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <FiPhone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {data.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {profile.city}, {profile.state}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <ClickSpark sparkColor="#60a5fa" sparkCount={10} sparkRadius={20}>
                    <Button 
                      onClick={() => router.push("/customer/search")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <FiBriefcase className="mr-2 h-4 w-4" />
                      Find Workers
                    </Button>
                  </ClickSpark>
                  <Button 
                    onClick={() => router.push("/customer/bookings")}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600"
                  >
                    <FiCalendar className="mr-2 h-4 w-4" />
                    View Bookings
                  </Button>
                </div>
              </motion.div>
            </Card>
          </div>

          {/* Right Content - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex">
              {(["overview", "bookings"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Account Information */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account Information
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {data.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {data.email}
                          </p>
                        </div>
                      </div>
                      {data.phone && !data.phone.startsWith('no-phone-') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {data.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Address */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Address
                        </h3>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={handleGetCurrentLocation}
                          disabled={fetchingLocation}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <FiNavigation className={`h-4 w-4 ${fetchingLocation ? 'animate-spin' : ''}`} />
                          {fetchingLocation ? "Getting location..." : "Use Current Location"}
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Street Address
                          </label>
                          <Textarea
                            value={editedProfile.address || ""}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter street address"
                            className="bg-gray-50 dark:bg-black"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              City
                            </label>
                            <Input
                              value={editedProfile.city || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  city: e.target.value,
                                })
                              }
                              placeholder="City"
                              className="bg-gray-50 dark:bg-black"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              State
                            </label>
                            <Input
                              value={editedProfile.state || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  state: e.target.value,
                                })
                              }
                              placeholder="State"
                              className="bg-gray-50 dark:bg-black"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Postal Code
                            </label>
                            <Input
                              value={editedProfile.postalCode || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  postalCode: e.target.value,
                                })
                              }
                              placeholder="Postal Code"
                              className="bg-gray-50 dark:bg-black"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Country
                            </label>
                            <Input
                              value={editedProfile.country || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  country: e.target.value,
                                })
                              }
                              placeholder="Country"
                              className="bg-gray-50 dark:bg-black"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {profile.address}
                        <br />
                        {profile.city}, {profile.state} - {profile.postalCode}
                        <br />
                        {profile.country}
                      </p>
                    )}
                  </Card>

                  {/* Preferences */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Account Status
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-700 dark:text-gray-300">Account Type</span>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Customer
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-700 dark:text-gray-300">Profile Status</span>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-700 dark:text-gray-300">Location</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {profile.city}, {profile.state}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card className="p-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center">
                    <FiCalendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Bookings Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      You haven't made any bookings yet. Start by finding skilled workers.
                    </p>
                    <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={25}>
                      <Button 
                        onClick={() => router.push("/customer/search")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <FiBriefcase className="mr-2 h-4 w-4" />
                        Browse Workers
                      </Button>
                    </ClickSpark>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
