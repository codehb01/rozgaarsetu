"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileDropzone } from "@/components/ui/file-dropzone";
import StaggeredDropDown from "@/components/ui/staggered-dropdown";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  User,
  Wrench,
  MapPin,
  DollarSign,
  Camera,
  CheckCircle,
  Plus,
  X,
  LocateFixed,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import { useLocation } from "@/hooks/use-location";
import { formatDisplayAddress } from "@/lib/location";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import ClickSpark from "@/components/ClickSpark";

interface WorkerFormData {
  aadharNumber: string;
  qualification: string;
  certificates: string[];
  skilledIn: string[];
  availableAreas: string[];
  yearsExperience: number;
  hourlyRate: number;
  minimumFee: number;
  profilePic: File[];
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic details about you",
    icon: User,
  },
  {
    id: 2,
    title: "Skills & Services",
    description: "What you specialize in",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Pricing",
    description: "Set your rates",
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Location",
    description: "Where you work",
    icon: MapPin,
  },
  {
    id: 5,
    title: "Profile",
    description: "Complete your profile",
    icon: Camera,
  },
];

const popularSkills = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "AC Repair",
  "Appliance Repair",
  "Masonry",
  "Welding",
  "Roofing",
  "Flooring",
  "Pest Control",
  "Moving",
  "Handyman",
];

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

const experienceLevels = [
  { range: "0-1", label: "New", description: "Just starting", years: 0 },
  { range: "2-5", label: "Experienced", description: "Few years", years: 3 },
  { range: "6-10", label: "Expert", description: "Many years", years: 8 },
  { range: "10+", label: "Master", description: "Very experienced", years: 10 },
];

export default function WorkerDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [selectedQualification, setSelectedQualification] = useState("");
  const [customQualification, setCustomQualification] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<number | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<WorkerFormData>({
    defaultValues: {
      skilledIn: [],
      qualification: "",
      certificates: [],
      aadharNumber: "",
      yearsExperience: 0,
      hourlyRate: undefined,
      minimumFee: undefined,
      profilePic: [],
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      availableAreas: [],
    },
  });

  // Geolocation hook for autofill
  const { getCurrentPosition, status: geoStatus, place } = useLocation();

  // Apply geocode result to form fields
  const applyGeocode = (res: {
    address?: {
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
    coords?: {
      lat?: number;
      lng?: number;
    };
    displayName?: string;
  }) => {
    const addr = res?.address || {};
    setValue("address", formatDisplayAddress(addr) || res?.displayName || "");
    if (addr.city) setValue("city", addr.city);
    if (addr.state) setValue("state", addr.state);
    if (addr.country) setValue("country", addr.country);
    if (addr.postalCode) setValue("postalCode", addr.postalCode);
    if (res?.coords?.lat) setValue("latitude", res.coords.lat);
    if (res?.coords?.lng) setValue("longitude", res.coords.lng);
  };

  // When user clicks "Use my location", hook updates `place`; reflect into form
  if (typeof window !== "undefined" && place && geoStatus === "success") {
    // best-effort: only set if address field is empty to avoid clobbering typed input
    if (!watch("address")) {
      applyGeocode(place);
      if (place?.coords) {
        setValue("latitude", place.coords.lat);
        setValue("longitude", place.coords.lng);
      }
    }
  }

  const currentStepData = steps.find((step) => step.id === currentStep);
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      setValue("skilledIn", updatedSkills);
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setValue("skilledIn", updatedSkills);
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  // Format Aadhar number with dashes (XXXX-XXXX-XXXX)
  const formatAadharNumber = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 12 digits
    const limitedDigits = digitsOnly.slice(0, 12);

    // Add dashes after every 4 digits
    let formatted = "";
    for (let i = 0; i < limitedDigits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += "-";
      }
      formatted += limitedDigits[i];
    }

    return formatted;
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadharNumber(e.target.value);
    setValue("aadharNumber", formatted);
  };

  const handleQualificationChange = (value: string) => {
    setSelectedQualification(value);
    if (value !== "other") {
      const selected = qualificationOptions.find((q) => q.value === value);
      setValue("qualification", selected?.label || value);
      setCustomQualification("");
    }
  };

  const handleExperienceSelect = (years: number) => {
    setSelectedExperience(years);
    setValue("yearsExperience", years);
  };

  const bioExamples = [
    "I am a plumber with 5 years experience. I can fix taps, pipes, and bathrooms. I work fast and clean.",
    "Experienced electrician. I do house wiring, fan installation, and repair work. Available for emergency calls.",
    "Professional painter with 3 years experience. I paint houses, offices and do wall designs. Quality work guaranteed.",
  ];

  const nextStep = async () => {
    // Custom validation for step 1
    if (currentStep === 1) {
      const aadhar = watch("aadharNumber");
      const digitsOnly = aadhar?.replace(/\D/g, "") || "";

      if (digitsOnly.length !== 12) {
        return;
      }

      if (!selectedQualification) {
        return;
      }

      if (selectedExperience === null) {
        return;
      }
    }

    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof WorkerFormData)[] => {
    switch (step) {
      case 1:
        return ["aadharNumber", "qualification", "yearsExperience", "bio"];
      case 2:
        return ["skilledIn"];
      case 3:
        return ["hourlyRate", "minimumFee"];
      case 4:
        return ["address", "city", "state", "country", "postalCode"];
      case 5:
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: WorkerFormData) => {
    setIsLoading(true);

    try {
      // Store form data in sessionStorage for later use
      sessionStorage.setItem("workerDetails", JSON.stringify(data));

      // Navigate to previous work page
      router.push("/onboarding/previous-work");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with ShimmerText */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-3"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              className="mb-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Role Selection
            </Button>

            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                <ShimmerText
                  text="Worker Profile Setup"
                  className="text-gray-900 dark:text-white"
                />
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Let&apos;s create your professional profile in just a few steps
              </p>
            </div>
          </motion.div>

          {/* Step Indicator - Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center max-w-3xl mx-auto px-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    {/* Icon Container */}
                    <div
                      className={`
                      relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl transition-all duration-300
                      ${
                        isActive
                          ? "bg-blue-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 scale-110"
                          : isCompleted
                          ? "bg-blue-100 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-600"
                          : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <StepIcon
                          className={`h-4 w-4 md:h-5 md:w-5 ${
                            isActive
                              ? "text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 transition-all duration-300 ${
                          currentStep > step.id
                            ? "bg-blue-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        style={{
                          width: "calc((100vw - 40px - 200px) / 4)",
                          maxWidth: "120px",
                          minWidth: "40px",
                          margin: "0 8px",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Badge */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-400/20">
                        <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Step {currentStep} of {steps.length}
                        </span>
                      </div>
                    </div>

                    {/* Step Content */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Personal Information
                          </h2>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Tell us about your background and experience
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Aadhar Number
                            </label>
                            <Input
                              placeholder="XXXX-XXXX-XXXX"
                              value={watch("aadharNumber") || ""}
                              onChange={handleAadharChange}
                              maxLength={14}
                              className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-mono tracking-wider"
                            />
                            {errors.aadharNumber && (
                              <p className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.aadharNumber.message}
                              </p>
                            )}
                            {watch("aadharNumber") &&
                              watch("aadharNumber").replace(/\D/g, "")
                                .length === 12 && (
                                <p className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Valid Aadhar number
                                </p>
                              )}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                          >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Education
                            </label>

                            {/* Staggered Dropdown */}
                            <StaggeredDropDown
                              items={qualificationOptions}
                              selected={selectedQualification}
                              onSelect={(value) => {
                                if (value === "other") {
                                  setSelectedQualification("");
                                } else {
                                  setSelectedQualification(value);
                                  setCustomQualification("");
                                  setValue(
                                    "qualification",
                                    qualificationOptions.find(
                                      (q) => q.value === value
                                    )?.label || value
                                  );
                                }
                              }}
                              label={
                                selectedQualification
                                  ? qualificationOptions.find(
                                      (q) => q.value === selectedQualification
                                    )?.label
                                  : "Select your education level"
                              }
                            />

                            {selectedQualification === "other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <Input
                                  placeholder="Enter your qualification"
                                  value={customQualification}
                                  onChange={(e) => {
                                    setCustomQualification(e.target.value);
                                    setValue("qualification", e.target.value);
                                  }}
                                  className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                />
                              </motion.div>
                            )}

                            {errors.qualification && (
                              <p className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.qualification.message}
                              </p>
                            )}
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-3"
                        >
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Experience Level
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {experienceLevels.map((level, idx) => {
                              const isSelected =
                                selectedExperience === level.years;
                              return (
                                <motion.div
                                  key={level.range}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4 + idx * 0.05 }}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                    isSelected
                                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20"
                                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm"
                                  }`}
                                  onClick={() =>
                                    handleExperienceSelect(level.years)
                                  }
                                >
                                  <div
                                    className={`text-sm font-semibold ${
                                      isSelected
                                        ? "text-blue-700 dark:text-blue-300"
                                        : "text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    {level.label}
                                  </div>
                                  <div
                                    className={`text-xs mt-0.5 ${
                                      isSelected
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  >
                                    {level.description}
                                  </div>
                                  {isSelected && (
                                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1" />
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-3"
                        >
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            About Yourself
                          </label>

                          {/* Tips Box */}
                          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-400/20">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              💡 What to write:
                            </p>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Your work experience</li>
                              <li>• What services you provide</li>
                              <li>• Your special skills</li>
                            </ul>
                          </div>

                          {/* Example Templates */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              Examples - Click to use:
                            </p>
                            <div className="space-y-2">
                              {bioExamples.map((example, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setValue("bio", example)}
                                  className="w-full text-left p-2 text-xs bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
                                >
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {example}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <Textarea
                            placeholder="Example: I am a plumber with 5 years experience. I can fix taps, pipes, bathrooms. I work fast and clean."
                            {...register("bio", {
                              required: "Please write about yourself",
                              minLength: {
                                value: 30,
                                message: "Please write at least 30 characters",
                              },
                            })}
                            className="min-h-28 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none"
                          />
                          <div className="flex justify-between items-center mt-1">
                            {errors.bio && (
                              <p className="text-red-500 text-xs md:text-sm">
                                {errors.bio.message}
                              </p>
                            )}
                            <p
                              className={`text-xs ml-auto ${
                                (watch("bio")?.length || 0) >= 30
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400"
                              }`}
                            >
                              {watch("bio")?.length || 0}/500
                              {(watch("bio")?.length || 0) >= 30 && " ✓"}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Skills & Services
                          </h2>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            What services do you provide?
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Select your skills
                          </label>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 mb-4">
                            {popularSkills.map((skill, index) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Badge
                                  variant={
                                    selectedSkills.includes(skill)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={`cursor-pointer w-full justify-center py-2 px-3 transition-all duration-200 ${
                                    selectedSkills.includes(skill)
                                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                  }`}
                                  onClick={() =>
                                    selectedSkills.includes(skill)
                                      ? removeSkill(skill)
                                      : addSkill(skill)
                                  }
                                >
                                  {skill}
                                  {selectedSkills.includes(skill) && (
                                    <X className="h-3 w-3 ml-1" />
                                  )}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              placeholder="Add custom skill"
                              value={customSkill}
                              onChange={(e) => setCustomSkill(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addCustomSkill()
                              }
                              className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                            />
                            <Button
                              type="button"
                              onClick={addCustomSkill}
                              disabled={!customSkill.trim()}
                              className="bg-blue-600 hover:bg-blue-700 h-11 md:h-12 px-4"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {selectedSkills.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-400/20"
                            >
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Selected skills ({selectedSkills.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="default"
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                    {skill}
                                    <X
                                      className="h-3 w-3 ml-1 cursor-pointer"
                                      onClick={() => removeSkill(skill)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {selectedSkills.length === 0 && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              💡 Select at least one skill to continue
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Set Your Rates
                          </h2>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Configure your pricing to attract customers
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Hourly Rate (₹)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10">
                                ₹
                              </span>
                              <Input
                                placeholder="500"
                                type="number"
                                step="50"
                                min="100"
                                className="h-11 md:h-12 pl-8 pr-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                {...register("hourlyRate", {
                                  required: "Hourly rate is required",
                                  min: {
                                    value: 100,
                                    message: "Minimum rate is ₹100/hour",
                                  },
                                  valueAsNumber: true,
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "ArrowUp" ||
                                    e.key === "ArrowDown"
                                  ) {
                                    e.preventDefault();
                                    const currentValue = parseInt(
                                      watch("hourlyRate")?.toString() || "0"
                                    );
                                    const newValue =
                                      e.key === "ArrowUp"
                                        ? Math.ceil((currentValue + 50) / 50) *
                                          50
                                        : Math.max(
                                            100,
                                            Math.floor(
                                              (currentValue - 50) / 50
                                            ) * 50
                                          );
                                    setValue("hourlyRate", newValue);
                                  }
                                }}
                              />
                            </div>
                            {errors.hourlyRate && (
                              <p className="text-red-500 text-xs md:text-sm">
                                {errors.hourlyRate.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              💡 Competitive rates: ₹300-800/hour
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                          >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Minimum Job Fee (₹)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10">
                                ₹
                              </span>
                              <Input
                                placeholder="1000"
                                type="number"
                                step="50"
                                min="200"
                                className="h-11 md:h-12 pl-8 pr-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                {...register("minimumFee", {
                                  required: "Minimum fee is required",
                                  min: {
                                    value: 200,
                                    message:
                                      "Minimum fee should be at least ₹200",
                                  },
                                  valueAsNumber: true,
                                })}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "ArrowUp" ||
                                    e.key === "ArrowDown"
                                  ) {
                                    e.preventDefault();
                                    const currentValue = parseInt(
                                      watch("minimumFee")?.toString() || "0"
                                    );
                                    const newValue =
                                      e.key === "ArrowUp"
                                        ? Math.ceil((currentValue + 50) / 50) *
                                          50
                                        : Math.max(
                                            200,
                                            Math.floor(
                                              (currentValue - 50) / 50
                                            ) * 50
                                          );
                                    setValue("minimumFee", newValue);
                                  }
                                }}
                              />
                            </div>
                            {errors.minimumFee && (
                              <p className="text-red-500 text-xs md:text-sm">
                                {errors.minimumFee.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              💡 For small jobs regardless of time spent
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-blue-50/50 dark:bg-blue-950/20 p-4 md:p-5 rounded-xl border border-blue-200/50 dark:border-blue-400/20"
                        >
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                            <span className="text-lg">💡</span> Pricing Tips
                          </h3>
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-0.5">
                                •
                              </span>
                              <span>
                                Start competitive and adjust based on demand
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-0.5">
                                •
                              </span>
                              <span>
                                Higher rates often signal quality to customers
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-0.5">
                                •
                              </span>
                              <span>Consider rush job premiums</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 dark:text-blue-400 mt-0.5">
                                •
                              </span>
                              <span>Factor in travel time and materials</span>
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Service Location
                          </h2>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Where do you provide your services?
                          </p>
                        </div>

                        <div className="space-y-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Full Address
                            </label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <OpenStreetMapInput
                                  value={watch("address")}
                                  onChange={(v) => setValue("address", v)}
                                  onSelect={applyGeocode}
                                  placeholder="Street address, building name, etc."
                                  inputClassName="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={getCurrentPosition}
                                className="whitespace-nowrap h-11 md:h-12 border-gray-200 dark:border-gray-700"
                                disabled={geoStatus === "locating"}
                              >
                                {geoStatus === "locating" ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <LocateFixed className="h-4 w-4 mr-2" />
                                )}
                                <span className="hidden md:inline">
                                  Use my location
                                </span>
                                <span className="md:hidden">Use location</span>
                              </Button>
                            </div>
                            {errors.address && (
                              <p className="text-red-500 text-xs md:text-sm mt-1">
                                {errors.address.message}
                              </p>
                            )}
                          </motion.div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-2"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                City
                              </label>
                              <Input
                                placeholder="Enter city name"
                                className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                {...register("city", {
                                  required: "City is required",
                                })}
                              />
                              {errors.city && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">
                                  {errors.city.message}
                                </p>
                              )}
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="space-y-2"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                State
                              </label>
                              <Input
                                placeholder="Enter state name"
                                className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                {...register("state", {
                                  required: "State is required",
                                })}
                              />
                              {errors.state && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">
                                  {errors.state.message}
                                </p>
                              )}
                            </motion.div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="space-y-2"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Country
                              </label>
                              <Input
                                placeholder="Enter country"
                                className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                {...register("country", {
                                  required: "Country is required",
                                })}
                              />
                              {errors.country && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">
                                  {errors.country.message}
                                </p>
                              )}
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="space-y-2"
                            >
                              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Postal Code
                              </label>
                              <Input
                                placeholder="Enter postal code"
                                className="h-11 md:h-12 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
                                {...register("postalCode", {
                                  required: "Postal code is required",
                                })}
                              />
                              {errors.postalCode && (
                                <p className="text-red-500 text-xs md:text-sm mt-1">
                                  {errors.postalCode.message}
                                </p>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Complete Your Profile
                          </h2>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            Add a profile picture to build trust
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-4"
                        >
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                            Profile Picture (Optional)
                          </label>

                          <Controller
                            name="profilePic"
                            control={control}
                            render={({ field }) => (
                              <FileDropzone
                                accept="image/*"
                                maxSize={5 * 1024 * 1024}
                                onChange={(file) =>
                                  field.onChange(file ? [file] : [])
                                }
                              />
                            )}
                          />

                          <p className="text-xs text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            💡 Upload a clear, professional photo to increase
                            your booking chances by 3x
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-green-50/50 dark:bg-green-950/20 p-5 md:p-6 rounded-xl border border-green-200/50 dark:border-green-400/20"
                        >
                          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                            <span className="text-xl">🎉</span> You&apos;re
                            almost done!
                          </h3>
                          <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                            Your profile is looking great. Next, you&apos;ll be
                            able to showcase your previous work and start
                            receiving job requests.
                          </p>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span>Personal information completed</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span>Skills and services added</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span>Pricing configured</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span>Location details provided</span>
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 md:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className="border-gray-200 dark:border-gray-700 h-11 md:h-12 px-4 md:px-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Back</span>
                  </Button>

                  {isLastStep ? (
                    <ClickSpark
                      sparkColor="#60a5fa"
                      sparkCount={12}
                      sparkRadius={25}
                    >
                      <Button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-11 md:h-12 px-6 md:px-8 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : null}
                        Complete Setup
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </ClickSpark>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-11 md:h-12 px-6 md:px-8 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
