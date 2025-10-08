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
import { FileDropzone } from "@/components/ui/file-dropzone";
import StaggeredDropDown from "@/components/ui/staggered-dropdown";
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
  FiPlus,
  FiNavigation,
} from "react-icons/fi";
import { getCurrentUser } from "@/app/api/actions/onboarding";
import ClickSpark from "@/components/ClickSpark";

// Qualification options from onboarding
const qualificationOptions = [
  { value: "no_formal", label: "No Formal Education" },
  { value: "primary", label: "Primary School (1-5th)" },
  { value: "middle", label: "Middle School (6-8th)" },
  { value: "high_school", label: "High School (9-10th)" },
  { value: "senior_secondary", label: "Senior Secondary (11-12th)" },
  { value: "iti", label: "ITI (Industrial Training)" },
  { value: "diploma", label: "Diploma" },
  { value: "graduate", label: "Graduate (Bachelor's)" },
  { value: "postgraduate", label: "Post Graduate (Master's)" },
  { value: "other", label: "Other (Enter Manually)" },
];

// Popular skills from onboarding
const popularSkills = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
  "Gardening", "AC Repair", "Appliance Repair", "Masonry", "Welding",
  "Roofing", "Flooring", "Pest Control", "Moving", "Handyman"
];

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    images: [] as File[],
    location: "",
  });
  const [uploadingProject, setUploadingProject] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [customQualification, setCustomQualification] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Helper function to safely get image URL from potentially stringified JSON
  const parseImageUrl = (imageField: string | null | undefined): string | null => {
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

  const getImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  const addSkill = (skill: string) => {
    const currentSkills = editedProfile.skilledIn || [];
    if (!currentSkills.includes(skill)) {
      setEditedProfile({ ...editedProfile, skilledIn: [...currentSkills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = editedProfile.skilledIn || [];
    setEditedProfile({ ...editedProfile, skilledIn: currentSkills.filter(s => s !== skill) });
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const handleQualificationChange = (value: string) => {
    if (value === "other") {
      // User will enter custom qualification
    } else {
      const option = qualificationOptions.find(opt => opt.value === value);
      setEditedProfile({ ...editedProfile, qualification: option?.label || value });
    }
  };

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
        latitude,
        longitude,
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
      const response = await fetch("/api/worker/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: editedProfile.bio,
          skilledIn: editedProfile.skilledIn,
          qualification: editedProfile.qualification,
          yearsExperience: editedProfile.yearsExperience,
          hourlyRate: editedProfile.hourlyRate,
          minimumFee: editedProfile.minimumFee,
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
        data.workerProfile = result.profile;
      }
      
      setIsEditing(false);
      await loadProfile();
    } catch (e) {
      console.error("Failed to save profile:", e);
      alert(e instanceof Error ? e.message : "Failed to save profile. Please try again.");
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

  const handleAddProject = async () => {
    if (!newWork.title.trim() || newWork.images.length === 0) {
      alert("Please enter a project title and select an image");
      return;
    }

    setUploadingProject(true);
    try {
      // TODO: Implement actual file upload and project creation API
      // For now, just show a message
      console.log("Adding project:", newWork);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setNewWork({
        title: "",
        description: "",
        images: [],
        location: "",
      });
      setShowAddForm(false);
      
      // Reload profile to show new project
      await loadProfile();
      
      alert("Project added successfully! Note: Full implementation requires file upload API.");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    } finally {
      setUploadingProject(false);
    }
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
                    {parseImageUrl(profile.profilePic) || user?.imageUrl ? (
                      <Image
                        src={parseImageUrl(profile.profilePic) || user?.imageUrl || ""}
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
                        className="min-h-32 bg-gray-50 dark:bg-black"
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
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Popular Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {popularSkills.map((skill, index) => (
                            <Badge
                              key={skill}
                              variant={(editedProfile.skilledIn || []).includes(skill) ? "default" : "outline"}
                              className={`cursor-pointer w-full justify-center py-2 px-3 transition-all duration-200 ${
                                (editedProfile.skilledIn || []).includes(skill)
                                  ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                              onClick={() => 
                                (editedProfile.skilledIn || []).includes(skill)
                                  ? removeSkill(skill) 
                                  : addSkill(skill)
                              }
                            >
                              {skill}
                              {(editedProfile.skilledIn || []).includes(skill) && (
                                <FiX className="h-3 w-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>

                        {/* Custom Skill Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom skill"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                            className="bg-gray-50 dark:bg-black"
                          />
                          <Button
                            type="button"
                            onClick={addCustomSkill}
                            disabled={!customSkill.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <FiPlus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Selected Skills */}
                        {(editedProfile.skilledIn || []).length > 0 && (
                          <div className="mt-4 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-400/20">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Selected skills ({(editedProfile.skilledIn || []).length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(editedProfile.skilledIn || []).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="default"
                                  className="bg-purple-600 text-white hover:bg-purple-700"
                                >
                                  {skill}
                                  <FiX 
                                    className="h-3 w-3 ml-1 cursor-pointer" 
                                    onClick={() => removeSkill(skill)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
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
                    )}
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
                          className="bg-gray-50 dark:bg-black"
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
                        <FiDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                          className="bg-gray-50 dark:bg-black"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
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
                        <div className="space-y-3">
                          <StaggeredDropDown
                            items={qualificationOptions}
                            selected={editedProfile.qualification || ""}
                            onSelect={handleQualificationChange}
                            label={editedProfile.qualification || "Select qualification"}
                          />
                          
                          {editedProfile.qualification === "Other (Enter Manually)" && (
                            <Input
                              value={customQualification}
                              onChange={(e) => {
                                setCustomQualification(e.target.value);
                                setEditedProfile({ ...editedProfile, qualification: e.target.value });
                              }}
                              placeholder="Enter your qualification"
                              className="bg-gray-50 dark:bg-black"
                            />
                          )}
                        </div>
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
                          className="bg-gray-50 dark:bg-black"
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
                </motion.div>
              )}

              {activeTab === "portfolio" && (
                <motion.div
                  key="portfolio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Add Project Button */}
                  {!showAddForm && (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Previous Work
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {profile.previousWorks?.length || 0} projects completed
                        </p>
                      </div>
                      <ClickSpark sparkColor="#60a5fa" sparkCount={10} sparkRadius={20}>
                        <Button 
                          onClick={() => setShowAddForm(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FiPlus className="mr-2 h-4 w-4" />
                          Add Project
                        </Button>
                      </ClickSpark>
                    </div>
                  )}

                  {/* Add Project Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add New Project
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowAddForm(false);
                                  setNewWork({
                                    title: "",
                                    description: "",
                                    images: [],
                                    location: "",
                                  });
                                }}
                              >
                                <FiX className="h-5 w-5" />
                              </Button>
                            </div>

                            <div className="grid gap-6">
                              {/* Title */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Project Title *
                                </label>
                                <Input
                                  placeholder="e.g., Kitchen Renovation"
                                  value={newWork.title}
                                  onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                />
                              </div>

                              {/* Location */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Location
                                </label>
                                <Input
                                  placeholder="e.g., Andheri, Mumbai"
                                  value={newWork.location}
                                  onChange={(e) => setNewWork({ ...newWork, location: e.target.value })}
                                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                                />
                              </div>

                              {/* Project Image */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Project Image *
                                </label>
                                <FileDropzone
                                  accept="image/*"
                                  maxSize={5 * 1024 * 1024}
                                  onChange={(file) => setNewWork({ ...newWork, images: file ? [file] : [] })}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Upload an image to showcase your work (max 5MB)
                                </p>
                              </div>

                              {/* Description */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Description
                                </label>
                                <Textarea
                                  placeholder="Describe the work you did, challenges faced, materials used..."
                                  value={newWork.description}
                                  onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-24"
                                  rows={4}
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowAddForm(false);
                                  setNewWork({
                                    title: "",
                                    description: "",
                                    images: [],
                                    location: "",
                                  });
                                }}
                                disabled={uploadingProject}
                              >
                                Cancel
                              </Button>
                              <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={25}>
                                <Button
                                  onClick={handleAddProject}
                                  disabled={uploadingProject || !newWork.title.trim() || newWork.images.length === 0}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {uploadingProject ? (
                                    <>
                                      <FiImage className="mr-2 h-4 w-4 animate-spin" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <FiCheckCircle className="mr-2 h-4 w-4" />
                                      Add Project
                                    </>
                                  )}
                                </Button>
                              </ClickSpark>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Portfolio Grid */}
                  <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    {profile.previousWorks && profile.previousWorks.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {profile.previousWorks.map((work, index) => {
                          // Debug: log the raw image data
                          console.log('Work:', work.title);
                          console.log('Raw images array:', work.images);
                          console.log('First image:', work.images?.[0]);
                          
                          const imageUrl = work.images && work.images.length > 0 
                            ? parseImageUrl(work.images[0]) 
                            : null;
                          console.log('Parsed image URL:', imageUrl);
                          
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
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = '<div class="flex flex-col items-center justify-center h-full"><svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs text-gray-500 mt-2">Image unavailable</p></div>';
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center gap-2">
                                  <FiImage className="h-12 w-12 text-gray-400" />
                                  <p className="text-xs text-gray-500 dark:text-gray-400">No image stored</p>
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
