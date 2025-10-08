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
  FiNavigation,
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

type Job = {
  id: string;
  description: string;
  details: string | null;
  date: string;
  time: string;
  location: string;
  charge: number;
  charges?: number;
  createdAt: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  worker: {
    name: string | null;
    city?: string;
  };
  review?: { id: string; rating: number; comment: string | null } | null;
};

export default function CustomerProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<CustomerProfile>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">(
    "overview"
  );
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [bookings, setBookings] = useState<Job[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    setFetchingLocation(true);
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

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
            alert(
              "Location permission denied. Please enable location access in your browser settings."
            );
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

  useEffect(() => {
    if (activeTab === "bookings" && bookings.length === 0 && !bookingsLoading) {
      loadBookings();
    }
  }, [activeTab, bookings.length, bookingsLoading]);

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

  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch("/api/customer/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.jobs || []);
    } catch (e) {
      console.error("Error loading bookings:", e);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.customerProfile) {
    return (
      <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <FiAlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
              Please complete your onboarding to view your profile.
            </p>
            <Button
              onClick={() => router.push("/onboarding")}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              Complete Onboarding
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const profile = data.customerProfile;

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full sm:w-auto"
            >
              <FiEdit2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <ClickSpark sparkColor="#22c55e" sparkCount={10} sparkRadius={20}>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                >
                  <FiSave className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </ClickSpark>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-sm sm:text-base"
              >
                <FiX className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 lg:sticky lg:top-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center border-2 sm:border-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-gray-900">
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
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".initials-avatar")
                          ) {
                            const initialsDiv = document.createElement("div");
                            initialsDiv.className =
                              "initials-avatar text-blue-500 dark:text-blue-400 text-lg sm:text-2xl lg:text-4xl font-bold flex items-center justify-center w-full h-full";
                            initialsDiv.textContent = data.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2);
                            parent.appendChild(initialsDiv);
                          }
                        }}
                      />
                    ) : (
                      <div className="text-blue-500 dark:text-blue-400 text-lg sm:text-2xl lg:text-4xl font-bold">
                        {data.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {data.name}
                </h2>

                {/* Role Badge */}
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0 text-xs sm:text-sm">
                  Customer
                </Badge>

                {/* Contact Info */}
                <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6 text-left">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FiMail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 truncate min-w-0">
                      {data.email}
                    </span>
                  </div>

                  {data.phone && !data.phone.startsWith("no-phone-") && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <FiPhone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {data.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {profile.city}, {profile.state}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <ClickSpark
                    sparkColor="#60a5fa"
                    sparkCount={10}
                    sparkRadius={20}
                  >
                    <Button
                      onClick={() => router.push("/customer/search")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                    >
                      <FiBriefcase className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Find Workers
                    </Button>
                  </ClickSpark>
                  <Button
                    onClick={() => router.push("/customer/bookings")}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 text-sm sm:text-base"
                  >
                    <FiCalendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
                  className={`flex-1 px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 capitalize ${
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
                  <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiUser className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Account Information
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                            {data.name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-all">
                            {data.email}
                          </p>
                        </div>
                      </div>
                      {data.phone && !data.phone.startsWith("no-phone-") && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                            {data.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Address */}
                  <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          Address
                        </h3>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={handleGetCurrentLocation}
                          disabled={fetchingLocation}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                        >
                          <FiNavigation
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              fetchingLocation ? "animate-spin" : ""
                            }`}
                          />
                          {fetchingLocation
                            ? "Getting location..."
                            : "Use Current Location"}
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                            className="bg-white dark:bg-black text-sm sm:text-base"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                              className="bg-white dark:bg-black text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                              className="bg-white dark:bg-black text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                              className="bg-white dark:bg-black text-sm sm:text-base"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                              className="bg-white dark:bg-black text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        {profile.address}
                        <br />
                        {profile.city}, {profile.state} - {profile.postalCode}
                        <br />
                        {profile.country}
                      </p>
                    )}
                  </Card>

                  {/* Preferences */}
                  <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Account Status
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Account Type
                        </span>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                          Customer
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Profile Status
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Location
                        </span>
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
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
                  className="space-y-4 sm:space-y-6"
                >
                  {bookingsLoading ? (
                    // Skeleton Loading
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card
                          key={i}
                          className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 animate-pulse">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : bookings.length === 0 ? (
                    // Empty State
                    <Card className="p-8 sm:p-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center">
                      <FiCalendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Bookings Yet
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        You haven&apos;t made any bookings yet. Start by finding
                        skilled workers.
                      </p>
                      <ClickSpark
                        sparkColor="#60a5fa"
                        sparkCount={12}
                        sparkRadius={25}
                      >
                        <Button
                          onClick={() => router.push("/customer/search")}
                          className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
                        >
                          <FiBriefcase className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Browse Workers
                        </Button>
                      </ClickSpark>
                    </Card>
                  ) : (
                    // Booking Cards
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card
                          key={booking.id}
                          className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiBriefcase className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                <div>
                                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {booking.description}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {booking.worker?.name || "Worker"} •{" "}
                                    {booking.worker?.city}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`text-xs ${
                                      booking.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : booking.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    }`}
                                  >
                                    {booking.status}
                                  </Badge>
                                  {booking.charges && (
                                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                      ₹{booking.charges}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                  Booked on{" "}
                                  {new Date(
                                    booking.createdAt
                                  ).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs sm:text-sm"
                                    onClick={() =>
                                      router.push(`/customer/bookings`)
                                    }
                                  >
                                    View Details
                                  </Button>
                                  {booking.status === "COMPLETED" && (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                                    >
                                      Leave Review
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
