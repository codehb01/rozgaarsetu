"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiStar,
  FiEdit2,
  FiSave,
  FiX,
  FiMail,
  FiPhone,
  FiAward,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiCamera,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { getCurrentUser } from "@/app/api/actions/onboarding";

type WorkerProfile = {
  id: string;
  userId: string;
  skilledIn: string[];
  qualification: string | null;
  certificates: string[];
  aadharNumber: string;
  yearsExperience: number | null;
  profilePic: string | null;
  bio: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  availableAreas: string[];
  latitude: number | null;
  longitude: number | null;
  hourlyRate: number | null;
  minimumFee: number | null;
  previousWorks: PreviousWork[];
};

type PreviousWork = {
  id: string;
  title: string | null;
  description: string | null;
  images: string[];
  location: string | null;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  workerProfile: WorkerProfile | null;
};

export default function WorkerProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<WorkerProfile>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "reviews">("overview");

  // Helper function to safely get image URL from potentially stringified JSON
  const getImageUrl = (imageField: string | null | undefined): string | null => {
    if (!imageField) return null;
    
    try {
      // Check if it's a JSON string
      if (imageField.startsWith('[') || imageField.startsWith('{')) {
        const parsed = JSON.parse(imageField);
        // Handle array format: [{"preview": "blob:..."}]
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].preview || parsed[0].url || parsed[0];
        }
        // Handle object format: {"preview": "blob:..."}
        if (parsed.preview || parsed.url) {
          return parsed.preview || parsed.url;
        }
        return parsed;
      }
      // It's already a plain URL string
      return imageField;
    } catch {
      // If parsing fails, return the original string if it looks like a URL
      if (imageField.startsWith('http://') || imageField.startsWith('https://') || imageField.startsWith('/')) {
        return imageField;
      }
      return null;
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
      if (user.workerProfile) {
        setEditedProfile(user.workerProfile);
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
      // TODO: Implement profile update API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated save
      setIsEditing(false);
      await loadProfile();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (data?.workerProfile) {
      setEditedProfile(data.workerProfile);
    }
    setIsEditing(false);
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <Card className="p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!data || !data.workerProfile) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please complete your onboarding to view your profile.
            </p>
            <Button onClick={() => router.push("/onboarding")} className="bg-blue-600 hover:bg-blue-700">
              Complete Onboarding
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const profile = data.workerProfile;

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
              Manage your professional information and portfolio
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
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
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
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900">
                    {getImageUrl(profile.profilePic) ? (
                      <Image
                        src={getImageUrl(profile.profilePic)!}
                        alt={data.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Hide broken image and show fallback
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <FiUser className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
                      <FiCamera className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {data.name}
                </h2>

                {/* Primary Skill Badge */}
                {profile.skilledIn && profile.skilledIn.length > 0 && (
                  <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-0">
                    {profile.skilledIn[0]}
                  </Badge>
                )}

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

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {profile.yearsExperience || 0}+
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Years Exp.
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {profile.previousWorks?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Projects
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </div>

          {/* Right Content - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex">
              {(["overview", "portfolio", "reviews"] as const).map((tab) => (
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
                  {/* Bio Section */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiFileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        About Me
                      </h3>
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.bio || ""}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, bio: e.target.value })
                        }
                        placeholder="Tell customers about yourself and your work..."
                        className="min-h-32 bg-gray-50 dark:bg-gray-900"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {profile.bio || "No bio added yet. Click 'Edit Profile' to add one."}
                      </p>
                    )}
                  </Card>

                  {/* Skills */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiBriefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Skills & Services
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skilledIn?.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border-0 px-4 py-2"
                        >
                          <FiCheckCircle className="mr-2 h-3 w-3" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Rates */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <FiDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Hourly Rate
                        </h3>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.hourlyRate || ""}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              hourlyRate: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter hourly rate"
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          ₹{profile.hourlyRate?.toFixed(2) || "Not set"}
                          {profile.hourlyRate && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              /hour
                            </span>
                          )}
                        </div>
                      )}
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <FiDollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Minimum Fee
                        </h3>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.minimumFee || ""}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              minimumFee: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter minimum fee"
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{profile.minimumFee?.toFixed(2) || "Not set"}
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Qualification & Experience */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <FiAward className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Qualification
                        </h3>
                      </div>
                      {isEditing ? (
                        <Input
                          value={editedProfile.qualification || ""}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              qualification: e.target.value,
                            })
                          }
                          placeholder="Enter qualification"
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          {profile.qualification || "Not specified"}
                        </p>
                      )}
                    </Card>

                    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <FiClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Experience
                        </h3>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.yearsExperience || ""}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              yearsExperience: parseInt(e.target.value),
                            })
                          }
                          placeholder="Years of experience"
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          {profile.yearsExperience
                            ? `${profile.yearsExperience} years`
                            : "Not specified"}
                        </p>
                      )}
                    </Card>
                  </div>

                  {/* Service Areas */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiMapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Service Areas
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.availableAreas?.map((area, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-gray-300 dark:border-gray-600"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Address */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FiMapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Address
                      </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.address}
                      <br />
                      {profile.city}, {profile.state} - {profile.postalCode}
                      <br />
                      {profile.country}
                    </p>
                  </Card>
                </motion.div>
              )}

              {activeTab === "portfolio" && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Previous Work
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {profile.previousWorks?.length || 0} projects completed
                        </p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <FiImage className="mr-2 h-4 w-4" />
                        Add Project
                      </Button>
                    </div>

                    {profile.previousWorks && profile.previousWorks.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {profile.previousWorks.map((work, index) => {
                          const imageUrl = work.images && work.images.length > 0 
                            ? getImageUrl(work.images[0]) 
                            : null;
                          
                          return (
                            <motion.div
                              key={work.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                            >
                              {imageUrl ? (
                                <div className="aspect-video relative bg-gray-100 dark:bg-gray-700">
                                  <Image
                                    src={imageUrl}
                                    alt={work.title || "Project"}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      // Show fallback icon on error
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                  <FiImage className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                              <div className="p-4">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                  {work.title || "Untitled Project"}
                                </h4>
                                {work.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {work.description}
                                  </p>
                                )}
                                {work.location && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                                    <FiMapPin className="h-3 w-3" />
                                    {work.location}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FiImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No projects added yet. Add your work to showcase your expertise.
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                      <FiStar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Customer Reviews
                      </h3>
                    </div>
                    <div className="text-center py-12">
                      <FiStar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No reviews yet. Complete jobs to receive customer feedback.
                      </p>
                    </div>
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
